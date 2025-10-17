import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { id } = req.query
  const categoryId = parseInt(id as string)

  if (isNaN(categoryId)) {
    return res.status(400).json({ error: 'Invalid category ID' })
  }

  if (req.method === 'GET') {
    try {
      // Fetch all product-category relationships for this category
      const productCategories = await prisma.productCategory.findMany({
        where: { categoryId },
        include: {
          product: {
            include: {
              variants: {
                where: { isActive: true },
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          displayOrder: 'asc'
        }
      })

      // Transform to simpler format
      const products = productCategories.map(pc => ({
        id: pc.product.id,
        name: pc.product.name,
        displayOrder: pc.displayOrder,
        isPrimary: pc.isPrimary,
        variants: pc.product.variants
      }))

      return res.status(200).json(products)
    } catch (error) {
      console.error('Error fetching category products:', error)
      return res.status(500).json({ error: 'Failed to fetch category products' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

