import { Product, Order, Contact } from '@/shared/types'

// Storage Interface
export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  
  // Orders
  createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  
  // Contacts
  createContact(contactData: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Prisma-based storage implementation
export class PrismaStorage implements IStorage {
  // Products
  async getAllProducts(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        isActive: true
      },
      include: {
        variants: {
          where: {
            isActive: true
          },
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
          where: {
            variant: {
              isActive: true
            }
          },
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
    
    return products.map(product => this.transformProduct(product))
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: { 
        featured: true,
        isActive: true
      },
      include: {
        variants: {
          where: {
            isActive: true
          },
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
          where: {
            variant: {
              isActive: true
            }
          },
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
    
    return products.map(product => this.transformProduct(product))
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const product = await prisma.product.findFirst({
      where: { 
        id,
        isActive: true
      },
      include: {
        variants: {
          where: {
            isActive: true
          },
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
          where: {
            variant: {
              isActive: true
            }
          },
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
    
    return product ? this.transformProduct(product) : undefined
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        categories: { 
          some: { 
            category: { slug: category } 
          } 
        }
      },
      include: {
        variants: {
          where: {
            isActive: true
          },
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
          where: {
            variant: {
              isActive: true
            }
          },
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
    
    return products.map(product => this.transformProduct(product))
  }

  // Orders
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const order = await prisma.order.create({
      data: {
        customerInfo: orderData.customerInfo,
        items: orderData.items as any, // Type assertion for JSON field
        subtotal: orderData.subtotal,
        discountAmount: orderData.discountAmount || 0,
        totalAmount: orderData.totalAmount,
        promoCodeId: orderData.promoCodeId,
        promoCodeUsed: orderData.promoCodeUsed,
        paymentId: orderData.paymentId,
        status: orderData.status
      }
    })
    
    return order as unknown as Order
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const order = await prisma.order.findUnique({
      where: { id }
    })
    
    return order as unknown as Order | undefined
  }

  async getAllOrders(): Promise<Order[]> {
    const orders = await prisma.order.findMany()
    return orders as unknown as Order[]
  }

  // Contacts
  async createContact(contactData: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact> {
    const contact = await prisma.contact.create({
      data: contactData
    })
    
    return contact
  }

  async getAllContacts(): Promise<Contact[]> {
    const contacts = await prisma.contact.findMany()
    return contacts
  }

  // Helper method to transform Prisma product to our Product interface
  private transformProduct(product: any): Product {
    const colors = product.variants
      .flatMap((variant: any) => variant.attributes)
      .filter((attr: any) => attr.attributeType === 'color')
      .map((attr: any) => attr.attributeValue)
      .filter((color: string, index: number, arr: string[]) => arr.indexOf(color) === index)

    const features = product.variants
      .flatMap((variant: any) => variant.attributes)
      .filter((attr: any) => attr.attributeType === 'feature')
      .map((attr: any) => attr.attributeValue)
      .filter((feature: string, index: number, arr: string[]) => arr.indexOf(feature) === index)

    const defaultVariant = product.variants.find((variant: any) => variant.isDefault) || product.variants[0]
    const images = defaultVariant ? defaultVariant.images : []

    // Transform categories to include category details
    const transformedCategories = product.categories?.map((pc: any) => ({
      id: pc.categoryId,
      name: pc.category?.name || '',
      slug: pc.category?.slug || '',
      displayName: pc.category?.displayName || '',
      isPrimary: pc.isPrimary
    })) || []

    // Get primary category for the main category field
    const primaryCategory = transformedCategories.find((cat: any) => cat.isPrimary)
    const mainCategory = primaryCategory?.slug || transformedCategories[0]?.slug || ''

    // Transform variants to clean up image paths
    const transformedVariants = product.variants?.map((variant: any) => ({
      ...variant,
      images: this.prependImagePath(variant.images)
    })) || []

    // Transform package items to clean up image paths
    const transformedPackageItems = product.packageItems?.map((item: any) => ({
      ...item,
      variant: {
        ...item.variant,
        images: this.prependImagePath(item.variant.images)
      }
    })) || []

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      longDescription: product.longDescription,
      price: product.basePrice,
      originalPrice: defaultVariant?.originalPrice,
      rating: product.rating,
      reviewCount: product.reviewCount,
      inStock: product.inStock,
      badge: product.badge,
      category: mainCategory,
      colors,
      features,
      images: this.prependImagePath(images),
      materials: product.materials,
      dimensions: product.dimensions,
      careInstructions: product.careInstructions,
      featured: product.featured,
      createdAt: product.createdAt,
      isPackage: product.isPackage,
      packageItems: transformedPackageItems,
      categories: transformedCategories,
      variants: transformedVariants
    }
  }

  // Helper function to remove leading slash from images
  private prependImagePath(images: string[]) {
    return images.map(img => {
      // Remove any existing leading slashes
      return img.replace(/^\/+/, '')
    })
  }
}

// Export the Prisma storage
export const storage = new PrismaStorage()