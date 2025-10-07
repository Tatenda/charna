import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Check authentication
  const session = await getServerSession(req, res, authOptions)
  if (!session || session.user?.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id } = req.query

  if (!id || isNaN(parseInt(id as string))) {
    return res.status(400).json({ message: 'Invalid product ID' })
  }

  try {
    if (req.method === 'GET') {
      // Get single product
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id as string) },
        include: {
          variants: {
            include: {
              attributes: true
            }
          },
          categories: {
            include: {
              category: true
            }
          },
          packageItems: {
            include: {
              variant: {
                include: {
                  attributes: true
                }
              }
            },
            orderBy: {
              displayOrder: 'asc'
            }
          }
        }
      })

      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }

      return res.status(200).json(product)
    }

    if (req.method === 'PUT') {
      // Update product
      const {
        name,
        slug,
        description,
        longDescription,
        basePrice,
        badge,
        materials,
        dimensions,
        careInstructions,
        featured,
        isPackage,
        isActive,
        images
      } = req.body

      // Validate required fields
      if (!name || !slug || !description || !basePrice || !materials || !dimensions || !careInstructions) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      // Check if slug is already taken by another product
      const existingProduct = await prisma.product.findFirst({
        where: {
          slug,
          id: { not: parseInt(id as string) }
        }
      })

      if (existingProduct) {
        return res.status(400).json({ message: 'Slug already exists' })
      }

      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(id as string) },
        data: {
          name,
          slug,
          description,
          longDescription,
          basePrice: parseInt(basePrice),
          badge: badge || null,
          materials,
          dimensions,
          careInstructions,
          featured: featured || false,
          isPackage: isPackage || false,
          isActive: isActive !== false, // Default to true if not specified
        },
        include: {
          variants: {
            include: {
              attributes: true
            }
          },
          categories: {
            include: {
              category: true
            }
          },
          packageItems: {
            include: {
              variant: {
                include: {
                  attributes: true
                }
              }
            },
            orderBy: {
              displayOrder: 'asc'
            }
          }
        }
      })

      // Update the default variant's images if provided
      if (images && Array.isArray(images)) {
        const defaultVariant = await prisma.productVariant.findFirst({
          where: {
            productId: parseInt(id as string),
            isDefault: true
          }
        })

        if (defaultVariant) {
          await prisma.productVariant.update({
            where: { id: defaultVariant.id },
            data: { images: images }
          })
        }
      }

      return res.status(200).json(updatedProduct)
    }

    if (req.method === 'DELETE') {
      // Delete product (soft delete by setting isActive to false, or hard delete)
      const { hardDelete } = req.query

      if (hardDelete === 'true') {
        // Hard delete - remove from database completely
        await prisma.product.delete({
          where: { id: parseInt(id as string) }
        })
        return res.status(200).json({ message: 'Product deleted successfully' })
      } else {
        // Soft delete - just deactivate
        await prisma.product.update({
          where: { id: parseInt(id as string) },
          data: { isActive: false }
        })
        return res.status(200).json({ message: 'Product deactivated successfully' })
      }
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (error) {
    console.error('Error in product API:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
