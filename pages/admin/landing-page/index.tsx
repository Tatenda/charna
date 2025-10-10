import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Eye, EyeOff, GripVertical, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LandingPageImage {
  id: number;
  imageUrl: string;
  altText: string;
  order: number;
  enabled: boolean;
}

interface LandingPageSection {
  id: number;
  name: string;
  title: string | null;
  subtitle: string | null;
  enabled: boolean;
  order: number;
  images: LandingPageImage[];
}

const LandingPageManager = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [sections, setSections] = useState<LandingPageSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/admin/landing-page/sections');
      if (!res.ok) throw new Error('Failed to fetch sections');
      const data = await res.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load landing page sections',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSectionEnabled = async (sectionId: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/landing-page/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentStatus }),
      });

      if (!res.ok) throw new Error('Failed to update section');

      toast({
        title: 'Success',
        description: `Section ${!currentStatus ? 'enabled' : 'disabled'} successfully`,
      });

      fetchSections();
    } catch (error) {
      console.error('Error toggling section:', error);
      toast({
        title: 'Error',
        description: 'Failed to update section',
        variant: 'destructive',
      });
    }
  };

  const getSectionIcon = (name: string) => {
    const icons: { [key: string]: string } = {
      hero: '🎬',
      ranges: '🎒',
      categories: '🏷️',
      capsule: '📦',
      instagram: '📸'
    };
    return icons[name] || '📄';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-botanical mx-auto"></div>
            <p className="mt-4 text-botanical/70">Loading sections...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-forest">
              Landing Page Management
            </h1>
            <p className="text-botanical/70 mt-1">
              Manage all images and content for your landing page sections
            </p>
          </div>
          <Button onClick={() => router.push('/admin/landing-page/sections/new')} className="bg-botanical hover:bg-botanical/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>

        {/* Sections List */}
        <div className="space-y-4">
          {sections.length === 0 ? (
            <div className="text-center py-16 bg-sage/10 rounded-lg">
              <p className="text-botanical/70 mb-4">No sections found</p>
              <Button onClick={() => router.push('/admin/landing-page/sections/new')}>
                Create Your First Section
              </Button>
            </div>
          ) : (
            sections.map((section) => (
              <div
                key={section.id}
                className="border border-sage/20 rounded-lg p-6 bg-white hover:border-botanical/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  {/* Left Section */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex flex-col items-center space-y-2">
                      <GripVertical className="h-5 w-5 text-botanical/30 cursor-move" />
                      <span className="text-2xl">{getSectionIcon(section.name)}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-heading font-semibold text-forest capitalize">
                          {section.title || section.name}
                        </h3>
                        <Badge
                          variant={section.enabled ? 'default' : 'secondary'}
                          className={section.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                        >
                          {section.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {section.images.length} {section.images.length === 1 ? 'image' : 'images'}
                        </Badge>
                      </div>

                      {section.subtitle && (
                        <p className="text-sm text-botanical/70 mb-3">{section.subtitle}</p>
                      )}

                      {/* Image Preview */}
                      {section.images.length > 0 && (
                        <div className="flex gap-2 mt-4 overflow-x-auto">
                          {section.images.slice(0, 6).map((image) => (
                            <div
                              key={image.id}
                              className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-sage/20"
                            >
                              <img
                                src={image.imageUrl}
                                alt={image.altText}
                                className="w-full h-full object-cover"
                              />
                              {!image.enabled && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <EyeOff className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </div>
                          ))}
                          {section.images.length > 6 && (
                            <div className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-sage/30 flex items-center justify-center text-botanical/50 text-xs">
                              +{section.images.length - 6} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSectionEnabled(section.id, section.enabled)}
                    >
                      {section.enabled ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Disable
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Enable
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/landing-page/sections/${section.id}`)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-8 p-6 bg-sage/5 rounded-lg border border-sage/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-forest">{sections.length}</p>
              <p className="text-sm text-botanical/70">Total Sections</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-forest">
                {sections.reduce((acc, s) => acc + s.images.length, 0)}
              </p>
              <p className="text-sm text-botanical/70">Total Images</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {sections.filter((s) => s.enabled).length}
              </p>
              <p className="text-sm text-botanical/70">Active Sections</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LandingPageManager;

