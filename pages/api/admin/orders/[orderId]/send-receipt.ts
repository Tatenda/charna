import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { EmailService } from '@/server/emailService';
import { prisma } from '@/lib/prisma';

const emailService = new EmailService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { orderId } = req.query;

  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  try {
    // Fetch order from database
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Prepare email data
    const emailData = {
      customerInfo: order.customerInfo as any,
      items: order.items as any,
      orderId: order.id.toString(),
      subtotal: order.subtotal,
      discountAmount: order.discountAmount || 0,
      totalAmount: order.totalAmount,
      shippingCost: 0,
      promoCodeUsed: order.promoCodeUsed || undefined,
      paymentId: order.paymentId || ''
    };

    // Send the receipt
    const emailSent = await emailService.sendOrderReceipt(emailData);

    if (emailSent) {
      return res.status(200).json({ 
        message: 'Receipt sent successfully',
        email: (order.customerInfo as any)?.email
      });
    } else {
      return res.status(500).json({ message: 'Failed to send receipt' });
    }

  } catch (error) {
    console.error('Error sending receipt:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

