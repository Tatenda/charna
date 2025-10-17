import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/admin/layout/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductOrderingManager from "@/components/admin/ProductOrderingManager"
import { 
  ArrowLeft, 
  Save, 
  FolderTree,
  Eye,
  Package,
  Settings,
  ArrowUpDown
} from "lucide-react"
import Link from "next/link"

interface Category {
  id: number
  name: string
  slug: string
  displayName: string
  description: string | null
  image: string | null
  icon: string | null
  parentId: number | null
  parent: Category | null
  children: Category[]
  sortOrder: number
  isActive: boolean
  products: any[]
}

export default function EditCategoryPage() {
  const router = useRouter()
  const { id } = router.query
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    displayName: "",
    description: "",
    image: "",
    icon: "",
    parentId: "",
    sortOrder: "0",
    isActive: true,
  })

  useEffect(() => {
    if (id) {
      fetchCategory()
      fetchCategories()
    }
  }, [id])

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`)
      if (response.ok) {
        const data = await response.json()
        setCategory(data)
        setFormData({
          name: data.name,
          slug: data.slug,
          displayName: data.displayName,
          description: data.description || "",
          image: data.image || "",
          icon: data.icon || "",
          parentId: data.parentId?.toString() || "",
          sortOrder: data.sortOrder.toString(),
          isActive: data.isActive,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch category",
          variant: "destructive",
        })
        router.push('/admin/categories')
      }
    } catch (error) {
      console.error('Error fetching category:', error)
      toast({
        title: "Error",
        description: "Failed to fetch category",
        variant: "destructive",
      })
      router.push('/admin/categories')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Auto-generate slug and name from displayName
    if (field === "displayName" && typeof value === "string") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      const name = value.toLowerCase()
      setFormData(prev => ({
        ...prev,
        slug,
        name
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId ? parseInt(formData.parentId) : null,
          sortOrder: parseInt(formData.sortOrder),
          image: formData.image || null,
          icon: formData.icon || null,
          description: formData.description || null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Category updated successfully",
        })
        router.push('/admin/categories')
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to update category",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-botanical mx-auto"></div>
            <p className="mt-4 text-botanical/70">Loading category...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!category) {
    return null
  }

  // Filter out current category and its descendants from parent selection
  const availableParents = categories.filter(cat => {
    if (cat.id === category.id) return false
    if (cat.parentId === category.id) return false
    return !cat.parentId // Only top-level categories
  })

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10">
        <div className="space-y-6">
          {/* Redesigned Header */}
          <div className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 rounded-xl shadow-lg p-6">
            {/* Back Button */}
            <div className="mb-4">
              <Link href="/admin/categories">
                <Button variant="ghost" size="sm" className="text-botanical/70 hover:text-botanical hover:bg-sage/10 -ml-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Categories
                </Button>
              </Link>
            </div>

            {/* Main Header Content */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              {/* Left: Category Info */}
              <div className="flex gap-4">
                {/* Category Icon/Badge */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-botanical/20 to-sage/20 border-2 border-sage/30 flex items-center justify-center">
                    <FolderTree className="h-8 w-8 text-botanical" />
                  </div>
                </div>

                {/* Category Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-heading font-bold text-forest">
                      {formData.displayName || category.displayName}
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
                    {category.parentId && (
                      <span className="px-3 py-1 rounded-full bg-sage/10 text-botanical text-xs font-semibold border border-sage/20">
                        Subcategory
                      </span>
                    )}
                  </div>
                  
                  <p className="text-botanical/70 mb-3">
                    {formData.description || category.description || 'No description provided'}
                  </p>

                  {/* Category Stats */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sage/5 border border-sage/20">
                      <Package className="h-4 w-4 text-botanical" />
                      <span className="text-sm font-semibold text-forest">
                        {category.products?.length || 0}
                      </span>
                      <span className="text-xs text-botanical/60">products</span>
                    </div>
                    
                    {category.children && category.children.length > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sage/5 border border-sage/20">
                        <FolderTree className="h-4 w-4 text-botanical" />
                        <span className="text-sm font-semibold text-forest">
                          {category.children.length}
                        </span>
                        <span className="text-xs text-botanical/60">
                          subcategor{category.children.length === 1 ? 'y' : 'ies'}
                        </span>
                      </div>
                    )}
                    
                    {category.parentId && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sage/5 border border-sage/20">
                        <span className="text-xs text-botanical/60">Parent:</span>
                        <span className="text-sm font-semibold text-forest">
                          {categories.find(c => c.id === category.parentId)?.displayName || 'Unknown'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Quick Actions (if needed) */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-sage/30 text-botanical hover:bg-sage/10"
                  onClick={() => window.open(`/browse?category=${category.slug}`, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="settings" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-sage/10">
              <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-botanical">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:text-botanical">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Product Order
              </TabsTrigger>
            </TabsList>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Form */}
                  <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-heading text-forest flex items-center">
                      <FolderTree className="h-5 w-5 mr-2 text-botanical" />
                      Basic Information
                    </CardTitle>
                    <CardDescription className="text-botanical/80">
                      Essential category details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="displayName" className="text-sm font-medium text-forest">Display Name *</Label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => handleInputChange("displayName", e.target.value)}
                        placeholder="e.g., Work, Sport, Tennis"
                        className="mt-1 border-sage/30 focus:border-botanical/50"
                        required
                      />
                      <p className="text-xs text-botanical/70 mt-1">
                        This will be shown to customers (e.g., "Work", "Sport")
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-forest">Internal Name (Auto-generated)</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        className="mt-1 border-sage/30 bg-gray-50 text-gray-600"
                        readOnly
                        disabled
                      />
                      <p className="text-xs text-botanical/70 mt-1">
                        Lowercase version for internal use
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
                        Used in URLs (e.g., /browse?category=work)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-forest">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Brief description of this category..."
                        className="mt-1 border-sage/30 focus:border-botanical/50"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Hierarchy & Media */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-heading text-forest">Hierarchy & Media</CardTitle>
                    <CardDescription className="text-botanical/80">
                      Parent category and images
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="parentId" className="text-sm font-medium text-forest">Parent Category</Label>
                      <Select
                        value={formData.parentId || "none"}
                        onValueChange={(value) => handleInputChange("parentId", value === "none" ? "" : value)}
                      >
                        <SelectTrigger className="mt-1 border-sage/30 focus:border-botanical/50">
                          <SelectValue placeholder="None (Top-level category)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None (Top-level category)</SelectItem>
                          {availableParents.map(cat => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-botanical/70 mt-1">
                        Leave empty for top-level category (e.g., "Work", "Sport")
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="icon" className="text-sm font-medium text-forest">Icon URL</Label>
                      <Input
                        id="icon"
                        value={formData.icon}
                        onChange={(e) => handleInputChange("icon", e.target.value)}
                        placeholder="https://example.com/icon.png"
                        className="mt-1 border-sage/30 focus:border-botanical/50"
                      />
                      <p className="text-xs text-botanical/70 mt-1">
                        Small icon for navigation (optional)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="image" className="text-sm font-medium text-forest">Banner Image URL</Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => handleInputChange("image", e.target.value)}
                        placeholder="https://example.com/banner.jpg"
                        className="mt-1 border-sage/30 focus:border-botanical/50"
                      />
                      <p className="text-xs text-botanical/70 mt-1">
                        Large banner for category page (optional)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="sortOrder" className="text-sm font-medium text-forest">Sort Order</Label>
                      <Input
                        id="sortOrder"
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => handleInputChange("sortOrder", e.target.value)}
                        className="mt-1 border-sage/30 focus:border-botanical/50"
                      />
                      <p className="text-xs text-botanical/70 mt-1">
                        Lower numbers appear first (0 = first)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Status & Settings */}
                    <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg font-heading text-forest">Status</CardTitle>
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
                        <p className="text-xs text-botanical/70">
                          Inactive categories are hidden from customers
                        </p>
                      </CardContent>
                    </Card>

                    {/* Preview */}
                    <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg font-heading text-forest">Preview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm">
                          <span className="text-botanical/70">Display Name:</span>
                          <p className="font-medium text-forest">{formData.displayName || "Category name..."}</p>
                        </div>
                        <div className="text-sm">
                          <span className="text-botanical/70">Slug:</span>
                          <p className="font-mono text-xs text-forest">{formData.slug || "category-slug..."}</p>
                        </div>
                        {formData.parentId && (
                          <div className="text-sm">
                            <span className="text-botanical/70">Parent:</span>
                            <p className="font-medium text-forest">
                              {categories.find(c => c.id.toString() === formData.parentId)?.displayName || "None"}
                            </p>
                          </div>
                        )}
                        {category.children && category.children.length > 0 && (
                          <div className="text-sm">
                            <span className="text-botanical/70">Subcategories:</span>
                            <p className="font-medium text-forest">{category.children.length}</p>
                          </div>
                        )}
                        {category.products && (
                          <div className="text-sm">
                            <span className="text-botanical/70">Products:</span>
                            <p className="font-medium text-forest">{category.products.length}</p>
                          </div>
                        )}
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
                                Updating...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Update Category
                              </>
                            )}
                          </Button>
                          <Link href="/admin/categories" className="block">
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
            </TabsContent>

            {/* Product Order Tab */}
            <TabsContent value="products">
              <ProductOrderingManager
                categoryId={category.id}
                categoryName={formData.displayName || category.displayName}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  )
}

