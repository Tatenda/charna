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

  if (req.method === 'GET') {
    try {
      const sections = await prisma.landingPageSection.findMany({
        include: {
          images: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      });

      return res.status(200).json(sections);
    } catch (error) {
      console.error('Error fetching sections:', error);
      return res.status(500).json({ error: 'Failed to fetch sections' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, title, subtitle, enabled, order, settings } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Section name is required' });
      }

      const section = await prisma.landingPageSection.create({
        data: {
          name,
          title: title || null,
          subtitle: subtitle || null,
          enabled: enabled !== undefined ? enabled : true,
          order: order || 0,
          settings: settings || null
        },
        include: {
          images: true
        }
      });

      return res.status(201).json(section);
    } catch (error: any) {
      console.error('Error creating section:', error);
      
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Section with this name already exists' });
      }
      
      return res.status(500).json({ error: 'Failed to create section' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

