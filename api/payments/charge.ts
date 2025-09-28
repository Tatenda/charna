import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const response = await fetch('https://api.yoco.com/v1/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
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
