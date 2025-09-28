import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MemStorage } from '../server/storage';

const storage = new MemStorage();

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
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'Name, email, and message are required' 
      });
    }

    // Create contact entry
    const contact = await storage.createContact({
      name,
      email,
      message,
      createdAt: new Date()
    });

    return res.status(201).json({
      message: 'Contact form submitted successfully',
      contact
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
