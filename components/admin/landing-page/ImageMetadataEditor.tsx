import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSectionConfig } from '@/lib/landingPageConfig';
import { getImagePath } from '@/lib/imageUtils';

interface ImageMetadataEditorProps {
  open: boolean;
  onClose: () => void;
  imageId: number;
  sectionName: string;
  currentData: {
    altText: string;
    caption: string | null;
    linkUrl: string | null;
    metadata: any;
  };
  onSaveComplete: () => void;
}

const ImageMetadataEditor = ({
  open,
  onClose,
  imageId,
  sectionName,
  currentData,
  onSaveComplete
}: ImageMetadataEditorProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [altText, setAltText] = useState(currentData.altText);
  const [caption, setCaption] = useState(currentData.caption || '');
  const [linkUrl, setLinkUrl] = useState(currentData.linkUrl || '');
  const [metadata, setMetadata] = useState(currentData.metadata || {});
  
  // For hover images upload
  const [newHoverImages, setNewHoverImages] = useState<File[]>([]);
  const [hoverImagePreviews, setHoverImagePreviews] = useState<string[]>([]);

  const sectionConfig = getSectionConfig(sectionName);
  const hasHoverImages = sectionConfig.hasHoverImages;

  const handleMetadataChange = (key: string, value: any) => {
    setMetadata({ ...metadata, [key]: value });
  };

  const handleAddHoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    setNewHoverImages([...newHoverImages, file]);
    setHoverImagePreviews([...hoverImagePreviews, URL.createObjectURL(file)]);
  };

  const removeNewHoverImage = (index: number) => {
    setNewHoverImages(newHoverImages.filter((_, i) => i !== index));
    setHoverImagePreviews(hoverImagePreviews.filter((_, i) => i !== index));
  };

  const uploadHoverImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of newHoverImages) {
      const formData = new FormData();
      formData.append('files', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        urls.push(data.files?.[0]?.url || data.url);
      }
    }
    return urls;
  };

  const handleSave = async () => {
    if (!altText.trim()) {
      toast({
        title: 'Missing alt text',
        description: 'Alt text is required for SEO',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      // Upload new hover images if any
      let updatedMetadata = { ...metadata };
      if (newHoverImages.length > 0) {
        const uploadedUrls = await uploadHoverImages();
        const existingHoverImages = metadata.hoverImages || [];
        updatedMetadata = {
          ...metadata,
          hoverImages: [...existingHoverImages, ...uploadedUrls],
        };
      }

      const res = await fetch(`/api/admin/landing-page/images/${imageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          altText: altText.trim(),
          caption: caption.trim() || null,
          linkUrl: linkUrl.trim() || null,
          metadata: updatedMetadata,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      toast({
        title: 'Success',
        description: 'Image metadata updated',
      });

      onSaveComplete();
      onClose();
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save metadata',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Image Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alt Text */}
          <div>
            <Label htmlFor="edit-alt-text">Alt Text * (for SEO)</Label>
            <Input
              id="edit-alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="mt-2"
              required
            />
          </div>

          {/* Caption */}
          <div>
            <Label htmlFor="edit-caption">Caption</Label>
            <Textarea
              id="edit-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-2"
              rows={2}
            />
          </div>

          {/* Link URL */}
          <div>
            <Label htmlFor="edit-link-url">Link URL</Label>
            <Input
              id="edit-link-url"
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="/browse?category=work"
              className="mt-2"
            />
          </div>

          {/* Hover Images Section (for sections that support it) */}
          {hasHoverImages && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-forest mb-3">Hover Images (for animation)</h3>
              
              {/* Existing Hover Images */}
              {metadata.hoverImages && metadata.hoverImages.length > 0 && (
                <div className="mb-4">
                  <Label className="text-xs">Current Hover Images</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {metadata.hoverImages.map((url: string, idx: number) => (
                      <div key={idx} className="relative">
                        <img 
                          src={getImagePath(url)} 
                          alt={`Hover ${idx + 1}`} 
                          className="w-full h-20 object-cover rounded border border-sage/20" 
                        />
                        <div className="absolute -top-1 -left-1 bg-botanical text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add New Hover Images */}
              <div>
                <Label className="text-xs">Add More Hover Images</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {hoverImagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      <img src={preview} alt={`New hover ${idx + 1}`} className="w-full h-20 object-cover rounded border border-green-400" />
                      <Badge className="absolute -top-1 -left-1 bg-green-600 text-white text-xs h-5 px-1">NEW</Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full opacity-0 group-hover:opacity-100"
                        onClick={() => removeNewHoverImage(idx)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-sage/30 rounded cursor-pointer hover:border-botanical/40">
                    <Upload className="h-5 w-5 text-botanical/50" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleAddHoverImage}
                      key={hoverImagePreviews.length}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Section-Specific Metadata */}
          {sectionConfig.metadataFields.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-forest mb-3">
                {sectionConfig.displayName} Specific Fields
              </h3>
              <div className="space-y-3">
                {sectionConfig.metadataFields.map((field) => (
                  <div key={field.key}>
                    <Label htmlFor={`meta-${field.key}`}>
                      {field.label} {field.required && '*'}
                    </Label>
                    {field.type === 'json' ? (
                      <Textarea
                        id={`meta-${field.key}`}
                        value={JSON.stringify(metadata[field.key] || [], null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            handleMetadataChange(field.key, parsed);
                          } catch {
                            // Invalid JSON, don't update
                          }
                        }}
                        placeholder={field.placeholder}
                        className="mt-2 font-mono text-xs"
                        rows={4}
                      />
                    ) : field.type === 'number' ? (
                      <Input
                        id={`meta-${field.key}`}
                        type="number"
                        value={metadata[field.key] || ''}
                        onChange={(e) => handleMetadataChange(field.key, parseInt(e.target.value, 10))}
                        placeholder={field.placeholder}
                        className="mt-2"
                      />
                    ) : (
                      <Input
                        id={`meta-${field.key}`}
                        type="text"
                        value={metadata[field.key] || ''}
                        onChange={(e) => handleMetadataChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !altText.trim()}
              className="bg-botanical hover:bg-botanical/90"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageMetadataEditor;

