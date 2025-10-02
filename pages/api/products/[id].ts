import type { NextApiRequest, NextApiResponse } from 'next';
import { MemStorage } from '../../../server/storage.js';

const storage = new MemStorage();

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
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await storage.getProductById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
