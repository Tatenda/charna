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
  const productId = parseInt(id as string)

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' })
  }

  if (req.method === 'PUT') {
    try {
      const { categoryIds, primaryCategoryId, categoryOrders = {} } = req.body

      if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
        return res.status(400).json({ error: 'At least one category must be selected' })
      }

      if (!primaryCategoryId) {
        return res.status(400).json({ error: 'Primary category must be specified' })
      }

      if (!categoryIds.includes(primaryCategoryId)) {
        return res.status(400).json({ error: 'Primary category must be in the selected categories' })
      }

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: productId }
      })

      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }

      // Delete existing category assignments
      await prisma.productCategory.deleteMany({
        where: { productId }
      })

      // Create new category assignments
      const productCategories = await prisma.productCategory.createMany({
        data: categoryIds.map((categoryId: number) => ({
          productId,
          categoryId,
          isPrimary: categoryId === primaryCategoryId,
          displayOrder: categoryOrders[categoryId] ?? 0
        }))
      })

      // Fetch updated product with categories
      const updatedProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          categories: {
            include: {
              category: {
                include: {
                  parent: true
                }
              }
            }
          }
        }
      })

      return res.status(200).json(updatedProduct)
    } catch (error) {
      console.error('Error updating product categories:', error)
      return res.status(500).json({ error: 'Failed to update product categories' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

