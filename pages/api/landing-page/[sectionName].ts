import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sectionName } = req.query;

  if (!sectionName || typeof sectionName !== 'string') {
    return res.status(400).json({ error: 'Section name is required' });
  }

  try {
    const section = await prisma.landingPageSection.findUnique({
      where: {
        name: sectionName
      },
      include: {
        images: {
          where: {
            enabled: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    if (!section.enabled) {
      return res.status(404).json({ error: 'Section is disabled' });
    }

    return res.status(200).json(section);
  } catch (error) {
    console.error(`Error fetching section ${sectionName}:`, error);
    return res.status(500).json({ error: 'Failed to fetch section' });
  }
}

