import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/server/emailService';

const emailService = new EmailService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET request to check if order exists by paymentId
  if (req.method === 'GET') {
    try {
      const { paymentId } = req.query;
      
      if (!paymentId || typeof paymentId !== 'string') {
        return res.status(400).json({ message: 'Payment ID is required' });
      }

      const orders = await prisma.order.findMany({
        where: { paymentId }
      });

      return res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const orderData = req.body;
    
    // Validate required fields
    if (!orderData.customerInfo || !orderData.items || !orderData.totalAmount) {
      return res.status(400).json({ message: 'Missing required order data' });
    }

    // Calculate subtotal and discount
    const subtotal = orderData.subtotal || orderData.totalAmount;
    const discountAmount = orderData.discountAmount || 0;

    // If promo code was used, increment usage count and create usage log
    let promoCodeId = orderData.promoCodeId;
    if (orderData.promoCodeUsed) {
      try {
        // Find the promo code
        const promoCode = await prisma.promoCode.findFirst({
          where: {
            code: {
              equals: orderData.promoCodeUsed.toUpperCase(),
              mode: 'insensitive'
            }
          }
        });

        if (promoCode) {
          promoCodeId = promoCode.id;

          // Increment usage count
          await prisma.promoCode.update({
            where: { id: promoCode.id },
            data: {
              usedCount: {
                increment: 1
              }
            }
          });

          // Create usage log
          await prisma.promoCodeUsage.create({
            data: {
              promoCodeId: promoCode.id,
              customerEmail: orderData.customerInfo.email,
              discountApplied: discountAmount
            }
          });
        }
      } catch (promoError) {
        console.error('Error updating promo code usage:', promoError);
        // Don't fail the order if promo tracking fails
      }
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        customerInfo: orderData.customerInfo,
        items: orderData.items,
        subtotal,
        discountAmount,
        totalAmount: orderData.totalAmount,
        promoCodeId,
        promoCodeUsed: orderData.promoCodeUsed,
        paymentId: orderData.paymentId,
        status: 'completed'
      }
    });

    // Send confirmation email
    try {
      // Transform order data to match OrderEmailData interface
      const emailData = {
        customerInfo: orderData.customerInfo, // Use the original customerInfo from request
        items: orderData.items, // Use the original items from request
        orderId: order.id.toString(),
        subtotal: order.subtotal,
        discountAmount: order.discountAmount || 0,
        totalAmount: order.totalAmount,
        shippingCost: 0, // Default shipping cost
        promoCodeUsed: order.promoCodeUsed || undefined,
        paymentId: order.paymentId || ''
      };
      await emailService.sendOrderReceipt(emailData);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    return res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        status: order.status,
        paymentId: order.paymentId,
        totalAmount: order.totalAmount
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ 
      message: 'Failed to create order',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}