import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  const embossingOptionId = parseInt(id as string);

  if (isNaN(embossingOptionId)) {
    return res.status(400).json({ error: 'Invalid embossing option ID' });
  }

  if (req.method === 'GET') {
    try {
      const embossingOption = await prisma.embossingOption.findUnique({
        where: { id: embossingOptionId },
      });

      if (!embossingOption) {
        return res.status(404).json({ error: 'Embossing option not found' });
      }

      return res.status(200).json(embossingOption);
    } catch (error: any) {
      console.error('Error fetching embossing option:', error);
      return res.status(500).json({ error: 'Failed to fetch embossing option' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name, slug, price, images, active, sortOrder } = req.body;

      if (!name || !slug || price === undefined) {
        return res.status(400).json({ error: 'Name, slug, and price are required' });
      }

      // Validate images is an array
      if (!Array.isArray(images)) {
        return res.status(400).json({ error: 'Images must be an array' });
      }

      const embossingOption = await prisma.embossingOption.update({
        where: { id: embossingOptionId },
        data: {
          name,
          slug,
          price: parseInt(price),
          images,
          active: active !== undefined ? active : true,
          sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : 0,
        },
      });

      return res.status(200).json(embossingOption);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Slug must be unique' });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Embossing option not found' });
      }
      console.error('Error updating embossing option:', error);
      return res.status(500).json({ error: 'Failed to update embossing option' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.embossingOption.delete({
        where: { id: embossingOptionId },
      });

      return res.status(200).json({ message: 'Embossing option deleted successfully' });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Embossing option not found' });
      }
      console.error('Error deleting embossing option:', error);
      return res.status(500).json({ error: 'Failed to delete embossing option' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
