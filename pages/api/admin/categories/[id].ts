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
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: {
          parent: true,
          children: true,
          products: {
            include: {
              product: {
                include: {
                  variants: {
                    where: { isDefault: true },
                    take: 1
                  }
                }
              }
            }
          }
        }
      })

      if (!category) {
        return res.status(404).json({ error: 'Category not found' })
      }

      return res.status(200).json(category)
    } catch (error) {
      console.error('Error fetching category:', error)
      return res.status(500).json({ error: 'Failed to fetch category' })
    }
  }

  if (req.method === 'PUT') {
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

      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id: categoryId }
      })

      if (!existingCategory) {
        return res.status(404).json({ error: 'Category not found' })
      }

      // If slug is being changed, check if new slug already exists
      if (slug && slug !== existingCategory.slug) {
        const slugExists = await prisma.category.findUnique({
          where: { slug }
        })

        if (slugExists) {
          return res.status(400).json({ error: 'Category with this slug already exists' })
        }
      }

      // Prevent circular parent relationships
      if (parentId && parentId === categoryId) {
        return res.status(400).json({ error: 'Category cannot be its own parent' })
      }

      const category = await prisma.category.update({
        where: { id: categoryId },
        data: {
          name: name || existingCategory.name,
          slug: slug || existingCategory.slug,
          displayName: displayName || existingCategory.displayName,
          description: description !== undefined ? description : existingCategory.description,
          image: image !== undefined ? image : existingCategory.image,
          icon: icon !== undefined ? icon : existingCategory.icon,
          parentId: parentId !== undefined ? (parentId || null) : existingCategory.parentId,
          sortOrder: sortOrder !== undefined ? sortOrder : existingCategory.sortOrder,
          isActive: isActive !== undefined ? isActive : existingCategory.isActive
        },
        include: {
          parent: true,
          children: true
        }
      })

      return res.status(200).json(category)
    } catch (error) {
      console.error('Error updating category:', error)
      return res.status(500).json({ error: 'Failed to update category' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Check if category has products
      const categoryWithProducts = await prisma.category.findUnique({
        where: { id: categoryId },
        include: {
          _count: {
            select: { products: true }
          },
          children: true
        }
      })

      if (!categoryWithProducts) {
        return res.status(404).json({ error: 'Category not found' })
      }

      if (categoryWithProducts._count.products > 0) {
        return res.status(400).json({ 
          error: `Cannot delete category with ${categoryWithProducts._count.products} assigned products. Remove products first.` 
        })
      }

      if (categoryWithProducts.children.length > 0) {
        return res.status(400).json({ 
          error: `Cannot delete category with ${categoryWithProducts.children.length} subcategories. Remove subcategories first.` 
        })
      }

      await prisma.category.delete({
        where: { id: categoryId }
      })

      return res.status(200).json({ message: 'Category deleted successfully' })
    } catch (error) {
      console.error('Error deleting category:', error)
      return res.status(500).json({ error: 'Failed to delete category' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

