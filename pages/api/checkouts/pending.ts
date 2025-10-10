import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

/**
 * Store Pending Checkout Data
 * 
 * This endpoint stores checkout data before payment is initiated.
 * The webhook will use this data to create the order when payment succeeds.
 * 
 * This ensures orders are created even if the success page doesn't load.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      checkoutId,
      customerInfo,
      items,
      subtotal,
      discountAmount,
      totalAmount,
      promoCodeId,
      promoCodeUsed
    } = req.body;

    if (!checkoutId || !customerInfo || !items || !totalAmount) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }

    // Store pending checkout (expires in 1 hour)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const pendingCheckout = await prisma.pendingCheckout.create({
      data: {
        checkoutId,
        customerInfo,
        items,
        subtotal: subtotal || totalAmount,
        discountAmount: discountAmount || 0,
        totalAmount,
        promoCodeId,
        promoCodeUsed,
        expiresAt
      }
    });

    console.log(`Pending checkout stored: ${pendingCheckout.id} for checkout: ${checkoutId}`);

    return res.status(201).json({
      message: 'Pending checkout stored',
      id: pendingCheckout.id
    });

  } catch (error) {
    console.error('Error storing pending checkout:', error);
    return res.status(500).json({
      message: 'Failed to store pending checkout',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

