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

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { tokenId, amount, currency = "ZAR" } = req.body;

    if (!tokenId || !amount) {
      return res.status(400).json({ message: 'Token ID and amount are required' });
    }

    const chargeData = {
      token: tokenId,
      amountInCents: amount,
      currency,
    };

    // Determine which keys to use based on environment
    const secretKey = process.env.YOCO_SECRET_KEY;
    
    if (!secretKey) {
      return res.status(500).json({ message: 'Missing Yoco secret key' });
    }

    const response = await fetch('https://api.yoco.com/v1/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify(chargeData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Yoco charge API error:', errorData);
      return res.status(response.status).json({
        message: 'Failed to process charge',
        error: errorData,
      });
    }

    const chargeResult = await response.json();
    return res.status(200).json(chargeResult);
  } catch (error) {
    console.error('Error processing charge:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
