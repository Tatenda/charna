import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  GripVertical, 
  Package, 
  Save, 
  ArrowUp, 
  ArrowDown,
  Search,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

interface Product {
  id: number
  name: string
  displayOrder: number
  isPrimary: boolean
  variants?: { id: number; name: string }[]
}

interface ProductOrderingManagerProps {
  categoryId: number
  categoryName: string
}

export default function ProductOrderingManager({ 
  categoryId, 
  categoryName 
}: ProductOrderingManagerProps) {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [categoryId])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}/products`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.sort((a: Product, b: Product) => a.displayOrder - b.displayOrder))
      } else {
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const moveProduct = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === products.length - 1)
    ) {
      return
    }

    const newProducts = [...products]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    // Swap products
    ;[newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]]
    
    // Update display orders
    newProducts.forEach((product, idx) => {
      product.displayOrder = idx * 10
    })
    
    setProducts(newProducts)
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}/products/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productOrders: products.map((p, index) => ({
            productId: p.id,
            displayOrder: index * 10
          }))
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product order saved successfully!",
        })
        setHasChanges(false)
      } else {
        toast({
          title: "Error",
          description: "Failed to save product order",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error saving order:', error)
      toast({
        title: "Error",
        description: "Failed to save product order",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-botanical mx-auto"></div>
          <p className="mt-4 text-sm text-botanical/70">Loading products...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-heading text-forest flex items-center gap-2">
              <Package className="h-5 w-5 text-botanical" />
              Product Display Order
            </CardTitle>
            <CardDescription className="text-botanical/80 mt-1">
              Drag or use arrows to reorder how products appear in "<span className="font-semibold">{categoryName}</span>"
            </CardDescription>
          </div>
          {hasChanges && (
            <Button
              onClick={handleSave}
              disabled={saving}
              size="sm"
              className="bg-botanical hover:bg-botanical/90"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Order
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.length === 0 ? (
          <div className="text-center py-8 text-botanical/70">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">No products in this category yet.</p>
            <p className="text-xs mt-2">Add products to this category from the product edit page.</p>
          </div>
        ) : (
          <>
            {/* Search */}
            {products.length > 5 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-botanical/50" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-sage/30"
                />
              </div>
            )}

            {/* Product List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group flex items-center gap-3 p-3 border border-sage/20 rounded-lg bg-white hover:shadow-md transition-all"
                >
                  {/* Drag Handle */}
                  <div className="cursor-move text-botanical/30 hover:text-botanical">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  {/* Order Number */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sage/10 text-botanical font-semibold text-sm">
                    {index + 1}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-forest truncate">{product.name}</h4>
                      {product.isPrimary && (
                        <Badge className="bg-botanical/20 text-botanical text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                    {product.variants && product.variants.length > 0 && (
                      <p className="text-xs text-botanical/60 mt-1">
                        {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveProduct(index, 'up')}
                      disabled={index === 0}
                      className="h-8 w-8 p-0"
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveProduct(index, 'down')}
                      disabled={index === products.length - 1}
                      className="h-8 w-8 p-0"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Link href={`/admin/products/${product.id}`} target="_blank">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Edit product"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Help Text */}
            <div className="bg-sage/5 rounded-lg p-3 border border-sage/20">
              <p className="text-xs text-botanical/70">
                💡 <strong>Tip:</strong> Products at the top will appear first when customers browse this category.
                {hasChanges && <span className="text-botanical font-semibold ml-2">Don't forget to save your changes!</span>}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

