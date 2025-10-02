import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    // Determine which keys to use based on environment
    const secretKey = process.env.YOCO_SECRET_KEY;
    
    if (!secretKey) {
      return res.status(500).json({ message: 'Missing Yoco secret key' });
    }

    // Fetch payment details from Yoco
    const response = await fetch(
      `https://api.yoco.com/v1/payments/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Yoco API error:', errorData);
      return res.status(response.status).json({
        message: 'Failed to fetch payment details',
        error: errorData,
      });
    }

    const paymentData = await response.json();
    return res.status(200).json(paymentData);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
