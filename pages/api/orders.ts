import type { NextApiRequest, NextApiResponse } from 'next';
import { MemStorage } from '../../server/storage.js';
import { EmailService } from '../../server/emailService.js';

const storage = new MemStorage();
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
      shippingCost: orderData.shippingCost || 0,
      paymentId: orderData.paymentId,
      status: 'completed'
    });

    console.log('Order created successfully:', {
      id: order.id,
      status: order.status,
      paymentId: order.paymentId,
      totalAmount: order.totalAmount
    });

    // Send email receipt
    try {
      console.log('Sending email receipt to:', orderData.customerInfo.email);
      await emailService.sendOrderReceipt({
        customerInfo: orderData.customerInfo,
        items: orderData.items,
        orderId: order.id.toString(),
        totalAmount: orderData.totalAmount,
        shippingCost: orderData.shippingCost || 0,
        paymentId: orderData.paymentId
      });
      console.log('Email receipt sent successfully');
    } catch (emailError) {
      console.error('Failed to send receipt email:', emailError);
      // Don't fail the order if email fails
    }

    return res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
