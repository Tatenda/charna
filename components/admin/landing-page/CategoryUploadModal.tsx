import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Loader2, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CategoryUploadModalProps {
  open: boolean;
  onClose: () => void;
  sectionId: number;
  currentImageCount: number;
  maxImages: number;
  onUploadComplete: () => void;
}

const CategoryUploadModal = ({
  open,
  onClose,
  sectionId,
  currentImageCount,
  maxImages,
  onUploadComplete
}: CategoryUploadModalProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  
  // Main image
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  
  // Hover images (multiple)
  const [hoverImages, setHoverImages] = useState<File[]>([]);
  const [hoverPreviews, setHoverPreviews] = useState<string[]>([]);
  
  // Category details
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [gridSpan, setGridSpan] = useState('col-span-1 row-span-1');
  const [linkUrl, setLinkUrl] = useState('');

  const handleMainImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Invalid file',
        description: 'Please select a valid image under 5MB',
        variant: 'destructive',
      });
      return;
    }

    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const handleAddHoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Invalid file',
        description: 'Please select a valid image under 5MB',
        variant: 'destructive',
      });
      return;
    }

    setHoverImages([...hoverImages, file]);
    setHoverPreviews([...hoverPreviews, URL.createObjectURL(file)]);
  };

  const removeHoverImage = (index: number) => {
    setHoverImages(hoverImages.filter((_, i) => i !== index));
    setHoverPreviews(hoverPreviews.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('files', file);

    const uploadRes = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      const errorData = await uploadRes.json().catch(() => ({ message: 'Unknown error' }));
      const errorMessage = errorData.error || errorData.message || 'Failed to upload image';
      console.error('Upload failed:', {
        status: uploadRes.status,
        statusText: uploadRes.statusText,
        error: errorData,
        fileName: file.name,
      });
      throw new Error(errorMessage);
    }

    const data = await uploadRes.json();
    const url = data.files?.[0]?.url || data.url;
    
    if (!url) {
      console.error('No URL in upload response:', data);
      throw new Error('Upload succeeded but no URL was returned');
    }
    
    return url;
  };

  const handleAddCategory = async () => {
    if (!mainImage || !categoryName.trim() || !description.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields and select main image',
        variant: 'destructive',
      });
      return;
    }

    if (hoverImages.length < 3) {
      toast({
        title: 'Not enough hover images',
        description: 'Please add at least 3 hover images for animation effect',
        variant: 'destructive',
      });
      return;
    }

    if (currentImageCount >= maxImages) {
      toast({
        title: 'Limit reached',
        description: `Maximum ${maxImages} categories allowed`,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Upload main image
      const mainImageUrl = await uploadFile(mainImage);

      // Upload all hover images
      const hoverImageUrls = [];
      for (const hoverImg of hoverImages) {
        const url = await uploadFile(hoverImg);
        hoverImageUrls.push(url);
      }

      // Save to database
      const categoryData = {
        sectionId,
        imageUrl: mainImageUrl,
        altText: `${categoryName} Collection`,
        caption: description.trim(),
        linkUrl: linkUrl.trim() || '/browse',
        order: currentImageCount * 10, // Use increments of 10 to allow reordering
        enabled: true,
        metadata: {
          categoryName: categoryName.trim(),
          description: description.trim(),
          gridSpan,
          hoverImages: hoverImageUrls.length > 0 ? hoverImageUrls : undefined,
        },
      };

      const saveRes = await fetch('/api/admin/landing-page/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });

      if (!saveRes.ok) {
        throw new Error('Failed to save category');
      }

      toast({
        title: 'Success',
        description: `${categoryName} category added`,
      });

      // Reset form
      setMainImage(null);
      setMainPreview(null);
      setHoverImages([]);
      setHoverPreviews([]);
      setCategoryName('');
      setDescription('');
      setGridSpan('col-span-1 row-span-1');
      setLinkUrl('');

      onUploadComplete();
      onClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to add category',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Category Tile</DialogTitle>
          <DialogDescription>
            {currentImageCount} / {maxImages} categories used • Add 3-5 hover images for animation effect
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Image */}
          <div>
            <Label>Main Image *</Label>
            <div className="mt-2">
              {mainPreview ? (
                <div className="relative">
                  <img src={mainPreview} alt="Main" className="w-full h-40 object-cover rounded-lg border-2 border-sage/20" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => { setMainImage(null); setMainPreview(null); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="main-img-cat" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-sage/30 rounded-lg cursor-pointer hover:border-botanical/40">
                  <Upload className="h-8 w-8 text-botanical/50 mb-2" />
                  <span className="text-xs text-botanical/70">Main image</span>
                  <input id="main-img-cat" type="file" className="hidden" accept="image/*" onChange={handleMainImageSelect} />
                </label>
              )}
            </div>
          </div>

          {/* Hover Images */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-2">
              <Label>Hover Images (required for animation)</Label>
              <Badge variant={hoverPreviews.length >= 3 ? 'default' : 'destructive'} className="text-xs">
                {hoverPreviews.length} / 3-5 images
              </Badge>
            </div>
            <p className="text-xs text-botanical/60 mb-2">
              Upload 3-5 images that will alternate when user hovers over this category tile
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {hoverPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img src={preview} alt={`Hover ${index + 1}`} className="w-full h-24 object-cover rounded-lg border border-sage/20" />
                  <div className="absolute -top-1 -left-1 bg-botanical text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {index + 1}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeHoverImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {hoverPreviews.length < 5 && (
                <label htmlFor="hover-img-cat" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-sage/30 rounded-lg cursor-pointer hover:border-botanical/40 transition-colors">
                  <Plus className="h-6 w-6 text-botanical/50 mb-1" />
                  <span className="text-xs text-botanical/60">Add hover image</span>
                  <input 
                    id="hover-img-cat" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleAddHoverImage}
                    key={hoverPreviews.length} // Reset input after each upload
                  />
                </label>
              )}
            </div>
            {hoverPreviews.length < 3 && (
              <p className="text-xs text-red-600 mt-2">
                ⚠️ Add at least 3 hover images for smooth animation
              </p>
            )}
          </div>
        </div>

        {/* Category Details */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="cat-name">Category Name *</Label>
            <Input
              id="cat-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Business, Sports, Leisure..."
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="grid-span">Grid Size</Label>
            <Select value={gridSpan} onValueChange={setGridSpan}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="col-span-1 row-span-1">Small (1x1)</SelectItem>
                <SelectItem value="col-span-2 row-span-1">Wide (2x1)</SelectItem>
                <SelectItem value="col-span-1 row-span-2">Tall (1x2)</SelectItem>
                <SelectItem value="col-span-2 row-span-2">Large (2x2)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cat-desc">Description *</Label>
            <Textarea
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Professional Excellence"
              className="mt-2"
              rows={2}
              required
            />
          </div>

          <div>
            <Label htmlFor="cat-link">Link URL</Label>
            <Input
              id="cat-link"
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="/browse?category=work"
              className="mt-2"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t mt-6">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddCategory}
            disabled={uploading || !mainImage || !categoryName.trim() || !description.trim() || hoverImages.length < 3}
            className="bg-botanical hover:bg-botanical/90"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding Category...
              </>
            ) : (
              'Add Category'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryUploadModal;

