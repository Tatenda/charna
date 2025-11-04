import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const embossingOptions = await prisma.embossingOption.findMany({
      where: {
        active: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
    });

    return res.status(200).json(embossingOptions);
  } catch (error: any) {
    console.error('Error fetching embossing options:', error);
    return res.status(500).json({ error: 'Failed to fetch embossing options' });
  }
}
