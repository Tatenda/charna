import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/server/emailService';
import crypto from 'crypto';

const emailService = new EmailService();

/**
 * Verify Yoco webhook signature using HMAC
 * Yoco uses Svix for webhook delivery with signature format: v1,{signature}
 */
function verifyWebhookSignature(
  payload: string,
  signature: string | undefined,
  timestamp: string | undefined,
  secret: string
): boolean {
  if (!signature || !timestamp) {
    return false;
  }

  // Extract the actual signature (format: v1,signature)
  const signatureParts = signature.split(',');
  if (signatureParts.length !== 2 || signatureParts[0] !== 'v1') {
    return false;
  }
  const expectedSignature = signatureParts[1];

  // Create the signed content (timestamp.payload)
  const signedContent = `${timestamp}.${payload}`;

  // Compute HMAC using the webhook secret (base64 encoded)
  const hmac = crypto.createHmac('sha256', Buffer.from(secret.replace('whsec_', ''), 'base64'));
  hmac.update(signedContent);
  const computedSignature = hmac.digest('base64');

  // Compare signatures
  return crypto.timingSafeEqual(
    Buffer.from(computedSignature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Yoco Webhook Handler
 * 
 * This endpoint receives notifications from Yoco when payment events occur.
 * It creates orders server-side when payment is successfully completed.
 * 
 * Webhook events we handle:
 * - payment.succeeded
 * - checkout.succeeded
 * 
 * To configure: Add this URL in Yoco Dashboard → Settings → Webhooks
 * https://your-domain.com/api/webhooks/yoco
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST requests from Yoco
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify webhook signature for security
    const signature = req.headers['webhook-signature'] as string;
    const timestamp = req.headers['webhook-timestamp'] as string;
    const webhookSecret = process.env.YOCO_WEBHOOK_SECRET;

    if (webhookSecret && process.env.NODE_ENV === 'production') {
      // In production, always verify signature
      const rawBody = JSON.stringify(req.body);
      const isValid = verifyWebhookSignature(rawBody, signature, timestamp, webhookSecret);
      
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid webhook signature' });
      }
    }

    const event = req.body;

    // Handle payment success event
    if (event.type === 'payment.succeeded' || event.type === 'checkout.succeeded') {
      const paymentData = event.payload;
      const paymentId = paymentData.id;
      // checkoutId is in metadata, not in the main payload
      const checkoutId = paymentData.metadata?.checkoutId || paymentData.checkoutId || paymentData.checkout_id;
      const metadata = paymentData.metadata || {};

      // Check if order already exists for this payment
      const existingOrder = await prisma.order.findFirst({
        where: { paymentId }
      });

      if (existingOrder) {
        return res.status(200).json({ 
          message: 'Order already processed',
          orderId: existingOrder.id 
        });
      }

      // Try to retrieve pending checkout data from database
      // Handle case where checkoutId might be undefined
      let pendingCheckout = null;
      
      if (checkoutId) {
        pendingCheckout = await prisma.pendingCheckout.findUnique({
          where: { checkoutId }
        });
      }

      if (!pendingCheckout) {
        
        // Fallback: Create order from webhook metadata
        // The metadata contains items, customer info, etc.
        const items = metadata.items || [];
        const customerEmail = metadata.customerEmail || 'unknown@example.com';
        const customerName = metadata.customerName || 'Unknown Customer';
        const nameParts = customerName.split(' ');
        
        const customerInfo = {
          email: customerEmail,
          firstName: nameParts[0] || 'Unknown',
          lastName: nameParts.slice(1).join(' ') || 'Customer',
          phone: metadata.phone || '',
          address: metadata.address || '',
          city: metadata.city || '',
          province: metadata.province || '',
          postalCode: metadata.postalCode || ''
        };
        
        // Create order from webhook data
        const order = await prisma.order.create({
          data: {
            customerInfo,
            items,
            subtotal: paymentData.amount / 100, // Convert from cents
            discountAmount: 0, // Will be in metadata if promo was used
            totalAmount: paymentData.amount / 100,
            paymentId,
            status: 'completed',
            promoCodeUsed: metadata.promoCode,
            webhookPayload: event, // Store complete webhook payload
          }
        });

        // Send email
        try {
          const emailData = {
            customerInfo: customerInfo as any,
            items: items as any,
            orderId: order.id.toString(),
            totalAmount: order.totalAmount,
            shippingCost: 0,
            paymentId: paymentId || ''
          };
          await emailService.sendOrderReceipt(emailData);
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
        }

        return res.status(200).json({ 
          message: 'Order created from webhook metadata',
          orderId: order.id
        });
      }

      // Extract order data from pending checkout
      const customerInfo = pendingCheckout.customerInfo as any;
      const items = pendingCheckout.items as any;
      const { 
        subtotal, 
        discountAmount, 
        totalAmount, 
        promoCodeId, 
        promoCodeUsed 
      } = pendingCheckout;

      // Handle promo code tracking
      if (promoCodeUsed) {
        try {
          const promoCode = await prisma.promoCode.findFirst({
            where: {
              code: {
                equals: promoCodeUsed.toUpperCase(),
                mode: 'insensitive'
              }
            }
          });

          if (promoCode) {
            // Increment usage count
            await prisma.promoCode.update({
              where: { id: promoCode.id },
              data: { usedCount: { increment: 1 } }
            });

            // Create usage log
            await prisma.promoCodeUsage.create({
              data: {
                promoCodeId: promoCode.id,
                customerEmail: customerInfo.email,
                discountApplied: discountAmount || 0
              }
            });
          }
        } catch (promoError) {
          console.error('Error tracking promo code:', promoError);
        }
      }

      // Create the order
      const order = await prisma.order.create({
        data: {
          customerInfo,
          items,
          subtotal: subtotal || totalAmount,
          discountAmount: discountAmount || 0,
          totalAmount,
          promoCodeId,
          promoCodeUsed,
          paymentId,
          status: 'completed',
          webhookPayload: event, // Store complete webhook payload
        }
      });

      // Clean up pending checkout after order is created
      await prisma.pendingCheckout.delete({
        where: { checkoutId }
      }).catch(err => console.error('Error deleting pending checkout:', err));

      // Send order confirmation email
      try {
        const emailData = {
          customerInfo: customerInfo as any,
          items: items as any,
          orderId: order.id.toString(),
          totalAmount: order.totalAmount,
          shippingCost: 0,
          paymentId: order.paymentId || ''
        };
        await emailService.sendOrderReceipt(emailData);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }

      return res.status(200).json({ 
        message: 'Order created successfully',
        orderId: order.id 
      });
    }

    // Handle other webhook events
    return res.status(200).json({ message: 'Event received' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ 
      message: 'Webhook processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

