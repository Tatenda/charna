import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/server/emailService';

const emailService = new EmailService();

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
    console.log('=== YOCO WEBHOOK RECEIVED ===');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const event = req.body;

    // Verify webhook signature (optional but recommended for production)
    // const signature = req.headers['x-yoco-signature'];
    // if (!verifyYocoSignature(signature, req.body)) {
    //   return res.status(401).json({ message: 'Invalid signature' });
    // }

    // Handle payment success event
    if (event.type === 'payment.succeeded' || event.type === 'checkout.succeeded') {
      const paymentData = event.payload;
      const paymentId = paymentData.id;
      const checkoutId = paymentData.checkoutId;
      
      console.log(`Payment succeeded: ${paymentId}, Checkout: ${checkoutId}`);

      // Check if order already exists for this payment
      const existingOrder = await prisma.order.findFirst({
        where: { paymentId }
      });

      if (existingOrder) {
        console.log(`Order already exists for payment ${paymentId}, skipping creation`);
        return res.status(200).json({ 
          message: 'Order already processed',
          orderId: existingOrder.id 
        });
      }

      // Try to retrieve pending checkout data from database
      const pendingCheckout = await prisma.pendingCheckout.findUnique({
        where: { checkoutId }
      });

      if (!pendingCheckout) {
        console.error(`No pending checkout found for checkout ID: ${checkoutId}`);
        
        // Fallback: Try to extract from metadata
        const checkoutMetadata = paymentData.metadata || {};
        
        // Log the payment for manual processing
        await prisma.order.create({
          data: {
            customerInfo: {
              email: checkoutMetadata.customerEmail || 'unknown@example.com',
              firstName: checkoutMetadata.customerName?.split(' ')[0] || 'Unknown',
              lastName: checkoutMetadata.customerName?.split(' ').slice(1).join(' ') || 'Customer',
            },
            items: [],
            subtotal: 0,
            discountAmount: 0,
            totalAmount: paymentData.amount / 100, // Convert from cents
            paymentId,
            status: 'pending_verification', // Requires manual verification
            promoCodeUsed: checkoutMetadata.promoCode,
          }
        });

        return res.status(200).json({ 
          message: 'Payment received but order requires manual verification',
          warning: 'No pending checkout data found'
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
          status: 'completed'
        }
      });

      console.log(`Order ${order.id} created successfully via webhook`);

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
        console.log('Order confirmation email sent');
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }

      return res.status(200).json({ 
        message: 'Order created successfully',
        orderId: order.id 
      });
    }

    // Handle other webhook events
    console.log(`Unhandled webhook event type: ${event.type}`);
    return res.status(200).json({ message: 'Event received' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ 
      message: 'Webhook processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

