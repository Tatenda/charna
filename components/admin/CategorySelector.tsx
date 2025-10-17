import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FolderTree, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Category {
  id: number
  name: string
  slug: string
  displayName: string
  parentId: number | null
  parent: Category | null
  children: Category[]
  isActive: boolean
}

interface CategorySelectorProps {
  selectedCategoryIds: number[]
  primaryCategoryId: number | null
  categoryOrders?: Record<number, number> // categoryId -> displayOrder
  onCategoriesChange: (categoryIds: number[], primaryId: number | null, orders?: Record<number, number>) => void
}

export default function CategorySelector({
  selectedCategoryIds,
  primaryCategoryId,
  categoryOrders = {},
  onCategoriesChange,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Record<number, number>>(categoryOrders)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        // Filter to show only active categories
        const activeCategories = data.filter((cat: Category) => cat.isActive)
        setCategories(activeCategories)
        
        // Auto-expand categories that have selected children
        const expanded = new Set<number>()
        activeCategories.forEach((cat: Category) => {
          if (cat.children?.some(child => selectedCategoryIds.includes(child.id))) {
            expanded.add(cat.id)
          }
        })
        setExpandedCategories(expanded)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryToggle = (categoryId: number) => {
    let newSelectedIds: number[]
    let newOrders = { ...orders }
    
    if (selectedCategoryIds.includes(categoryId)) {
      // Removing a category
      newSelectedIds = selectedCategoryIds.filter(id => id !== categoryId)
      delete newOrders[categoryId]
      
      // If it was the primary, clear primary or set to first remaining
      let newPrimaryId = primaryCategoryId
      if (primaryCategoryId === categoryId) {
        newPrimaryId = newSelectedIds.length > 0 ? newSelectedIds[0] : null
      }
      
      setOrders(newOrders)
      onCategoriesChange(newSelectedIds, newPrimaryId, newOrders)
    } else {
      // Adding a category
      newSelectedIds = [...selectedCategoryIds, categoryId]
      newOrders[categoryId] = Object.keys(newOrders).length // Auto-assign next order number
      
      // If this is the first category, make it primary
      const newPrimaryId = selectedCategoryIds.length === 0 ? categoryId : primaryCategoryId
      
      setOrders(newOrders)
      onCategoriesChange(newSelectedIds, newPrimaryId, newOrders)
    }
  }

  const handlePrimaryChange = (categoryId: number) => {
    onCategoriesChange(selectedCategoryIds, categoryId, orders)
  }
  
  const handleOrderChange = (categoryId: number, order: number) => {
    const newOrders = { ...orders, [categoryId]: order }
    setOrders(newOrders)
    onCategoriesChange(selectedCategoryIds, primaryCategoryId, newOrders)
  }

  const toggleExpand = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category.id)
    const isSelected = selectedCategoryIds.includes(category.id)
    const isPrimary = primaryCategoryId === category.id

    return (
      <div key={category.id} className="mb-2">
        <div 
          className={`flex items-center gap-2 p-2 rounded-md hover:bg-sage/5 transition-colors ${
            isSelected ? 'bg-sage/10' : ''
          }`}
          style={{ marginLeft: `${level * 20}px` }}
        >
          {hasChildren && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleExpand(category.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-botanical" />
              ) : (
                <ChevronRight className="h-4 w-4 text-botanical" />
              )}
            </Button>
          )}
          
          {!hasChildren && <div className="w-6" />}

          <div className="flex items-center gap-2 flex-1">
            <Checkbox
              id={`category-${category.id}`}
              checked={isSelected}
              onCheckedChange={() => handleCategoryToggle(category.id)}
            />
            <Label
              htmlFor={`category-${category.id}`}
              className="text-sm font-medium text-forest cursor-pointer flex items-center gap-2"
            >
              {category.displayName}
              {category.parent && (
                <Badge variant="outline" className="text-xs border-sage/30 text-botanical/70">
                  under {category.parent.displayName}
                </Badge>
              )}
              {isPrimary && (
                <Badge className="text-xs bg-botanical/20 text-botanical">
                  Primary
                </Badge>
              )}
            </Label>
          </div>

          {isSelected && selectedCategoryIds.length > 1 && (
            <RadioGroup
              value={primaryCategoryId?.toString() || ""}
              onValueChange={(value) => handlePrimaryChange(parseInt(value))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value={category.id.toString()}
                  id={`primary-${category.id}`}
                />
                <Label
                  htmlFor={`primary-${category.id}`}
                  className="text-xs text-botanical/70 cursor-pointer"
                >
                  Set as primary
                </Label>
              </div>
            </RadioGroup>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const topLevelCategories = categories.filter(cat => !cat.parentId)

  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-botanical mx-auto"></div>
        <p className="mt-2 text-sm text-botanical/70">Loading categories...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-forest flex items-center gap-2">
          <FolderTree className="h-4 w-4 text-botanical" />
          Categories
        </Label>
        {selectedCategoryIds.length > 0 && (
          <Badge variant="outline" className="border-sage/30 text-botanical">
            {selectedCategoryIds.length} selected
          </Badge>
        )}
      </div>

      <div className="border border-sage/20 rounded-lg p-4 bg-white/50 max-h-96 overflow-y-auto">
        {topLevelCategories.length === 0 ? (
          <p className="text-sm text-botanical/70 text-center py-4">
            No categories available. Create categories first.
          </p>
        ) : (
          <div>
            {topLevelCategories.map(category => renderCategory(category))}
          </div>
        )}
      </div>

      {selectedCategoryIds.length > 0 && (
        <div className="bg-sage/5 rounded-lg p-3 border border-sage/20">
          <p className="text-xs text-botanical/70 mb-2">Selected categories:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategoryIds.map(id => {
              const category = categories.find(c => c.id === id)
              if (!category) return null
              return (
                <Badge
                  key={id}
                  variant={id === primaryCategoryId ? "default" : "outline"}
                  className={
                    id === primaryCategoryId
                      ? "bg-botanical text-white"
                      : "border-sage/30 text-botanical"
                  }
                >
                  {category.displayName}
                  {id === primaryCategoryId && " ⭐"}
                </Badge>
              )
            })}
          </div>
          <p className="text-xs text-botanical/70 mt-2">
            {primaryCategoryId
              ? "⭐ Primary category is used for main navigation. Product display order is managed from the category edit page."
              : "Select at least one category and mark one as primary."}
          </p>
        </div>
      )}
    </div>
  )
}

