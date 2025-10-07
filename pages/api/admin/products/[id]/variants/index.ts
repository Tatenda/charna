import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().min(0, "Price must be positive"),
  originalPrice: z.number().min(0).optional(),
  inStock: z.boolean().default(true),
  weight: z.number().min(0).optional(),
  images: z.array(z.string()).default([]),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  attributes: z.array(z.object({
    attributeType: z.string(),
    attributeValue: z.string(),
    displayOrder: z.number().default(0)
  })).default([])
})

const updateVariantSchema = createVariantSchema.partial()

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

  const { id: productId } = req.query

  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ message: 'Product ID is required' })
  }

  try {
    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (req.method === 'GET') {
      // Get all variants for a product
      const variants = await prisma.productVariant.findMany({
        where: { productId: parseInt(productId) },
        include: {
          attributes: {
            orderBy: { displayOrder: 'asc' }
          }
        },
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'asc' }
        ]
      })

      return res.status(200).json(variants)
    }

    if (req.method === 'POST') {
      // Create new variant
      const validatedData = createVariantSchema.parse(req.body)

      // Check if SKU is unique
      const existingVariant = await prisma.productVariant.findUnique({
        where: { sku: validatedData.sku }
      })

      if (existingVariant) {
        return res.status(400).json({ message: 'SKU already exists' })
      }

      // If this is set as default, unset other defaults
      if (validatedData.isDefault) {
        await prisma.productVariant.updateMany({
          where: { 
            productId: parseInt(productId),
            isDefault: true 
          },
          data: { isDefault: false }
        })
      }

      const variant = await prisma.productVariant.create({
        data: {
          productId: parseInt(productId),
          name: validatedData.name,
          sku: validatedData.sku,
          price: validatedData.price,
          originalPrice: validatedData.originalPrice,
          inStock: validatedData.inStock,
          weight: validatedData.weight,
          images: validatedData.images,
          isDefault: validatedData.isDefault,
          isActive: validatedData.isActive,
          attributes: {
            create: validatedData.attributes.map(attr => ({
              attributeType: attr.attributeType,
              attributeValue: attr.attributeValue,
              displayOrder: attr.displayOrder
            }))
          }
        },
        include: {
          attributes: {
            orderBy: { displayOrder: 'asc' }
          }
        }
      })

      return res.status(201).json(variant)
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
