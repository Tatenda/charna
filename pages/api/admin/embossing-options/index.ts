import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const embossingOptions = await prisma.embossingOption.findMany({
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

  if (req.method === 'POST') {
    try {
      const { name, slug, price, images, active, sortOrder } = req.body;

      if (!name || !slug || price === undefined) {
        return res.status(400).json({ error: 'Name, slug, and price are required' });
      }

      // Validate images is an array
      if (!Array.isArray(images)) {
        return res.status(400).json({ error: 'Images must be an array' });
      }

      // Check if embossingOption is available in Prisma client
      if (!prisma.embossingOption) {
        console.error('Prisma client does not have embossingOption model. This usually means the Prisma client needs to be regenerated or the dev server needs to be restarted.');
        return res.status(500).json({ 
          error: 'EmbossingOption model not available. Please restart the dev server.',
          details: 'The Prisma client needs to be regenerated. Run: npx prisma generate, then restart the dev server.'
        });
      }

      const embossingOption = await prisma.embossingOption.create({
        data: {
          name,
          slug,
          price: parseInt(price),
          images,
          active: active !== undefined ? active : true,
          sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : 0,
        },
      });

      return res.status(201).json(embossingOption);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Slug must be unique' });
      }
      console.error('Error creating embossing option:', error);
      return res.status(500).json({ error: 'Failed to create embossing option' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
