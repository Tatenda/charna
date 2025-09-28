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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch test checkouts from Yoco (this is a test endpoint)
    const response = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Yoco API error:', errorData);
      return res.status(response.status).json({
        message: 'Failed to fetch test checkouts',
        error: errorData,
      });
    }

    const checkoutsData = await response.json();
    return res.status(200).json(checkoutsData);
  } catch (error) {
    console.error('Error fetching test checkouts:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
