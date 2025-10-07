import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package,
  DollarSign,
  Hash,
  Weight,
  Image as ImageIcon,
  Tag,
  Settings,
  Star
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import ImageUpload from './ImageUpload'
import { getImagePath } from '@/lib/imageUtils'

interface VariantAttribute {
  attributeType: string
  attributeValue: string
  displayOrder: number
}

interface ProductVariant {
  id: number
  name: string
  sku: string
  price: number
  originalPrice?: number
  inStock: boolean
  weight?: number
  images: string[]
  isDefault: boolean
  isActive: boolean
  attributes: VariantAttribute[]
  createdAt: string
  updatedAt: string
}

interface VariantManagementProps {
  productId: number
  productName: string
}

const ATTRIBUTE_TYPES = [
  { value: 'color', label: 'Color' },
  { value: 'size', label: 'Size' },
  { value: 'material', label: 'Material' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'finish', label: 'Finish' },
  { value: 'style', label: 'Style' }
]

const COMMON_ATTRIBUTE_VALUES = {
  color: ['Black', 'Brown', 'Tan', 'Navy', 'Green', 'Red', 'Blue', 'White'],
  size: ['Small', 'Medium', 'Large', 'X-Large', 'One Size'],
  material: ['Leather', 'Canvas', 'Nylon', 'Cotton', 'Suede', 'Faux Leather'],
  hardware: ['Gold', 'Silver', 'Brass', 'Black', 'Chrome'],
  finish: ['Matte', 'Glossy', 'Textured', 'Smooth'],
  style: ['Classic', 'Modern', 'Vintage', 'Minimalist', 'Sporty']
}

export default function VariantManagement({ productId, productName }: VariantManagementProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [variantImages, setVariantImages] = useState<string[]>([])
  const { toast } = useToast()

  const [variantForm, setVariantForm] = useState({
    name: '',
    sku: '',
    price: '',
    originalPrice: '',
    inStock: true,
    weight: '',
    isDefault: false,
    isActive: true,
    attributes: [] as VariantAttribute[]
  })

  // Fetch variants
  const fetchVariants = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/variants`)
      if (!response.ok) throw new Error('Failed to fetch variants')
      const data = await response.json()
      setVariants(data)
    } catch (error) {
      console.error('Error fetching variants:', error)
      toast({
        title: "Error",
        description: "Failed to load variants",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVariants()
  }, [productId])

  // Reset form
  const resetForm = () => {
    setVariantForm({
      name: '',
      sku: '',
      price: '',
      originalPrice: '',
      inStock: true,
      weight: '',
      isDefault: false,
      isActive: true,
      attributes: []
    })
    setVariantImages([])
  }

  // Handle create variant
  const handleCreateVariant = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/variants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...variantForm,
          price: parseInt(variantForm.price),
          originalPrice: variantForm.originalPrice ? parseInt(variantForm.originalPrice) : undefined,
          weight: variantForm.weight ? parseFloat(variantForm.weight) : undefined,
          images: variantImages
        })
      })

      if (!response.ok) throw new Error('Failed to create variant')

      toast({
        title: "Success",
        description: "Variant created successfully!",
      })

      setIsCreateDialogOpen(false)
      resetForm()
      fetchVariants()
    } catch (error) {
      console.error('Error creating variant:', error)
      toast({
        title: "Error",
        description: "Failed to create variant",
        variant: "destructive",
      })
    }
  }

  // Handle edit variant
  const handleEditVariant = async () => {
    if (!editingVariant) return

    try {
      const response = await fetch(`/api/admin/products/${productId}/variants/${editingVariant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...variantForm,
          price: parseInt(variantForm.price),
          originalPrice: variantForm.originalPrice ? parseInt(variantForm.originalPrice) : undefined,
          weight: variantForm.weight ? parseFloat(variantForm.weight) : undefined,
          images: variantImages
        })
      })

      if (!response.ok) throw new Error('Failed to update variant')

      toast({
        title: "Success",
        description: "Variant updated successfully!",
      })

      setIsEditDialogOpen(false)
      setEditingVariant(null)
      resetForm()
      fetchVariants()
    } catch (error) {
      console.error('Error updating variant:', error)
      toast({
        title: "Error",
        description: "Failed to update variant",
        variant: "destructive",
      })
    }
  }

  // Handle delete variant
  const handleDeleteVariant = async (variantId: number, variantName: string) => {
    if (!confirm(`Are you sure you want to delete "${variantName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}/variants/${variantId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete variant')

      toast({
        title: "Success",
        description: "Variant deleted successfully!",
      })

      fetchVariants()
    } catch (error) {
      console.error('Error deleting variant:', error)
      toast({
        title: "Error",
        description: "Failed to delete variant",
        variant: "destructive",
      })
    }
  }

  // Start editing variant
  const startEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant)
    setVariantForm({
      name: variant.name,
      sku: variant.sku,
      price: variant.price.toString(),
      originalPrice: variant.originalPrice?.toString() || '',
      inStock: variant.inStock,
      weight: variant.weight?.toString() || '',
      isDefault: variant.isDefault,
      isActive: variant.isActive,
      attributes: variant.attributes
    })
    setVariantImages(variant.images)
    setIsEditDialogOpen(true)
  }

  // Add attribute
  const addAttribute = () => {
    setVariantForm(prev => ({
      ...prev,
      attributes: [...prev.attributes, { attributeType: '', attributeValue: '', displayOrder: prev.attributes.length }]
    }))
  }

  // Update attribute
  const updateAttribute = (index: number, field: keyof VariantAttribute, value: string | number) => {
    setVariantForm(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      )
    }))
  }

  // Remove attribute
  const removeAttribute = (index: number) => {
    setVariantForm(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }))
  }

  if (loading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-heading text-forest flex items-center gap-2">
            <Package className="h-5 w-5 text-botanical" />
            Variant Management
          </CardTitle>
          <CardDescription>Loading variants...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-heading text-forest flex items-center gap-2">
              <Package className="h-5 w-5 text-botanical" />
              Variant Management
            </CardTitle>
            <CardDescription>
              Manage product variants for {productName}
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="bg-gradient-to-r from-botanical to-sage hover:from-botanical/90 hover:to-sage/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Variant</DialogTitle>
                <DialogDescription>
                  Add a new variant for {productName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Variant Name *</Label>
                    <Input
                      id="name"
                      value={variantForm.name}
                      onChange={(e) => setVariantForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Tan, Large, Gold Hardware"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={variantForm.sku}
                      onChange={(e) => setVariantForm(prev => ({ ...prev, sku: e.target.value.toUpperCase() }))}
                      placeholder="e.g., GTB-TAN-L"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (ZAR) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={variantForm.price}
                        onChange={(e) => setVariantForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="1999"
                      />
                    </div>
                    <div>
                      <Label htmlFor="originalPrice">Original Price (ZAR)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={variantForm.originalPrice}
                        onChange={(e) => setVariantForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                        placeholder="2499"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={variantForm.weight}
                      onChange={(e) => setVariantForm(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="1.2"
                    />
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inStock">In Stock</Label>
                    <Switch
                      id="inStock"
                      checked={variantForm.inStock}
                      onCheckedChange={(checked) => setVariantForm(prev => ({ ...prev, inStock: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isDefault">Default Variant</Label>
                    <Switch
                      id="isDefault"
                      checked={variantForm.isDefault}
                      onCheckedChange={(checked) => setVariantForm(prev => ({ ...prev, isDefault: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isActive">Active</Label>
                    <Switch
                      id="isActive"
                      checked={variantForm.isActive}
                      onCheckedChange={(checked) => setVariantForm(prev => ({ ...prev, isActive: checked }))}
                    />
                  </div>

                  {/* Attributes */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Attributes</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {variantForm.attributes.map((attr, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Select
                            value={attr.attributeType}
                            onValueChange={(value) => updateAttribute(index, 'attributeType', value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {ATTRIBUTE_TYPES.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={attr.attributeValue}
                            onValueChange={(value) => updateAttribute(index, 'attributeValue', value)}
                            disabled={!attr.attributeType}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Value" />
                            </SelectTrigger>
                            <SelectContent>
                              {attr.attributeType && COMMON_ATTRIBUTE_VALUES[attr.attributeType as keyof typeof COMMON_ATTRIBUTE_VALUES]?.map(value => (
                                <SelectItem key={value} value={value}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeAttribute(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="py-4">
                <ImageUpload
                  images={variantImages}
                  onImagesChange={setVariantImages}
                  maxImages={10}
                  title="Variant Images"
                  description="Upload images specific to this variant"
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateVariant}
                  disabled={!variantForm.name || !variantForm.sku || !variantForm.price}
                >
                  Create Variant
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {variants.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-16 w-16 text-sage/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-forest mb-2">No Variants Yet</h3>
            <p className="text-botanical/70 mb-4">
              Create your first variant to get started. Each variant can have its own images, pricing, and attributes.
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-botanical to-sage hover:from-botanical/90 hover:to-sage/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Variant
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {variants.map((variant) => (
              <Card key={variant.id} className="border-sage/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Variant Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-sage/20 bg-gradient-to-br from-sage/10 to-mint/10">
                        {variant.images.length > 0 ? (
                          <img
                            src={getImagePath(variant.images[0])}
                            alt={variant.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sage/20 to-mint/20" 
                          style={{ display: variant.images.length === 0 ? 'flex' : 'none' }}
                        >
                          <Package className="h-8 w-8 text-sage/50" />
                        </div>
                      </div>
                    </div>

                    {/* Variant Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-forest">{variant.name}</h4>
                        {variant.isDefault && (
                          <Badge variant="default" className="bg-botanical/10 text-botanical border-botanical/20">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                        {!variant.isActive && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        {!variant.inStock && (
                          <Badge variant="destructive">Out of Stock</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-botanical/70">
                        <div className="flex items-center gap-1">
                          <Hash className="h-4 w-4" />
                          {variant.sku}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          R{variant.price}
                          {variant.originalPrice && variant.originalPrice > variant.price && (
                            <span className="text-red-500 line-through ml-1">R{variant.originalPrice}</span>
                          )}
                        </div>
                        {variant.weight && (
                          <div className="flex items-center gap-1">
                            <Weight className="h-4 w-4" />
                            {variant.weight}kg
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <ImageIcon className="h-4 w-4" />
                          {variant.images.length} image{variant.images.length !== 1 ? 's' : ''}
                        </div>
                      </div>

                      {variant.attributes.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {variant.attributes.map((attr, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {attr.attributeType}: {attr.attributeValue}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditVariant(variant)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteVariant(variant.id, variant.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit Dialog - Same as create but with different handlers */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Variant</DialogTitle>
            <DialogDescription>
              Update variant details for {editingVariant?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Same form fields as create dialog */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Variant Name *</Label>
                <Input
                  id="edit-name"
                  value={variantForm.name}
                  onChange={(e) => setVariantForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Tan, Large, Gold Hardware"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-sku">SKU *</Label>
                <Input
                  id="edit-sku"
                  value={variantForm.sku}
                  onChange={(e) => setVariantForm(prev => ({ ...prev, sku: e.target.value.toUpperCase() }))}
                  placeholder="e.g., GTB-TAN-L"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Price (ZAR) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={variantForm.price}
                    onChange={(e) => setVariantForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="1999"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-originalPrice">Original Price (ZAR)</Label>
                  <Input
                    id="edit-originalPrice"
                    type="number"
                    value={variantForm.originalPrice}
                    onChange={(e) => setVariantForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                    placeholder="2499"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-weight">Weight (kg)</Label>
                <Input
                  id="edit-weight"
                  type="number"
                  step="0.1"
                  value={variantForm.weight}
                  onChange={(e) => setVariantForm(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="1.2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-inStock">In Stock</Label>
                <Switch
                  id="edit-inStock"
                  checked={variantForm.inStock}
                  onCheckedChange={(checked) => setVariantForm(prev => ({ ...prev, inStock: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-isDefault">Default Variant</Label>
                <Switch
                  id="edit-isDefault"
                  checked={variantForm.isDefault}
                  onCheckedChange={(checked) => setVariantForm(prev => ({ ...prev, isDefault: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-isActive">Active</Label>
                <Switch
                  id="edit-isActive"
                  checked={variantForm.isActive}
                  onCheckedChange={(checked) => setVariantForm(prev => ({ ...prev, isActive: checked }))}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Attributes</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {variantForm.attributes.map((attr, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Select
                        value={attr.attributeType}
                        onValueChange={(value) => updateAttribute(index, 'attributeType', value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {ATTRIBUTE_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={attr.attributeValue}
                        onValueChange={(value) => updateAttribute(index, 'attributeValue', value)}
                        disabled={!attr.attributeType}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Value" />
                        </SelectTrigger>
                        <SelectContent>
                          {attr.attributeType && COMMON_ATTRIBUTE_VALUES[attr.attributeType as keyof typeof COMMON_ATTRIBUTE_VALUES]?.map(value => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAttribute(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="py-4">
            <ImageUpload
              images={variantImages}
              onImagesChange={setVariantImages}
              maxImages={10}
              title="Variant Images"
              description="Upload images specific to this variant"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditVariant}
              disabled={!variantForm.name || !variantForm.sku || !variantForm.price}
            >
              Update Variant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
