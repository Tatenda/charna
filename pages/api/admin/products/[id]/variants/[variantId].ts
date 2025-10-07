import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required").optional(),
  sku: z.string().min(1, "SKU is required").optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  originalPrice: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
  weight: z.number().min(0).optional(),
  images: z.array(z.string()).optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  attributes: z.array(z.object({
    attributeType: z.string(),
    attributeValue: z.string(),
    displayOrder: z.number().default(0)
  })).optional()
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS')
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

  const { id: productId, variantId } = req.query

  if (!productId || typeof productId !== 'string' || !variantId || typeof variantId !== 'string') {
    return res.status(400).json({ message: 'Product ID and Variant ID are required' })
  }

  try {
    // Verify variant exists and belongs to product
    const existingVariant = await prisma.productVariant.findFirst({
      where: { 
        id: parseInt(variantId),
        productId: parseInt(productId)
      },
      include: {
        attributes: {
          orderBy: { displayOrder: 'asc' }
        }
      }
    })

    if (!existingVariant) {
      return res.status(404).json({ message: 'Variant not found' })
    }

    if (req.method === 'GET') {
      return res.status(200).json(existingVariant)
    }

    if (req.method === 'PUT') {
      // Update variant
      const validatedData = updateVariantSchema.parse(req.body)

      // Check if SKU is unique (if changing)
      if (validatedData.sku && validatedData.sku !== existingVariant.sku) {
        const skuExists = await prisma.productVariant.findUnique({
          where: { sku: validatedData.sku }
        })

        if (skuExists) {
          return res.status(400).json({ message: 'SKU already exists' })
        }
      }

      // If this is set as default, unset other defaults
      if (validatedData.isDefault === true) {
        await prisma.productVariant.updateMany({
          where: { 
            productId: parseInt(productId),
            id: { not: parseInt(variantId) },
            isDefault: true 
          },
          data: { isDefault: false }
        })
      }

      // Update variant
      const updatedVariant = await prisma.productVariant.update({
        where: { id: parseInt(variantId) },
        data: {
          name: validatedData.name,
          sku: validatedData.sku,
          price: validatedData.price,
          originalPrice: validatedData.originalPrice,
          inStock: validatedData.inStock,
          weight: validatedData.weight,
          images: validatedData.images,
          isDefault: validatedData.isDefault,
          isActive: validatedData.isActive,
        },
        include: {
          attributes: {
            orderBy: { displayOrder: 'asc' }
          }
        }
      })

      // Update attributes if provided
      if (validatedData.attributes) {
        // Delete existing attributes
        await prisma.variantAttribute.deleteMany({
          where: { variantId: parseInt(variantId) }
        })

        // Create new attributes
        if (validatedData.attributes.length > 0) {
          await prisma.variantAttribute.createMany({
            data: validatedData.attributes.map(attr => ({
              variantId: parseInt(variantId),
              attributeType: attr.attributeType,
              attributeValue: attr.attributeValue,
              displayOrder: attr.displayOrder
            }))
          })
        }

        // Fetch updated variant with attributes
        const finalVariant = await prisma.productVariant.findUnique({
          where: { id: parseInt(variantId) },
          include: {
            attributes: {
              orderBy: { displayOrder: 'asc' }
            }
          }
        })

        return res.status(200).json(finalVariant)
      }

      return res.status(200).json(updatedVariant)
    }

    if (req.method === 'DELETE') {
      // Don't allow deleting the last variant
      const variantCount = await prisma.productVariant.count({
        where: { productId: parseInt(productId) }
      })

      if (variantCount <= 1) {
        return res.status(400).json({ 
          message: 'Cannot delete the last variant. Products must have at least one variant.' 
        })
      }

      // Delete variant
      await prisma.productVariant.delete({
        where: { id: parseInt(variantId) }
      })

      return res.status(200).json({ message: 'Variant deleted successfully' })
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (error) {
    console.error('Variant API error:', error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      })
    }

    return res.status(500).json({ message: 'Internal server error' })
  }
}
