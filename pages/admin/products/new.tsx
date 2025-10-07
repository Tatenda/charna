import { useState } from "react"
import { useRouter } from "next/router"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/admin/layout/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Save, 
  Package,
  Star,
  Eye,
  EyeOff,
  Tag
} from "lucide-react"
import Link from "next/link"
import CategorySelector from "@/components/admin/CategorySelector"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    longDescription: "",
    basePrice: "",
    rating: "5",
    reviewCount: "0",
    badge: "",
    materials: "",
    dimensions: "",
    careInstructions: "",
    featured: false,
    isPackage: false,
    isActive: true,
  })

  // Category state
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [primaryCategoryId, setPrimaryCategoryId] = useState<number | null>(null)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Auto-generate slug from name
    if (field === "name" && typeof value === "string") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
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

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          basePrice: parseInt(formData.basePrice), // Price in Rands
          rating: parseInt(formData.rating) * 10, // Convert to rating * 10 format
          reviewCount: parseInt(formData.reviewCount),
        }),
      })

      if (response.ok) {
        const product = await response.json()
        
        // Assign categories to the product
        const categoriesResponse = await fetch(`/api/admin/products/${product.id}/categories`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            categoryIds: selectedCategoryIds,
            primaryCategoryId: primaryCategoryId,
          }),
        })

        if (!categoriesResponse.ok) {
          toast({
            title: "Warning",
            description: "Product created but failed to assign categories",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "Product created successfully!",
          })
        }

        router.push(`/admin/products/${product.id}`)
      } else {
        toast({
          title: "Error",
          description: "Failed to create product",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating product:', error)
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCategoriesChange = (categoryIds: number[], primaryId: number | null) => {
    setSelectedCategoryIds(categoryIds)
    setPrimaryCategoryId(primaryId)
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10">
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="outline" size="sm" className="border-sage/30 text-botanical hover:bg-sage/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading text-forest">Add New Product</h1>
              <p className="text-sm text-botanical/80 font-medium mt-1">
                Create a new product for your catalog
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-heading text-forest flex items-center">
                      <Package className="h-5 w-5 mr-2 text-botanical" />
                      Basic Information
                    </CardTitle>
                    <CardDescription className="text-botanical/80">
                      Essential product details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-forest">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          handleInputChange("name", e.target.value)
                          // Auto-generate slug from name
                          const slug = e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, '')
                            .replace(/\s+/g, '-')
                            .replace(/-+/g, '-')
                            .trim()
                          handleInputChange("slug", slug)
                        }}
                        placeholder="e.g., Grounded Tan Backpack"
                        className="mt-1 border-sage/30 focus:border-botanical/50"
                        required
                      />
                      <p className="text-xs text-botanical/70 mt-1">
                        Slug will be auto-generated from the product name
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="slug" className="text-sm font-medium text-forest">URL Slug (Auto-generated)</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        className="mt-1 border-sage/30 bg-gray-50 text-gray-600"
                        readOnly
                        disabled
                      />
                      <p className="text-xs text-botanical/70 mt-1">
                        This slug is automatically generated and cannot be edited
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-forest">Short Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Brief product description for listings..."
                        className="mt-1 border-sage/30 focus:border-botanical/50"
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="longDescription" className="text-sm font-medium text-forest">Detailed Description *</Label>
                      <Textarea
                        id="longDescription"
                        value={formData.longDescription}
                        onChange={(e) => handleInputChange("longDescription", e.target.value)}
                        placeholder="Comprehensive product description..."
                        className="mt-1 border-sage/30 focus:border-botanical/50"
                        rows={5}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing & Details */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-heading text-forest">Pricing & Details</CardTitle>
                    <CardDescription className="text-botanical/80">
                      Product pricing and specifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="basePrice" className="text-sm font-medium text-forest">Base Price (ZAR) *</Label>
                        <Input
                          id="basePrice"
                          type="number"
                          value={formData.basePrice}
                          onChange={(e) => handleInputChange("basePrice", e.target.value)}
                          placeholder="1999"
                          className="mt-1 border-sage/30 focus:border-botanical/50"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating" className="text-sm font-medium text-forest">Rating (1-5)</Label>
                        <Input
                          id="rating"
                          type="number"
                          min="1"
                          max="5"
                          value={formData.rating}
                          onChange={(e) => handleInputChange("rating", e.target.value)}
                          className="mt-1 border-sage/30 focus:border-botanical/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reviewCount" className="text-sm font-medium text-forest">Review Count</Label>
                        <Input
                          id="reviewCount"
                          type="number"
                          value={formData.reviewCount}
                          onChange={(e) => handleInputChange("reviewCount", e.target.value)}
                          className="mt-1 border-sage/30 focus:border-botanical/50"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="badge" className="text-sm font-medium text-forest">Badge Text</Label>
                      <Input
                        id="badge"
                        value={formData.badge}
                        onChange={(e) => handleInputChange("badge", e.target.value)}
                        placeholder="e.g., Best Seller, New, Limited Edition"
                        className="mt-1 border-sage/30 focus:border-botanical/50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="materials" className="text-sm font-medium text-forest">Materials *</Label>
                      <Input
                        id="materials"
                        value={formData.materials}
                        onChange={(e) => handleInputChange("materials", e.target.value)}
                        placeholder="e.g., Premium tan leather and canvas"
                        className="mt-1 border-sage/30 focus:border-botanical/50"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dimensions" className="text-sm font-medium text-forest">Dimensions *</Label>
                        <Input
                          id="dimensions"
                          value={formData.dimensions}
                          onChange={(e) => handleInputChange("dimensions", e.target.value)}
                          placeholder="e.g., 42cm x 32cm x 16cm"
                          className="mt-1 border-sage/30 focus:border-botanical/50"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="careInstructions" className="text-sm font-medium text-forest">Care Instructions *</Label>
                        <Input
                          id="careInstructions"
                          value={formData.careInstructions}
                          onChange={(e) => handleInputChange("careInstructions", e.target.value)}
                          placeholder="e.g., Clean with leather cleaner, condition monthly"
                          className="mt-1 border-sage/30 focus:border-botanical/50"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Categories */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-heading text-forest flex items-center gap-2">
                      <Tag className="h-5 w-5 text-botanical" />
                      Categories
                    </CardTitle>
                    <CardDescription className="text-botanical/80">
                      Assign this product to one or more categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CategorySelector
                      selectedCategoryIds={selectedCategoryIds}
                      primaryCategoryId={primaryCategoryId}
                      onCategoriesChange={handleCategoriesChange}
                    />
                  </CardContent>
                </Card>

                {/* Variant Creation Notice */}
                <Card className="bg-gradient-to-br from-sage/10 to-mint/10 border-2 border-sage/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-heading text-forest flex items-center gap-2">
                      <Package className="h-5 w-5 text-botanical" />
                      Next Step: Create Variants
                    </CardTitle>
                    <CardDescription className="text-botanical/80">
                      After creating the product, you'll be able to add variants with their own images, pricing, and attributes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white/50 rounded-lg p-4 border border-sage/20">
                      <h4 className="font-medium text-forest mb-2">What happens next:</h4>
                      <ul className="text-sm text-botanical/70 space-y-1">
                        <li>• Product will be created with basic information</li>
                        <li>• Categories will be assigned to the product</li>
                        <li>• You'll be redirected to the product edit page</li>
                        <li>• You can then create variants (colors, sizes, etc.)</li>
                        <li>• Each variant can have its own images and pricing</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status & Settings */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-heading text-forest">Status & Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-botanical" />
                        <Label htmlFor="isActive" className="text-sm font-medium text-forest">Active</Label>
                      </div>
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-terracotta" />
                        <Label htmlFor="featured" className="text-sm font-medium text-forest">Featured</Label>
                      </div>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleInputChange("featured", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-sage" />
                        <Label htmlFor="isPackage" className="text-sm font-medium text-forest">Package Product</Label>
                      </div>
                      <Switch
                        id="isPackage"
                        checked={formData.isPackage}
                        onCheckedChange={(checked) => handleInputChange("isPackage", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Preview */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-heading text-forest">Preview</CardTitle>
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
                      <Badge className={formData.isActive ? "bg-botanical/20 text-botanical" : "bg-gray-200 text-gray-600"}>
                        {formData.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-botanical to-sage hover:from-botanical/90 hover:to-sage/90 text-white font-heading font-medium"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Create Product
                          </>
                        )}
                      </Button>
                      <Link href="/admin/products" className="block">
                        <Button variant="outline" className="w-full border-sage/30 text-botanical hover:bg-sage/10">
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
