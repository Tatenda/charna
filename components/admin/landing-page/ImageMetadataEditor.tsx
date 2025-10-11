import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSectionConfig } from '@/lib/landingPageConfig';

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

  const sectionConfig = getSectionConfig(sectionName);

  const handleMetadataChange = (key: string, value: any) => {
    setMetadata({ ...metadata, [key]: value });
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
      const res = await fetch(`/api/admin/landing-page/images/${imageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          altText: altText.trim(),
          caption: caption.trim() || null,
          linkUrl: linkUrl.trim() || null,
          metadata,
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

