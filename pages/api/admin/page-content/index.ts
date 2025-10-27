import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // GET - List all page content
  if (req.method === 'GET') {
    try {
      const pageContents = await prisma.pageContent.findMany({
        orderBy: { pageName: 'asc' }
      });

      return res.status(200).json(pageContents);
    } catch (error: any) {
      console.error('Error fetching page contents:', error);
      return res.status(500).json({ 
        message: 'Failed to fetch page contents',
        error: error.message 
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
