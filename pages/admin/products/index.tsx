import { GetServerSideProps } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AdminLayout from "@/components/admin/layout/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  EyeOff
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/router"
import { useToast } from "@/hooks/use-toast"
import { getImagePath } from "@/lib/imageUtils"

interface Product {
  id: number
  name: string
  slug: string
  description: string
  basePrice: number
  rating: number
  reviewCount: number
  badge?: string
  materials: string
  dimensions: string
  careInstructions: string
  featured: boolean
  isPackage: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  _count: {
    variants: number
    categories: number
  }
  variants: Array<{
    id: number
    name: string
    sku: string
    price: number
    inStock: boolean
    images: string[]
  }>
  categories: Array<{
    category: {
      id: number
      name: string
      displayName: string
    }
  }>
}

interface ProductsPageProps {
  products: Product[]
  totalCount: number
}

export default function ProductsPage({ products, totalCount }: ProductsPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "featured">("all")
  const [deletingProduct, setDeletingProduct] = useState<number | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Filter products based on search and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.variants.some(v => v.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && product.isActive) ||
                         (statusFilter === "inactive" && !product.isActive) ||
                         (statusFilter === "featured" && product.featured)
    
    return matchesSearch && matchesStatus
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return
    }

    setDeletingProduct(productId)

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      toast({
        title: "Success",
        description: "Product deleted successfully!",
      })

      // Refresh the page to update the list
      router.reload()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingProduct(null)
    }
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10">
        <div className="space-y-6 p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading text-forest">Products Management</h1>
              <p className="text-sm text-botanical/80 font-medium mt-1">
                Manage your {totalCount} products and variants
              </p>
            </div>
            <Link href="/admin/products/new">
              <Button className="bg-gradient-to-r from-botanical to-sage hover:from-botanical/90 hover:to-sage/90 text-white font-heading font-medium">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>

          {/* Search and Filter Bar */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sage" />
                    <Input
                      placeholder="Search products by name, description, or SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-sage/30 focus:border-botanical/50"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    onClick={() => setStatusFilter("all")}
                    className={statusFilter === "all" ? "bg-botanical text-white" : "border-sage/30 text-botanical"}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === "active" ? "default" : "outline"}
                    onClick={() => setStatusFilter("active")}
                    className={statusFilter === "active" ? "bg-botanical text-white" : "border-sage/30 text-botanical"}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Active
                  </Button>
                  <Button
                    variant={statusFilter === "featured" ? "default" : "outline"}
                    onClick={() => setStatusFilter("featured")}
                    className={statusFilter === "featured" ? "bg-botanical text-white" : "border-sage/30 text-botanical"}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Featured
                  </Button>
                  <Button
                    variant={statusFilter === "inactive" ? "default" : "outline"}
                    onClick={() => setStatusFilter("inactive")}
                    className={statusFilter === "inactive" ? "bg-botanical text-white" : "border-sage/30 text-botanical"}
                  >
                    <EyeOff className="h-4 w-4 mr-1" />
                    Inactive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 overflow-hidden">
                {/* Product Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-sage/10 to-mint/10">
                  {product.variants.length > 0 && product.variants[0].images.length > 0 ? (
                        <Image
                          src={getImagePath(product.variants[0].images[0])}
                          alt={product.name}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sage/20 to-mint/20" style={{ display: product.variants.length === 0 || product.variants[0].images.length === 0 ? 'flex' : 'none' }}>
                    <Package className="h-16 w-16 text-sage/50" />
                  </div>
                  
                  {/* Badges overlay */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-1">
                    {product.featured && (
                      <Badge className="bg-gradient-to-r from-terracotta to-orange-300 text-white text-xs shadow-md">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge className={product.isActive ? "bg-botanical/90 text-white shadow-md" : "bg-gray-500/90 text-white shadow-md"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-heading text-forest group-hover:text-botanical transition-colors">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-botanical/70 mt-1 line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Product Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-botanical/70">Price:</span>
                      <span className="font-heading font-semibold text-forest">
                        {formatPrice(product.basePrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-botanical/70">Variants:</span>
                      <span className="text-forest">{product._count.variants}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-botanical/70">Categories:</span>
                      <span className="text-forest">{product._count.categories}</span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1">
                    {product.categories.slice(0, 3).map((cat) => (
                      <Badge key={cat.category.id} variant="outline" className="text-xs border-sage/30 text-sage">
                        {cat.category.displayName}
                      </Badge>
                    ))}
                    {product.categories.length > 3 && (
                      <Badge variant="outline" className="text-xs border-sage/30 text-sage">
                        +{product.categories.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/admin/products/${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-sage/30 text-botanical hover:bg-sage/10">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/products/${product.slug}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-sage/30 text-botanical hover:bg-sage/10">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      disabled={deletingProduct === product.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 text-sage/50 mx-auto mb-4" />
                <h3 className="text-xl font-heading text-forest mb-2">No products found</h3>
                <p className="text-botanical/70 mb-6">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first product"
                  }
                </p>
                <Link href="/admin/products/new">
                  <Button className="bg-gradient-to-r from-botanical to-sage hover:from-botanical/90 hover:to-sage/90 text-white font-heading font-medium">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session || session.user?.role !== "admin") {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    }
  }

  try {
    const products = await prisma.product.findMany({
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
          },
          take: 1, // Just get one variant for preview
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
      }
    })

    const totalCount = await prisma.product.count()

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        totalCount,
      },
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      props: {
        products: [],
        totalCount: 0,
      },
    }
  }
}
