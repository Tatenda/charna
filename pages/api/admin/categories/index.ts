import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany({
        include: {
          parent: true,
          children: {
            include: {
              children: {
                include: {
                  _count: {
                    select: { products: true }
                  }
                }
              },
              _count: {
                select: { products: true }
              }
            }
          },
          _count: {
            select: { products: true }
          }
        },
        orderBy: [
          { sortOrder: 'asc' },
          { name: 'asc' }
        ]
      })

      return res.status(200).json(categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      return res.status(500).json({ error: 'Failed to fetch categories' })
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        name,
        slug,
        displayName,
        description,
        image,
        icon,
        parentId,
        sortOrder,
        isActive
      } = req.body

      // Validate required fields
      if (!name || !slug || !displayName) {
        return res.status(400).json({ error: 'Name, slug, and display name are required' })
      }

      // Check if slug already exists
      const existingCategory = await prisma.category.findUnique({
        where: { slug }
      })

      if (existingCategory) {
        return res.status(400).json({ error: 'Category with this slug already exists' })
      }

      const category = await prisma.category.create({
        data: {
          name,
          slug,
          displayName,
          description,
          image,
          icon,
          parentId: parentId || null,
          sortOrder: sortOrder || 0,
          isActive: isActive !== undefined ? isActive : true
        },
        include: {
          parent: true,
          children: true
        }
      })

      return res.status(201).json(category)
    } catch (error) {
      console.error('Error creating category:', error)
      return res.status(500).json({ error: 'Failed to create category' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

