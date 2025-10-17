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

  if (req.method === 'POST') {
    try {
      const { productOrders } = req.body as {
        productOrders: Array<{ productId: number; displayOrder: number }>
      }

      if (!productOrders || !Array.isArray(productOrders)) {
        return res.status(400).json({ error: 'Invalid product orders data' })
      }

      // Update each product-category relationship with new display order
      await Promise.all(
        productOrders.map(({ productId, displayOrder }) =>
          prisma.productCategory.updateMany({
            where: {
              categoryId,
              productId
            },
            data: {
              displayOrder
            }
          })
        )
      )

      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error reordering products:', error)
      return res.status(500).json({ error: 'Failed to reorder products' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

