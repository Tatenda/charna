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
    const isProduction = process.env.NODE_ENV === "production";
    const secretKey = isProduction
      ? process.env.YOCO_LIVE_SECRET_KEY
      : process.env.YOCO_TEST_SECRET_KEY;
      
    if (!secretKey) {
      return res
        .status(500)
        .json({ message: "Yoco secret key not configured" });
    }

    // Note: In the Express version, this would use recentCheckouts array
    // For Vercel Functions, we don't have persistent memory, so we return empty
    // In a real implementation, you'd store checkout IDs in a database
    
    console.log('YOCO_SECRET_KEY available:', !!secretKey);
    console.log('Environment:', isProduction ? 'production' : 'development');
    
    // Return empty array since we don't have persistent storage for checkout IDs
    // In production, you'd want to store checkout IDs in a database
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
