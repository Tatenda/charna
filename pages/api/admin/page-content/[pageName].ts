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

  const { pageName } = req.query;

  if (!pageName || typeof pageName !== 'string') {
    return res.status(400).json({ message: 'Page name is required' });
  }

  // GET - Fetch page content
  if (req.method === 'GET') {
    try {
      const pageContent = await prisma.pageContent.findUnique({
        where: { pageName }
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

  // PUT - Update page content
  if (req.method === 'PUT') {
    try {
      const { title, content, metaTitle, metaDescription, enabled } = req.body;

      // Check if page content exists, if not create it
      let pageContent = await prisma.pageContent.findUnique({
        where: { pageName }
      });

      if (pageContent) {
        // Update existing
        pageContent = await prisma.pageContent.update({
          where: { pageName },
          data: {
            ...(title !== undefined && { title }),
            ...(content !== undefined && { content }),
            ...(metaTitle !== undefined && { metaTitle }),
            ...(metaDescription !== undefined && { metaDescription }),
            ...(enabled !== undefined && { enabled })
          }
        });
      } else {
        // Create new
        pageContent = await prisma.pageContent.create({
          data: {
            pageName,
            title: title || null,
            content: content || {},
            metaTitle: metaTitle || null,
            metaDescription: metaDescription || null,
            enabled: enabled !== undefined ? enabled : true
          }
        });
      }

      return res.status(200).json(pageContent);
    } catch (error: any) {
      console.error('Error updating page content:', error);
      return res.status(500).json({ 
        message: 'Failed to update page content',
        error: error.message 
      });
    }
  }

  // DELETE - Delete page content
  if (req.method === 'DELETE') {
    try {
      await prisma.pageContent.delete({
        where: { pageName }
      });

      return res.status(200).json({ message: 'Page content deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting page content:', error);
      return res.status(500).json({ 
        message: 'Failed to delete page content',
        error: error.message 
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
