import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { pageName } = req.query;

  if (!pageName || typeof pageName !== 'string') {
    return res.status(400).json({ message: 'Page name is required' });
  }

  try {
    const pageContent = await prisma.pageContent.findUnique({
      where: { 
        pageName,
        enabled: true // Only return enabled content
      }
    });

    if (!pageContent) {
      return res.status(404).json({ message: 'Page content not found' });
    }

    return res.status(200).json(pageContent);
  } catch (error: any) {
    console.error('Error fetching page content:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch page content',
      error: error.message 
    });
  }
}
