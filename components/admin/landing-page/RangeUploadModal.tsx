import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RangeUploadModalProps {
  open: boolean;
  onClose: () => void;
  sectionId: number;
  currentImageCount: number;
  onUploadComplete: () => void;
}

const RangeUploadModal = ({
  open,
  onClose,
  sectionId,
  currentImageCount,
  onUploadComplete
}: RangeUploadModalProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  
  // Main image
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  
  // Hover image
  const [hoverImage, setHoverImage] = useState<File | null>(null);
  const [hoverPreview, setHoverPreview] = useState<string | null>(null);
  
  // Range details
  const [rangeName, setRangeName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('work');
  const [linkUrl, setLinkUrl] = useState('');

  const handleMainImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const handleHoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setHoverImage(file);
    setHoverPreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string> => {
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

    const uploadData = await uploadRes.json();
    const url = uploadData.files?.[0]?.url || uploadData.url;
    
    if (!url) {
      console.error('No URL in upload response:', uploadData);
      throw new Error('Upload succeeded but no URL was returned');
    }
    
    return url;
  };

  const handleAddRange = async () => {
    if (!mainImage || !rangeName.trim() || !price || !description.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields and select main image',
        variant: 'destructive',
      });
      return;
    }

    // Validate price is a valid number
    const priceNum = parseInt(price, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: 'Invalid price',
        description: 'Please enter a valid price greater than 0',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // 1. Upload main image
      const mainImageUrl = await uploadImage(mainImage);
      console.log('Main image uploaded:', mainImageUrl);

      // 2. Upload hover image if provided
      let hoverImageUrl = null;
      if (hoverImage) {
        hoverImageUrl = await uploadImage(hoverImage);
        console.log('Hover image uploaded:', hoverImageUrl);
      }

      // 3. Save range to database
      const rangeData = {
        sectionId,
        imageUrl: mainImageUrl,
        altText: `${rangeName} - ${category} bag`,
        caption: description.trim(),
        linkUrl: linkUrl.trim() || `/browse?category=${category}`,
        order: currentImageCount * 10, // Use increments of 10 to allow reordering
        enabled: true,
        metadata: {
          rangeName: rangeName.trim(),
          price: priceNum, // Use the already validated priceNum
          description: description.trim(),
          category,
          ...(hoverImageUrl && { hoverImage: hoverImageUrl }),
        },
      };

      const saveRes = await fetch('/api/admin/landing-page/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rangeData),
      });

      if (!saveRes.ok) {
        throw new Error('Failed to save range');
      }

      toast({
        title: 'Success',
        description: `${rangeName} added successfully`,
      });

      // Reset form
      setMainImage(null);
      setMainPreview(null);
      setHoverImage(null);
      setHoverPreview(null);
      setRangeName('');
      setPrice('');
      setDescription('');
      setCategory('work');
      setLinkUrl('');

      onUploadComplete();
      onClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to add range',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product Range</DialogTitle>
          <DialogDescription>
            Upload main and hover images, then fill in range details
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div>
              <Label htmlFor="main-image">Main Image *</Label>
              <div className="mt-2">
                {mainPreview ? (
                  <div className="relative">
                    <img
                      src={mainPreview}
                      alt="Main preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-sage/20"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setMainImage(null);
                        setMainPreview(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="main-image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-sage/30 rounded-lg cursor-pointer hover:border-botanical/40 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-botanical/50 mb-2" />
                    <span className="text-sm text-botanical/70">Upload main image</span>
                    <span className="text-xs text-botanical/50 mt-1">PNG, JPG up to 5MB</span>
                    <input
                      id="main-image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleMainImageSelect}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Hover Image */}
            <div>
              <Label htmlFor="hover-image">Hover Image (optional)</Label>
              <div className="mt-2">
                {hoverPreview ? (
                  <div className="relative">
                    <img
                      src={hoverPreview}
                      alt="Hover preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-sage/20"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setHoverImage(null);
                        setHoverPreview(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="hover-image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-sage/30 rounded-lg cursor-pointer hover:border-botanical/40 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-botanical/50 mb-2" />
                    <span className="text-sm text-botanical/70">Upload hover image</span>
                    <span className="text-xs text-botanical/50 mt-1">Shows on mouse over</span>
                    <input
                      id="hover-image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleHoverImageSelect}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="space-y-4">
            {/* Range Name */}
            <div>
              <Label htmlFor="range-name">Range Name *</Label>
              <Input
                id="range-name"
                value={rangeName}
                onChange={(e) => setRangeName(e.target.value)}
                placeholder="e.g., Retro Range, Classic Range"
                className="mt-2"
                required
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price">Price (ZAR) *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2399"
                className="mt-2"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the range"
                className="mt-2"
                rows={3}
                required
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="leisure">Leisure</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="gifting">Gifting</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Link URL */}
            <div>
              <Label htmlFor="link-url">Link URL (optional)</Label>
              <Input
                id="link-url"
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder={`/browse?category=${category}`}
                className="mt-2"
              />
              <p className="text-xs text-botanical/60 mt-1">
                Leave empty to use category default
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t mt-6">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddRange}
            disabled={uploading || !mainImage || !rangeName.trim() || !price || !description.trim()}
            className="bg-botanical hover:bg-botanical/90"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding Range...
              </>
            ) : (
              'Add Range'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RangeUploadModal;

