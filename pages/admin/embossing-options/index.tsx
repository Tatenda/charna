import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Type,
  Plus,
  Search,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { getImagePath } from '@/lib/imageUtils';

interface EmbossingOption {
  id: number;
  name: string;
  slug: string;
  price: number;
  images: string[]; // Array of image URLs
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function EmbossingOptionsPage() {
  const [embossingOptions, setEmbossingOptions] = useState<EmbossingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchEmbossingOptions();
  }, [filterStatus]);

  const fetchEmbossingOptions = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('GET', '/api/admin/embossing-options');
      const data = await response.json();
      setEmbossingOptions(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch embossing options',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const option = embossingOptions.find(o => o.id === id);
      if (!option) return;

      await apiRequest('PUT', `/api/admin/embossing-options/${id}`, {
        name: option.name,
        slug: option.slug,
        price: option.price,
        images: option.images,
        active: !currentStatus,
        sortOrder: option.sortOrder
      });
      
      toast({
        title: 'Success',
        description: `Embossing option ${currentStatus ? 'deactivated' : 'activated'} successfully`
      });
      
      fetchEmbossingOptions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update embossing option',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this embossing option?')) return;
    
    try {
      await apiRequest('DELETE', `/api/admin/embossing-options/${id}`);
      
      toast({
        title: 'Success',
        description: 'Embossing option deleted successfully'
      });
      
      fetchEmbossingOptions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete embossing option',
        variant: 'destructive'
      });
    }
  };

  const filteredOptions = embossingOptions.filter(option => {
    const matchesSearch = option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         option.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && option.active) ||
                         (filterStatus === 'inactive' && !option.active);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: embossingOptions.length,
    active: embossingOptions.filter(o => o.active).length,
    totalImages: embossingOptions.reduce((sum, o) => sum + (o.images?.length || 0), 0)
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10">
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading text-forest">Embossing Options</h1>
              <p className="text-sm text-botanical/80 font-medium mt-1">
                Manage embossing fonts and styles for products
              </p>
            </div>
            <Link href="/admin/embossing-options/new">
              <Button className="bg-gradient-to-r from-botanical to-sage hover:from-botanical/90 hover:to-sage/90 text-white font-heading font-medium">
                <Plus className="h-4 w-4 mr-2" />
                Create Embossing Option
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Total Options</p>
                    <p className="text-2xl font-bold text-forest mt-1">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-botanical/20 to-sage/20 rounded-lg flex items-center justify-center">
                    <Type className="h-6 w-6 text-botanical" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Active Options</p>
                    <p className="text-2xl font-bold text-forest mt-1">{stats.active}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-green-400/20 to-green-500/20 rounded-lg flex items-center justify-center">
                    <ToggleRight className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Total Images</p>
                    <p className="text-2xl font-bold text-forest mt-1">{stats.totalImages}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-400/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-botanical/50 h-4 w-4" />
                    <Input
                      placeholder="Search by name or slug..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-sage/30 focus:border-botanical/50"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('all')}
                    className={filterStatus === 'all' ? 'bg-botanical text-white' : ''}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === 'active' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('active')}
                    className={filterStatus === 'active' ? 'bg-botanical text-white' : ''}
                  >
                    Active
                  </Button>
                  <Button
                    variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('inactive')}
                    className={filterStatus === 'inactive' ? 'bg-botanical text-white' : ''}
                  >
                    Inactive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* List */}
          {loading ? (
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-botanical mx-auto"></div>
                <p className="mt-4 text-botanical/70">Loading embossing options...</p>
              </CardContent>
            </Card>
          ) : filteredOptions.length === 0 ? (
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-12 text-center">
                <Type className="h-12 w-12 text-botanical/30 mx-auto mb-4" />
                <p className="text-botanical/70">No embossing options found</p>
                <Link href="/admin/embossing-options/new">
                  <Button className="mt-4 bg-botanical text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Option
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOptions.map((option) => (
                <Card key={option.id} className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 hover:border-botanical/40 transition-all">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Preview Images */}
                      {option.images && option.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {option.images.slice(0, 4).map((image, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-sage/20">
                              <img
                                src={getImagePath(image)}
                                alt={`${option.name} preview ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Name and Price */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-heading font-semibold text-forest text-lg">{option.name}</h3>
                          <Badge variant={option.active ? 'default' : 'secondary'} className={option.active ? 'bg-green-500' : ''}>
                            {option.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-botanical/70 mb-1">Slug: {option.slug}</p>
                        <div className="flex items-center text-botanical font-semibold">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>R{option.price}</span>
                        </div>
                        {option.images && option.images.length > 4 && (
                          <p className="text-xs text-botanical/60 mt-1">
                            +{option.images.length - 4} more image{option.images.length - 4 > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t border-sage/20">
                        <Link href={`/admin/embossing-options/${option.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(option.id, option.active)}
                        >
                          {option.active ? (
                            <ToggleLeft className="h-4 w-4" />
                          ) : (
                            <ToggleRight className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(option.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
