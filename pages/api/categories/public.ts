import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch all active categories with their relationships
    const categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      include: {
        children: {
          where: {
            isActive: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        },
        products: {
          where: {
            product: {
              isActive: true  // Only count active products
            }
          },
          include: {
            product: {
              include: {
                variants: {
                  where: {
                    isActive: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    // Transform to a cleaner format with variant counts
    const transformedCategories = categories.map(cat => {
      // Get all category IDs (this category + children)
      const allCategoryIds = [cat.id, ...cat.children.map(c => c.id)];
      
      // Collect all unique products across this category and its children
      const uniqueProducts = new Map();
      
      categories.forEach(category => {
        if (allCategoryIds.includes(category.id)) {
          category.products.forEach(pc => {
            if (!uniqueProducts.has(pc.product.id)) {
              uniqueProducts.set(pc.product.id, pc.product);
            }
          });
        }
      });

      // Count variants from unique products
      const totalVariantCount = Array.from(uniqueProducts.values()).reduce((total, product) => {
        return total + (product.variants?.length || 0);
      }, 0);

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        displayName: cat.displayName,
        description: cat.description,
        icon: cat.icon,
        image: cat.image,
        parentId: cat.parentId,
        sortOrder: cat.sortOrder,
        productCount: totalVariantCount, // Now counts variants including children
        children: cat.children.map(child => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
          displayName: child.displayName,
          description: child.description,
          icon: child.icon,
          parentId: child.parentId,
          sortOrder: child.sortOrder
        }))
      };
    });

    // Return only top-level categories (no parent)
    const topLevelCategories = transformedCategories.filter(cat => !cat.parentId);

    return res.status(200).json(topLevelCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

