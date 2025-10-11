import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  ArrowLeft,
  Save,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  ExternalLink,
  Image as ImageIcon,
  Pencil,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getImagePath } from '@/lib/imageUtils';
import { getSectionConfig, canAddImage } from '@/lib/landingPageConfig';
import ImageUploadModal from '@/components/admin/landing-page/ImageUploadModal';
import ImageMetadataEditor from '@/components/admin/landing-page/ImageMetadataEditor';

interface LandingPageImage {
  id: number;
  sectionId: number;
  imageUrl: string;
  altText: string;
  caption: string | null;
  linkUrl: string | null;
  order: number;
  enabled: boolean;
  metadata: any;
}

interface LandingPageSection {
  id: number;
  name: string;
  title: string | null;
  subtitle: string | null;
  enabled: boolean;
  order: number;
  settings: any;
  images: LandingPageImage[];
}

const SectionEditor = () => {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<LandingPageSection | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<LandingPageImage | null>(null);

  useEffect(() => {
    if (id) {
      fetchSection();
    }
  }, [id]);

  const fetchSection = async () => {
    try {
      const res = await fetch(`/api/admin/landing-page/sections/${id}`);
      if (!res.ok) throw new Error('Failed to fetch section');
      const data = await res.json();
      setSection(data);
      setTitle(data.title || '');
      setSubtitle(data.subtitle || '');
      setEnabled(data.enabled);
    } catch (error) {
      console.error('Error fetching section:', error);
      toast({
        title: 'Error',
        description: 'Failed to load section',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async () => {
    try {
      const res = await fetch(`/api/admin/landing-page/sections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || null,
          subtitle: subtitle || null,
          enabled,
        }),
      });

      if (!res.ok) throw new Error('Failed to save section');

      toast({
        title: 'Success',
        description: 'Section updated successfully',
      });

      fetchSection();
    } catch (error) {
      console.error('Error saving section:', error);
      toast({
        title: 'Error',
        description: 'Failed to save section',
        variant: 'destructive',
      });
    }
  };

  const toggleImageEnabled = async (imageId: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/landing-page/images/${imageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentStatus }),
      });

      if (!res.ok) throw new Error('Failed to update image');

      toast({
        title: 'Success',
        description: `Image ${!currentStatus ? 'enabled' : 'disabled'}`,
      });

      fetchSection();
    } catch (error) {
      console.error('Error toggling image:', error);
      toast({
        title: 'Error',
        description: 'Failed to update image',
        variant: 'destructive',
      });
    }
  };

  const deleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const res = await fetch(`/api/admin/landing-page/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete image');

      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      });

      fetchSection();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      });
    }
  };

  const moveImage = async (imageId: number, direction: 'up' | 'down') => {
    if (!section) return;
    
    const currentImage = section.images.find(img => img.id === imageId);
    if (!currentImage) return;
    
    const sortedImages = [...section.images].sort((a, b) => a.order - b.order);
    const currentIndex = sortedImages.findIndex(img => img.id === imageId);
    
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === sortedImages.length - 1) return;
    
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapImage = sortedImages[swapIndex];
    
    try {
      // Swap orders
      await Promise.all([
        fetch(`/api/admin/landing-page/images/${currentImage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: swapImage.order }),
        }),
        fetch(`/api/admin/landing-page/images/${swapImage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: currentImage.order }),
        }),
      ]);
      
      fetchSection();
    } catch (error) {
      console.error('Error reordering image:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder image',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-botanical"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!section) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <p className="text-botanical/70 mb-4">Section not found</p>
          <Button onClick={() => router.push('/admin/landing-page')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Landing Page
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const sectionConfig = getSectionConfig(section.name);
  const canAdd = canAddImage(section.name, section.images.length);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/landing-page')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Landing Page
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-forest capitalize">
                Edit {section.name} Section
              </h1>
              <p className="text-botanical/70 mt-1">
                Manage images and settings for this section
              </p>
            </div>
            <Button onClick={saveSection} className="bg-botanical hover:bg-botanical/90">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Section Settings */}
        <div className="bg-white border border-sage/20 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-forest mb-4">Section Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter section title"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Section Subtitle</Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter section subtitle (optional)"
                className="mt-2"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Section Enabled</Label>
              <Switch id="enabled" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="bg-white border border-sage/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-forest">
                Images ({section.images.length})
              </h2>
              {sectionConfig.maxImages && (
                <p className="text-sm text-botanical/70 mt-1">
                  Maximum {sectionConfig.maxImages} image{sectionConfig.maxImages === 1 ? '' : 's'} allowed
                </p>
              )}
            </div>
            <Button
              size="sm"
              className="bg-botanical hover:bg-botanical/90"
              onClick={() => setUploadModalOpen(true)}
              disabled={!canAdd}
            >
              <Plus className="h-4 w-4 mr-2" />
              {canAdd ? 'Add Image' : 'Limit Reached'}
            </Button>
          </div>

          {section.images.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-sage/30 rounded-lg">
              <ImageIcon className="h-12 w-12 text-botanical/30 mx-auto mb-4" />
              <p className="text-botanical/70 mb-4">No images yet</p>
              <Button size="sm">Add Your First Image</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.images.map((image) => (
                <div
                  key={image.id}
                  className="group relative border border-sage/20 rounded-lg overflow-hidden hover:border-botanical/40 transition-colors"
                >
                  {/* Image Preview */}
                  <div className="aspect-square relative bg-gray-100">
                    <img
                      src={getImagePath(image.imageUrl)}
                      alt={image.altText}
                      className="w-full h-full object-cover"
                    />
                    {!image.enabled && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <EyeOff className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-white/90 text-xs">
                        #{image.order}
                      </Badge>
                    </div>
                    {image.linkUrl && (
                      <div className="absolute top-2 right-2">
                        <ExternalLink className="h-4 w-4 text-white drop-shadow" />
                      </div>
                    )}
                  </div>

                  {/* Image Info */}
                  <div className="p-3 bg-white">
                    <p className="text-sm font-medium text-forest truncate mb-1">
                      {image.altText}
                    </p>
                    {image.caption && (
                      <p className="text-xs text-botanical/70 truncate">{image.caption}</p>
                    )}
                    {image.linkUrl && (
                      <p className="text-xs text-blue-600 truncate mt-1">{image.linkUrl}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-2 bg-sage/5 border-t border-sage/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveImage(image.id, 'up')}
                          className="h-7 px-2"
                          disabled={image.order === 0}
                          title="Move up"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveImage(image.id, 'down')}
                          className="h-7 px-2"
                          disabled={image.order === section.images.length - 1}
                          title="Move down"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteImage(image.id)}
                        className="h-7 px-2 text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingImage(image)}
                        className="h-7 px-2 flex-1 text-xs"
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleImageEnabled(image.id, image.enabled)}
                        className="h-7 px-2 flex-1 text-xs"
                      >
                        {image.enabled ? (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Show
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        <ImageUploadModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          sectionId={section.id}
          sectionName={section.title || section.name}
          currentImageCount={section.images.length}
          maxImages={sectionConfig.maxImages || undefined}
          onUploadComplete={fetchSection}
        />

        {/* Metadata Editor Modal */}
        {editingImage && (
          <ImageMetadataEditor
            open={!!editingImage}
            onClose={() => setEditingImage(null)}
            imageId={editingImage.id}
            sectionName={section.name}
            currentData={{
              altText: editingImage.altText,
              caption: editingImage.caption,
              linkUrl: editingImage.linkUrl,
              metadata: editingImage.metadata || {},
            }}
            onSaveComplete={() => {
              fetchSection();
              setEditingImage(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default SectionEditor;

