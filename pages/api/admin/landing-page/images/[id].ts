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
  const imageId = parseInt(id as string, 10);

  if (isNaN(imageId)) {
    return res.status(400).json({ error: 'Invalid image ID' });
  }

  if (req.method === 'GET') {
    try {
      const image = await prisma.landingPageImage.findUnique({
        where: { id: imageId },
        include: {
          section: true
        }
      });

      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      return res.status(200).json(image);
    } catch (error) {
      console.error('Error fetching image:', error);
      return res.status(500).json({ error: 'Failed to fetch image' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const {
        imageUrl,
        altText,
        caption,
        linkUrl,
        order,
        enabled,
        metadata
      } = req.body;

      const image = await prisma.landingPageImage.update({
        where: { id: imageId },
        data: {
          ...(imageUrl !== undefined && { imageUrl }),
          ...(altText !== undefined && { altText }),
          ...(caption !== undefined && { caption }),
          ...(linkUrl !== undefined && { linkUrl }),
          ...(order !== undefined && { order }),
          ...(enabled !== undefined && { enabled }),
          ...(metadata !== undefined && { metadata })
        }
      });

      return res.status(200).json(image);
    } catch (error: any) {
      console.error('Error updating image:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Image not found' });
      }
      
      return res.status(500).json({ error: 'Failed to update image' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.landingPageImage.delete({
        where: { id: imageId }
      });

      return res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting image:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Image not found' });
      }
      
      return res.status(500).json({ error: 'Failed to delete image' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

