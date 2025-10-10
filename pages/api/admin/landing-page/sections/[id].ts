import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || session.user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  const sectionId = parseInt(id as string, 10);

  if (isNaN(sectionId)) {
    return res.status(400).json({ error: 'Invalid section ID' });
  }

  if (req.method === 'GET') {
    try {
      const section = await prisma.landingPageSection.findUnique({
        where: { id: sectionId },
        include: {
          images: {
            orderBy: { order: 'asc' }
          }
        }
      });

      if (!section) {
        return res.status(404).json({ error: 'Section not found' });
      }

      return res.status(200).json(section);
    } catch (error) {
      console.error('Error fetching section:', error);
      return res.status(500).json({ error: 'Failed to fetch section' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name, title, subtitle, enabled, order, settings } = req.body;

      const section = await prisma.landingPageSection.update({
        where: { id: sectionId },
        data: {
          ...(name !== undefined && { name }),
          ...(title !== undefined && { title }),
          ...(subtitle !== undefined && { subtitle }),
          ...(enabled !== undefined && { enabled }),
          ...(order !== undefined && { order }),
          ...(settings !== undefined && { settings })
        },
        include: {
          images: {
            orderBy: { order: 'asc' }
          }
        }
      });

      return res.status(200).json(section);
    } catch (error: any) {
      console.error('Error updating section:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Section not found' });
      }
      
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Section with this name already exists' });
      }
      
      return res.status(500).json({ error: 'Failed to update section' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.landingPageSection.delete({
        where: { id: sectionId }
      });

      return res.status(200).json({ message: 'Section deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting section:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Section not found' });
      }
      
      return res.status(500).json({ error: 'Failed to delete section' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

