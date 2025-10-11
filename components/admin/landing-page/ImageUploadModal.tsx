import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadModalProps {
  open: boolean;
  onClose: () => void;
  sectionId: number;
  sectionName: string;
  currentImageCount: number;
  maxImages?: number;
  onUploadComplete: () => void;
}

const ImageUploadModal = ({
  open,
  onClose,
  sectionId,
  sectionName,
  currentImageCount,
  maxImages,
  onUploadComplete
}: ImageUploadModalProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile || !altText.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please select an image and provide alt text',
        variant: 'destructive',
      });
      return;
    }

    if (maxImages && currentImageCount >= maxImages) {
      toast({
        title: 'Image limit reached',
        description: `This section can only have ${maxImages} image(s)`,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // 1. Upload to Vercel Blob
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload image');
      }

      const { url } = await uploadRes.json();

      // 2. Save to database
      const imageData = {
        sectionId,
        imageUrl: url,
        altText: altText.trim(),
        caption: caption.trim() || null,
        linkUrl: linkUrl.trim() || null,
        order: currentImageCount,
        enabled: true,
      };

      const saveRes = await fetch('/api/admin/landing-page/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageData),
      });

      if (!saveRes.ok) {
        throw new Error('Failed to save image');
      }

      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });

      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setAltText('');
      setCaption('');
      setLinkUrl('');

      onUploadComplete();
      onClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Image to {sectionName}</DialogTitle>
          <DialogDescription>
            {maxImages && (
              <span className="text-sm">
                {currentImageCount} / {maxImages} images used
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <Label htmlFor="file-upload">Image File *</Label>
            <div className="mt-2">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-sage/20"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-sage/30 rounded-lg cursor-pointer hover:border-botanical/40 transition-colors"
                >
                  <Upload className="h-12 w-12 text-botanical/50 mb-4" />
                  <span className="text-sm text-botanical/70">
                    Click to select image or drag and drop
                  </span>
                  <span className="text-xs text-botanical/50 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Alt Text */}
          <div>
            <Label htmlFor="alt-text">Alt Text * (for SEO & accessibility)</Label>
            <Input
              id="alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image"
              className="mt-2"
              required
            />
          </div>

          {/* Caption */}
          <div>
            <Label htmlFor="caption">Caption (optional)</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Additional description"
              className="mt-2"
              rows={2}
            />
          </div>

          {/* Link URL */}
          <div>
            <Label htmlFor="link-url">Link URL (optional)</Label>
            <Input
              id="link-url"
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-2"
            />
          </div>

          {/* Upload Button */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !selectedFile || !altText.trim()}
              className="bg-botanical hover:bg-botanical/90"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Image'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadModal;

