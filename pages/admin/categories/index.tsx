import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import AdminLayout from "@/components/admin/layout/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Edit, 
  Trash2, 
  FolderTree,
  Package,
  Eye,
  EyeOff,
  ChevronRight,
  FolderPlus
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  createdAt: string
  updatedAt: string
  _count: {
    products: number
  }
}

export default function CategoriesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!categoryToDelete) return

    try {
      const response = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
        fetchCategories()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to delete category",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    }
  }

  const handleToggleActive = async (category: Category) => {
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !category.isActive
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Category ${!category.isActive ? 'activated' : 'deactivated'} successfully`,
        })
        fetchCategories()
      } else {
        toast({
          title: "Error",
          description: "Failed to update category",
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
    }
  }

  // Get top-level categories (no parent)
  const topLevelCategories = categories.filter(cat => !cat.parentId)

  const CategoryRow = ({ category, level = 0 }: { category: Category; level?: number }) => {
    const hasChildren = category.children && category.children.length > 0
    const isTopLevel = level === 0

    return (
      <>
        <div 
          className={`group hover:bg-sage/5 transition-colors border-b border-sage/10 ${
            level === 1 ? 'bg-sage/5' : level === 2 ? 'bg-sage/10' : ''
          }`}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {/* Hierarchical indentation with visual depth indicators */}
              <div className="flex items-center gap-3">
                {/* Depth indicator lines */}
                {level > 0 && (
                  <div className="flex items-center" style={{ width: `${level * 32}px` }}>
                    {Array.from({ length: level }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-8 flex items-center justify-center ${
                          idx === level - 1 ? '' : ''
                        }`}
                      >
                        {idx === level - 1 ? (
                          <div className="flex items-center w-full">
                            <div className="h-px w-4 bg-sage/30" />
                            <ChevronRight className="h-3 w-3 text-sage/50" />
                          </div>
                        ) : (
                          <div className="w-px h-full bg-sage/20" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Category icon with depth-based styling */}
                {category.icon ? (
                  <img 
                    src={category.icon} 
                    alt="" 
                    className={`rounded object-cover ${
                      isTopLevel ? 'h-10 w-10' : 'h-8 w-8'
                    }`} 
                  />
                ) : (
                  <div 
                    className={`rounded flex items-center justify-center ${
                      isTopLevel 
                        ? 'h-10 w-10 bg-gradient-to-br from-botanical/20 to-sage/20' 
                        : 'h-8 w-8 bg-sage/20'
                    }`}
                  >
                    <FolderTree 
                      className={`text-botanical ${isTopLevel ? 'h-5 w-5' : 'h-4 w-4'}`} 
                    />
                  </div>
                )}
                
                {/* Category info with depth-based styling */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 
                      className={`font-medium text-forest ${
                        isTopLevel ? 'text-base' : 'text-sm'
                      }`}
                    >
                      {category.displayName}
                    </h3>
                    {level > 0 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs border-sage/30 text-botanical/70 bg-white/50"
                      >
                        subcategory
                      </Badge>
                    )}
                    {hasChildren && (
                      <Badge 
                        variant="outline" 
                        className="text-xs border-botanical/30 text-botanical bg-botanical/5"
                      >
                        {category.children.length} sub
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className={`text-botanical/70 font-mono ${
                      isTopLevel ? 'text-sm' : 'text-xs'
                    }`}>
                      {category.slug}
                    </p>
                    <Badge variant="outline" className="text-xs border-sage/30 bg-white/50">
                      <Package className="h-3 w-3 mr-1" />
                      {category._count?.products || 0}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className={category.isActive ? "bg-botanical/20 text-botanical" : "bg-gray-200 text-gray-600"}>
                {category.isActive ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Inactive
                  </>
                )}
              </Badge>

              <div className="flex gap-1.5">
                {/* Always visible Edit button */}
                <Link href={`/admin/categories/${category.id}`}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-lg hover:bg-botanical/10 hover:text-botanical text-botanical/70 transition-all px-3"
                  >
                    <Edit className="h-4 w-4 mr-1.5" />
                    <span className="text-sm font-medium">Edit</span>
                  </Button>
                </Link>

                {/* Create Subcategory button - only for parent categories, compact design */}
                {isTopLevel && (
                  <Link href={`/admin/categories/new?parentId=${category.id}`}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-lg hover:bg-sage/10 hover:text-botanical text-botanical/60 transition-all px-2.5 h-8 text-xs"
                    >
                      <FolderPlus className="h-3.5 w-3.5 mr-1.5" />
                      <span>Add Subcategory</span>
                    </Button>
                  </Link>
                )}

                {/* Secondary actions - show on hover */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleToggleActive(category)}
                    className="h-9 w-9 rounded-lg hover:bg-sage/10 text-botanical/60 hover:text-botanical"
                    title={category.isActive ? "Deactivate" : "Activate"}
                  >
                    {category.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setCategoryToDelete(category)
                      setDeleteDialogOpen(true)
                    }}
                    className="h-9 w-9 rounded-lg hover:bg-red-50 text-red-500/60 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Render children */}
        {hasChildren && category.children.map(child => (
          <CategoryRow key={child.id} category={child} level={level + 1} />
        ))}
      </>
    )
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-botanical mx-auto"></div>
            <p className="mt-4 text-botanical/70">Loading categories...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10">
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading text-forest">Categories</h1>
              <p className="text-sm text-botanical/80 font-medium mt-1">
                Manage product categories and hierarchies
              </p>
            </div>
            <Link href="/admin/categories/new">
              <Button className="bg-gradient-to-r from-botanical to-sage hover:from-botanical/90 hover:to-sage/90 text-white font-heading font-medium">
                <Plus className="h-4 w-4 mr-2" />
                New Category
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Total Categories</p>
                    <p className="text-2xl font-bold text-forest mt-1">{categories.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-botanical/20 to-sage/20 rounded-lg flex items-center justify-center">
                    <FolderTree className="h-6 w-6 text-botanical" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Active</p>
                    <p className="text-2xl font-bold text-forest mt-1">
                      {categories.filter(c => c.isActive).length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-botanical/20 to-sage/20 rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-botanical" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Top Level</p>
                    <p className="text-2xl font-bold text-forest mt-1">
                      {topLevelCategories.length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-botanical/20 to-sage/20 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-botanical" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories List */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-heading text-forest flex items-center">
                <FolderTree className="h-5 w-5 mr-2 text-botanical" />
                Category Hierarchy
              </CardTitle>
              <CardDescription className="text-botanical/80">
                {categories.length === 0 ? 'No categories yet' : 'View and manage all categories'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {categories.length === 0 ? (
                <div className="p-12 text-center">
                  <FolderTree className="h-12 w-12 mx-auto text-botanical/30" />
                  <p className="mt-4 text-botanical/70">No categories yet</p>
                  <Link href="/admin/categories/new">
                    <Button className="mt-4 bg-gradient-to-r from-botanical to-sage hover:from-botanical/90 hover:to-sage/90 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Category
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-sage/10">
                  {topLevelCategories.map(category => (
                    <CategoryRow key={category.id} category={category} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{categoryToDelete?.displayName}"?
              {categoryToDelete && (categoryToDelete._count?.products ?? 0) > 0 && (
              <span className="block mt-2 text-red-600 font-medium">
                This category has {categoryToDelete._count?.products || 0} products assigned. 
                Please remove them first.
              </span>
              )}
              {categoryToDelete && (categoryToDelete.children?.length ?? 0) > 0 && (
                <span className="block mt-2 text-red-600 font-medium">
                  This category has {categoryToDelete.children?.length || 0} subcategories. 
                  Please remove them first.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
            onClick={handleDelete}
            disabled={
              (categoryToDelete?._count?.products ?? 0) > 0 || 
              (categoryToDelete?.children?.length ?? 0) > 0
            }
            className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}

