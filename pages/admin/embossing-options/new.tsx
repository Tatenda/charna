import { useState, useRef } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { getImagePath } from '@/lib/imageUtils';

export default function NewEmbossingOptionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '80',
    images: [] as string[],
    active: true,
    sortOrder: '0'
  });

  const handleInputChange = (field: string, value: any) => {
    if (field === 'name') {
      // Auto-generate slug from name
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: slug || prev.slug
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formDataToUpload = new FormData();
      Array.from(files).forEach(file => {
        formDataToUpload.append('files', file);
      });

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataToUpload,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload images');
      }

      const uploadData = await uploadRes.json();
      const uploadedUrls = uploadData.files.map((file: any) => file.filename);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));

      toast({
        title: 'Success',
        description: `Uploaded ${uploadedUrls.length} image(s) successfully`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Name is required',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.slug.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Slug is required',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.price || isNaN(parseInt(formData.price)) || parseInt(formData.price) < 0) {
      toast({
        title: 'Validation Error',
        description: 'Valid price is required',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      await apiRequest('POST', '/api/admin/embossing-options', {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        price: parseInt(formData.price),
        images: formData.images,
        active: formData.active,
        sortOrder: parseInt(formData.sortOrder) || 0
      });

      toast({
        title: 'Success',
        description: 'Embossing option created successfully'
      });

      router.push('/admin/embossing-options');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create embossing option',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading text-forest">Create Embossing Option</h1>
              <p className="text-sm text-botanical/80 font-medium mt-1">
                Add a new embossing font/style option
              </p>
            </div>
            <Link href="/admin/embossing-options">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardHeader>
                <CardTitle className="text-forest">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-forest">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Sans Serif, Serif, Script"
                    className="mt-1 border-sage/30 focus:border-botanical/50"
                    required
                  />
                  <p className="text-xs text-botanical/70 mt-1">Display name for this embossing option</p>
                </div>

                <div>
                  <Label htmlFor="slug" className="text-sm font-medium text-forest">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="e.g., sans-serif, serif, script"
                    className="mt-1 border-sage/30 focus:border-botanical/50"
                    required
                  />
                  <p className="text-xs text-botanical/70 mt-1">URL-friendly identifier (auto-generated from name)</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium text-forest">Price (Rands) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="80"
                      min="0"
                      className="mt-1 border-sage/30 focus:border-botanical/50"
                      required
                    />
                    <p className="text-xs text-botanical/70 mt-1">Price in whole Rands (e.g., 80 = R80.00)</p>
                  </div>

                  <div>
                    <Label htmlFor="sortOrder" className="text-sm font-medium text-forest">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                      placeholder="0"
                      className="mt-1 border-sage/30 focus:border-botanical/50"
                    />
                    <p className="text-xs text-botanical/70 mt-1">Lower numbers appear first</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-sage/20">
                  <div>
                    <Label htmlFor="active" className="text-sm font-medium text-forest">Active</Label>
                    <p className="text-xs text-botanical/70">Enable this option for customers</p>
                  </div>
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleInputChange('active', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardHeader>
                <CardTitle className="text-forest">Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="images" className="text-sm font-medium text-forest">Upload Images</Label>
                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Select Images'}
                    </Button>
                  </div>
                  <p className="text-xs text-botanical/70 mt-1">
                    Upload one or more preview images for this embossing option
                  </p>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-sage/20">
                          <img
                            src={getImagePath(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Badge className="absolute bottom-2 left-2">{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                )}

                {formData.images.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-sage/30 rounded-lg">
                    <ImageIcon className="h-12 w-12 text-botanical/30 mx-auto mb-2" />
                    <p className="text-sm text-botanical/70">No images uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Link href="/admin/embossing-options" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 bg-gradient-to-r from-botanical to-sage hover:from-botanical/90 hover:to-sage/90 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Creating...' : 'Create Embossing Option'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || session.user?.role !== 'admin') {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
