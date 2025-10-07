import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Trash2,
  Plus,
  AlertCircle
} from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import { getImagePath } from '@/lib/imageUtils'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  title?: string
  description?: string
  productId?: number // Add productId for auto-save functionality
}

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  title = "Product Images",
  description = "Upload images for this product. Drag and drop or click to select files.",
  productId
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images total.`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      const newFilenames = result.files.map((file: any) => file.filename)
      const updatedImages = [...images, ...newFilenames]
      
      onImagesChange(updatedImages)
      
      // Auto-save to database if productId is provided
      if (productId) {
        try {
          // Get current product data to include all required fields
          const productResponse = await fetch(`/api/admin/products/${productId}`)
          if (!productResponse.ok) {
            throw new Error('Failed to fetch product data')
          }
          const currentProduct = await productResponse.json()
          
          // Update only the images, keeping all other fields
          await fetch(`/api/admin/products/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: currentProduct.name,
              slug: currentProduct.slug,
              description: currentProduct.description,
              longDescription: currentProduct.longDescription,
              basePrice: currentProduct.basePrice,
              rating: currentProduct.rating,
              reviewCount: currentProduct.reviewCount,
              badge: currentProduct.badge,
              materials: currentProduct.materials,
              dimensions: currentProduct.dimensions,
              careInstructions: currentProduct.careInstructions,
              featured: currentProduct.featured,
              isPackage: currentProduct.isPackage,
              isActive: currentProduct.isActive,
              images: updatedImages
            }),
          })
        } catch (error) {
          console.error('Auto-save failed:', error)
          toast({
            title: "Warning",
            description: "Images uploaded but not saved to database. Please save the product manually.",
            variant: "destructive",
          })
          return
        }
      }
      
      toast({
        title: "Upload successful",
        description: `${newFilenames.length} image(s) uploaded and saved successfully.`,
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-heading text-forest flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-botanical" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragOver 
              ? 'border-botanical bg-botanical/10' 
              : 'border-sage/30 hover:border-sage/50'
            }
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="h-12 w-12 text-sage/50 mx-auto mb-4" />
          <p className="text-lg font-medium text-forest mb-2">
            {isUploading ? 'Uploading...' : 'Drop images here or click to upload'}
          </p>
          <p className="text-sm text-botanical/70 mb-4">
            PNG, JPG, JPEG up to 10MB each
          </p>
          <Button
            onClick={openFileDialog}
            disabled={isUploading || images.length >= maxImages}
            className="bg-gradient-to-r from-botanical to-sage hover:from-botanical/90 hover:to-sage/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Select Images'}
          </Button>
          
          {images.length >= maxImages && (
            <div className="mt-4 flex items-center justify-center gap-2 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Maximum {maxImages} images reached</span>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Current Images */}
        {images.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-forest">
                Current Images ({images.length}/{maxImages})
              </h4>
              <Badge variant="outline" className="text-xs border-sage/30 text-sage">
                Click image to remove
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square relative overflow-hidden rounded-lg border border-sage/20">
                    <Image
                      src={getImagePath(image)}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    
                    {/* Remove button */}
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    
                    {/* Image index */}
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Image filename */}
                  <p className="text-xs text-botanical/70 mt-1 truncate" title={image}>
                    {image}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-sage/10 rounded-lg p-4">
          <h4 className="text-sm font-medium text-forest mb-2">Image Tips:</h4>
          <ul className="text-xs text-botanical/70 space-y-1">
            <li>• Use high-quality images (minimum 800x800px)</li>
            <li>• First image will be used as the main product image</li>
            <li>• Supported formats: PNG, JPG, JPEG</li>
            <li>• Maximum file size: 10MB per image</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
