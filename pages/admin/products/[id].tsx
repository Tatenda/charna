import { GetServerSideProps } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AdminLayout from "@/components/admin/layout/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft,
  Save,
  Eye,
  Package,
  Star,
  Tag,
  Wrench,
  Info,
  FolderTree,
  Grid3X3
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
import { useToast } from "@/hooks/use-toast"
import VariantManagement from "@/components/admin/VariantManagement"
import CategorySelector from "@/components/admin/CategorySelector"
import RangeSelector from "@/components/admin/RangeSelector"

interface Product {
  id: number
  name: string
  slug: string
  description: string
  longDescription: string
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
  rangeIds?: number[]
  createdAt: string
  updatedAt: string
  variants: Array<{
    id: number
    name: string
    sku: string
    price: number
    originalPrice?: number
    inStock: boolean
    images: string[]
    isDefault: boolean
    createdAt: string
    updatedAt: string
  }>
  categories: Array<{
    category: {
      id: number
      name: string
      displayName: string
      slug: string
    }
    isPrimary: boolean
    displayOrder: number
  }>
}

interface ProductEditPageProps {
  product: Product
}

export default function ProductEditPage({ product }: ProductEditPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: product.name,
    slug: product.slug,
    description: product.description,
    longDescription: product.longDescription,
    basePrice: product.basePrice.toString(),
    badge: product.badge || "",
    materials: product.materials,
    dimensions: product.dimensions,
    careInstructions: product.careInstructions,
    featured: product.featured,
    isPackage: product.isPackage,
    isActive: product.isActive
  })

  // Category state
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    product.categories.map(c => c.category.id)
  )
  const [primaryCategoryId, setPrimaryCategoryId] = useState<number | null>(
    product.categories.find(c => c.isPrimary)?.category.id || null
  )
  const [categoryOrders, setCategoryOrders] = useState<Record<number, number>>(
    product.categories.reduce((acc, c) => {
      acc[c.category.id] = c.displayOrder
      return acc
    }, {} as Record<number, number>)
  )
  
  // Range state
  const [selectedRangeIds, setSelectedRangeIds] = useState<number[]>(
    product.rangeIds || []
  )

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate categories
    if (selectedCategoryIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one category",
        variant: "destructive",
      })
      return
    }

    if (!primaryCategoryId) {
      toast({
        title: "Error",
        description: "Please select a primary category",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Update product info
      const productResponse = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          basePrice: parseInt(formData.basePrice),
          rangeIds: selectedRangeIds,
        }),
      })

      if (!productResponse.ok) {
        throw new Error('Failed to update product')
      }

      // Update categories
      const categoriesResponse = await fetch(`/api/admin/products/${product.id}/categories`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryIds: selectedCategoryIds,
          primaryCategoryId: primaryCategoryId,
          categoryOrders: categoryOrders,
        }),
      })

      if (!categoriesResponse.ok) {
        throw new Error('Failed to update categories')
      }

      toast({
        title: "Success",
        description: "Product updated successfully!",
      })

      // Refresh the page to show updated data
      router.replace(router.asPath)
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoriesChange = (categoryIds: number[], primaryId: number | null, orders?: Record<number, number>) => {
    setSelectedCategoryIds(categoryIds)
    setPrimaryCategoryId(primaryId)
    if (orders) {
      setCategoryOrders(orders)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      toast({
        title: "Success",
        description: "Product deleted successfully!",
      })

      router.push('/admin/products')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10">
        <div className="space-y-6">
          {/* Redesigned Header */}
          <div className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 rounded-xl shadow-lg p-6">
            {/* Back Button */}
            <div className="mb-4">
              <Link href="/admin/products">
                <Button variant="ghost" size="sm" className="text-botanical/70 hover:text-botanical hover:bg-sage/10 -ml-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Button>
              </Link>
            </div>

            {/* Main Header Content */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              {/* Left: Product Info */}
              <div className="flex gap-4">
                {/* Product Icon/Badge */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-botanical/20 to-sage/20 border-2 border-sage/30 flex items-center justify-center">
                    <Package className="h-8 w-8 text-botanical" />
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1 className="text-3xl font-heading font-bold text-forest">
                      {formData.name}
                    </h1>
                    {formData.isActive ? (
                      <span className="px-3 py-1 rounded-full bg-botanical/10 text-botanical text-xs font-semibold border border-botanical/20">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold border border-gray-200">
                        Inactive
                      </span>
                    )}
                    {formData.featured && (
                      <span className="px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold border border-terracotta/20 flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                    {formData.isPackage && (
                      <span className="px-3 py-1 rounded-full bg-sage/10 text-botanical text-xs font-semibold border border-sage/20">
                        Package
                      </span>
                    )}
                  </div>
                  
                  <p className="text-botanical/70 mb-3 line-clamp-2">
                    {formData.description}
                  </p>

                  {/* Product Stats */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sage/5 border border-sage/20">
                      <span className="text-sm font-semibold text-forest">
                        R{parseInt(formData.basePrice || '0').toLocaleString()}
                      </span>
                      <span className="text-xs text-botanical/60">base price</span>
                    </div>
                    
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sage/5 border border-sage/20">
                      <Grid3X3 className="h-4 w-4 text-botanical" />
                      <span className="text-sm font-semibold text-forest">
                        {product.variants?.length || 0}
                      </span>
                      <span className="text-xs text-botanical/60">
                        variant{product.variants?.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {selectedCategoryIds.length > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sage/5 border border-sage/20">
                        <FolderTree className="h-4 w-4 text-botanical" />
                        <span className="text-sm font-semibold text-forest">
                          {selectedCategoryIds.length}
                        </span>
                        <span className="text-xs text-botanical/60">
                          categor{selectedCategoryIds.length === 1 ? 'y' : 'ies'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Quick Actions */}
              <div className="flex flex-col gap-2">
                <Link href={`/products/${product.slug}`} target="_blank">
                  <Button variant="outline" size="sm" className="border-sage/30 text-botanical hover:bg-sage/10 w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </Link>
                <Button 
                  onClick={handleDelete}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 w-full"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form with Tabs */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="details" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 bg-sage/10">
                    <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:text-botanical">
                      <Info className="h-4 w-4 mr-2" />
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="data-[state=active]:bg-white data-[state=active]:text-botanical">
                      <FolderTree className="h-4 w-4 mr-2" />
                      Categories
                    </TabsTrigger>
                    <TabsTrigger value="variants" className="data-[state=active]:bg-white data-[state=active]:text-botanical">
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      Variants
                    </TabsTrigger>
                  </TabsList>

                  {/* Details Tab */}
                  <TabsContent value="details" className="space-y-6">
                    {/* Basic Information */}
                    <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-heading text-forest flex items-center gap-2">
                      <Package className="h-5 w-5 text-botanical" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Core product details and identification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-botanical">
                        Product Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          handleInputChange('name', e.target.value)
                          // Auto-generate slug from name
                          const slug = e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, '')
                            .replace(/\s+/g, '-')
                            .replace(/-+/g, '-')
                            .trim()
                          handleInputChange('slug', slug)
                        }}
                        className="border-sage/30 focus:border-botanical/50"
                        required
                      />
                      <p className="text-xs text-botanical/70 mt-1">
                        Slug will be auto-generated from the product name
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="slug" className="text-sm font-medium text-botanical">
                        URL Slug (Auto-generated)
                      </Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        className="border-sage/30 bg-gray-50 text-gray-600"
                        readOnly
                        disabled
                      />
                      <p className="text-xs text-botanical/70 mt-1">
                        This slug is automatically generated and cannot be edited
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-botanical">
                        Short Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="border-sage/30 focus:border-botanical/50 min-h-[80px]"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="longDescription" className="text-sm font-medium text-botanical">
                        Detailed Description
                      </Label>
                      <Textarea
                        id="longDescription"
                        value={formData.longDescription}
                        onChange={(e) => handleInputChange('longDescription', e.target.value)}
                        className="border-sage/30 focus:border-botanical/50 min-h-[120px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="basePrice" className="text-sm font-medium text-botanical">
                          Base Price (Rands) *
                        </Label>
                        <Input
                          id="basePrice"
                          type="number"
                          value={formData.basePrice}
                          onChange={(e) => handleInputChange('basePrice', e.target.value)}
                          className="border-sage/30 focus:border-botanical/50"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="badge" className="text-sm font-medium text-botanical">
                          Badge
                        </Label>
                        <Input
                          id="badge"
                          value={formData.badge}
                          onChange={(e) => handleInputChange('badge', e.target.value)}
                          className="border-sage/30 focus:border-botanical/50"
                          placeholder="e.g., New, Sale, Featured"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Product Details */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-heading text-forest flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-botanical" />
                      Product Details
                    </CardTitle>
                    <CardDescription>
                      Technical specifications and care information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="materials" className="text-sm font-medium text-botanical">
                        Materials *
                      </Label>
                      <Input
                        id="materials"
                        value={formData.materials}
                        onChange={(e) => handleInputChange('materials', e.target.value)}
                        className="border-sage/30 focus:border-botanical/50"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="dimensions" className="text-sm font-medium text-botanical">
                        Dimensions *
                      </Label>
                      <Input
                        id="dimensions"
                        value={formData.dimensions}
                        onChange={(e) => handleInputChange('dimensions', e.target.value)}
                        className="border-sage/30 focus:border-botanical/50"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="careInstructions" className="text-sm font-medium text-botanical">
                        Care Instructions *
                      </Label>
                      <Textarea
                        id="careInstructions"
                        value={formData.careInstructions}
                        onChange={(e) => handleInputChange('careInstructions', e.target.value)}
                        className="border-sage/30 focus:border-botanical/50 min-h-[100px]"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
                  </TabsContent>

                  {/* Categories & Ranges Tab */}
                  <TabsContent value="categories" className="space-y-6">
                    {/* Categories */}
                    <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-xl font-heading text-forest flex items-center gap-2">
                          <Tag className="h-5 w-5 text-botanical" />
                          Categories
                        </CardTitle>
                        <CardDescription>
                          Assign this product to one or more categories (order managed per category)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CategorySelector
                          selectedCategoryIds={selectedCategoryIds}
                          primaryCategoryId={primaryCategoryId}
                          categoryOrders={categoryOrders}
                          onCategoriesChange={handleCategoriesChange}
                        />
                      </CardContent>
                    </Card>

                    {/* Range Assignment */}
                    <RangeSelector
                      selectedRangeIds={selectedRangeIds}
                      onChange={setSelectedRangeIds}
                    />
                  </TabsContent>

                  {/* Variants Tab */}
                  <TabsContent value="variants">
                    <VariantManagement
                      productId={product.id}
                      productName={product.name}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status Settings */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-heading text-forest flex items-center gap-2">
                      <Tag className="h-4 w-4 text-botanical" />
                      Status Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="featured" className="text-sm font-medium text-botanical">
                          Featured Product
                        </Label>
                        <p className="text-xs text-botanical/70">Show on homepage and featured sections</p>
                      </div>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleInputChange('featured', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="isPackage" className="text-sm font-medium text-botanical">
                          Package Product
                        </Label>
                        <p className="text-xs text-botanical/70">Contains multiple items</p>
                      </div>
                      <Switch
                        id="isPackage"
                        checked={formData.isPackage}
                        onCheckedChange={(checked) => handleInputChange('isPackage', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="isActive" className="text-sm font-medium text-botanical">
                          Active
                        </Label>
                        <p className="text-xs text-botanical/70">Product is available for sale</p>
                      </div>
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Product Preview */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-heading text-forest flex items-center gap-2">
                      <Eye className="h-4 w-4 text-botanical" />
                      Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <span className="text-botanical/70">Name:</span>
                      <p className="font-medium text-forest">{formData.name || "Product name..."}</p>
                    </div>
                    <div className="text-sm">
                      <span className="text-botanical/70">Slug:</span>
                      <p className="font-mono text-xs text-forest">{formData.slug || "product-slug..."}</p>
                    </div>
                    <div className="text-sm">
                      <span className="text-botanical/70">Price:</span>
                      <p className="font-medium text-forest">
                        {formData.basePrice ? `R${parseInt(formData.basePrice).toLocaleString()}` : "R0"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {formData.featured && (
                        <Badge className="bg-gradient-to-r from-terracotta to-orange-300 text-white text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {formData.isPackage && (
                        <Badge className="bg-gradient-to-r from-botanical to-sage text-white text-xs">
                          <Package className="h-3 w-3 mr-1" />
                          Package
                        </Badge>
                      )}
                      <Badge className={formData.isActive ? "bg-botanical/20 text-botanical" : "bg-gray-200 text-gray-600"}>
                        {formData.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-botanical to-sage hover:from-botanical/90 hover:to-sage/90 text-white font-heading font-medium"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session || session.user?.role !== 'admin') {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    }
  }

  const { id } = context.query

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        variants: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    })

    if (!product) {
      return {
        notFound: true,
      }
    }

    // Convert all Date objects to strings for JSON serialization
    const serializedProduct = JSON.parse(JSON.stringify(product))

    return {
      props: {
        product: serializedProduct,
      },
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return {
      notFound: true,
    }
  }
}
