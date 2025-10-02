import type { NextApiRequest, NextApiResponse } from 'next';
import { memStorage } from '@/server/storage';
import { EmailService } from '@/server/emailService';

const storage = memStorage;
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

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('=== ORDER CREATION REQUEST ===');
    console.log('Order data received:', JSON.stringify(req.body, null, 2));

    const orderData = req.body;
    
    // Validate required fields
    if (!orderData.customerInfo || !orderData.items || !orderData.totalAmount) {
      return res.status(400).json({ message: 'Missing required order data' });
    }

    // Create order
    const order = await storage.createOrder({
      customerInfo: orderData.customerInfo,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      paymentId: orderData.paymentId,
      status: 'completed'
    });

    console.log('Order created successfully:', {
      id: order.id,
      status: order.status,
      paymentId: order.paymentId,
      totalAmount: order.totalAmount
    });

    // Send confirmation email
    try {
      // Transform order data to match OrderEmailData interface
      const emailData = {
        customerInfo: orderData.customerInfo, // Use the original customerInfo from request
        items: orderData.items, // Use the original items from request
        orderId: order.id.toString(),
        totalAmount: order.totalAmount,
        shippingCost: 0, // Default shipping cost
        paymentId: order.paymentId || ''
      };
      await emailService.sendOrderReceipt(emailData);
      console.log('Order confirmation email sent successfully');
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