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

  if (req.method === 'POST') {
    try {
      const {
        sectionId,
        imageUrl,
        altText,
        caption,
        linkUrl,
        order,
        enabled,
        metadata
      } = req.body;

      if (!sectionId || !imageUrl || !altText) {
        return res.status(400).json({
          error: 'Section ID, image URL, and alt text are required'
        });
      }

      const image = await prisma.landingPageImage.create({
        data: {
          sectionId: parseInt(sectionId, 10),
          imageUrl,
          altText,
          caption: caption || null,
          linkUrl: linkUrl || null,
          order: order || 0,
          enabled: enabled !== undefined ? enabled : true,
          metadata: metadata || null
        }
      });

      return res.status(201).json(image);
    } catch (error: any) {
      console.error('Error creating image:', error);
      
      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Invalid section ID' });
      }
      
      return res.status(500).json({ error: 'Failed to create image' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

