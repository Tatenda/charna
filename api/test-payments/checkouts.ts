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
    const secretKey = process.env.YOCO_SECRET_KEY;
      
    if (!secretKey) {
      return res
        .status(500)
        .json({ message: "Yoco secret key not configured" });
    }
    return res.status(200).json({ 
      checkouts: [],
      message: "No recent checkouts found. Checkout IDs are not persisted in Vercel Functions."
    });
  } catch (error) {
    console.error('Error in test checkouts:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      checkouts: []
    });
  }
}
