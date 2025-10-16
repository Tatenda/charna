import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for product creation
const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Product slug is required"),
  description: z.string().min(1, "Product description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  basePrice: z.number().min(0, "Base price must be positive"),
  rating: z.number().min(1).max(50).default(50), // 5.0 * 10 = 50
  reviewCount: z.number().min(0).default(0),
  badge: z.string().optional(),
  materials: z.string().min(1, "Materials are required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  careInstructions: z.string().min(1, "Care instructions are required"),
  featured: z.boolean().default(false),
  isPackage: z.boolean().default(false),
  isActive: z.boolean().default(true),
  rangeIds: z.array(z.number()).default([]),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== "admin") {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, search, status } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Build where clause
      const where: any = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
          { variants: { some: { sku: { contains: search as string, mode: 'insensitive' } } } }
        ];
      }

      if (status && status !== 'all') {
        switch (status) {
          case 'active':
            where.isActive = true;
            break;
          case 'inactive':
            where.isActive = false;
            break;
          case 'featured':
            where.featured = true;
            break;
        }
      }

      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            _count: {
              select: {
                variants: true,
                categories: true,
              }
            },
            variants: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                inStock: true,
                images: true,
              }
            },
            categories: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                    displayName: true,
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip,
          take,
        }),
        prisma.product.count({ where })
      ]);

      return res.status(200).json({
        products,
        totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit))
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      // Validate request body
      const validatedData = createProductSchema.parse(req.body);

      // Check if slug already exists
      const existingProduct = await prisma.product.findUnique({
        where: { slug: validatedData.slug }
      });

      if (existingProduct) {
        return res.status(400).json({ message: 'Product with this slug already exists' });
      }

      // Create the product (no variants created automatically)
      const product = await prisma.product.create({
        data: {
          name: validatedData.name,
          slug: validatedData.slug,
          description: validatedData.description,
          longDescription: validatedData.longDescription,
          basePrice: validatedData.basePrice,
          rating: validatedData.rating,
          reviewCount: validatedData.reviewCount,
          badge: validatedData.badge,
          materials: validatedData.materials,
          dimensions: validatedData.dimensions,
          careInstructions: validatedData.careInstructions,
          featured: validatedData.featured,
          isPackage: validatedData.isPackage,
          isActive: validatedData.isActive,
          rangeIds: validatedData.rangeIds,
        },
        include: {
          _count: {
            select: {
              variants: true,
              categories: true,
            }
          },
          variants: true,
          categories: true,
        }
      });

      return res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: error.errors 
        });
      }
      
      console.error('Error creating product:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
