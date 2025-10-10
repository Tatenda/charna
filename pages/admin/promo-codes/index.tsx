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
  Tag,
  Plus,
  Search,
  TrendingDown,
  Users,
  DollarSign,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';

interface PromoCode {
  id: number;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  usedCount: number;
  maxUsesPerUser?: number;
  validFrom: Date;
  validUntil?: Date;
  minimumOrderValue?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    orders: number;
    usageLogs: number;
  };
}

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPromoCodes();
  }, [filterStatus]);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const response = await apiRequest('GET', `/api/admin/promo-codes?${params.toString()}`);
      const data = await response.json();
      setPromoCodes(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch promo codes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await apiRequest('PUT', `/api/admin/promo-codes/${id}`, {
        isActive: !currentStatus
      });
      
      toast({
        title: 'Success',
        description: `Promo code ${currentStatus ? 'deactivated' : 'activated'} successfully`
      });
      
      fetchPromoCodes();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update promo code',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    
    try {
      await apiRequest('DELETE', `/api/admin/promo-codes/${id}`);
      
      toast({
        title: 'Success',
        description: 'Promo code deleted successfully'
      });
      
      fetchPromoCodes();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete promo code',
        variant: 'destructive'
      });
    }
  };

  const filteredPromoCodes = promoCodes.filter(code => 
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: promoCodes.length,
    active: promoCodes.filter(c => c.isActive).length,
    totalUsed: promoCodes.reduce((sum, c) => sum + c.usedCount, 0),
    totalDiscount: promoCodes.reduce((sum, c) => {
      const ordersCount = c._count?.orders || 0;
      return sum + (c.discountType === 'fixed' ? c.discountValue * ordersCount : 0);
    }, 0)
  };

  const getDiscountDisplay = (code: PromoCode) => {
    if (code.discountType === 'percentage') {
      return `${code.discountValue}% off`;
    }
    return `R${code.discountValue} off`;
  };

  const isExpired = (code: PromoCode) => {
    return code.validUntil && new Date(code.validUntil) < new Date();
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10">
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading text-forest">Promo Codes</h1>
              <p className="text-sm text-botanical/80 font-medium mt-1">
                Manage promotional codes and discounts
              </p>
            </div>
            <Link href="/admin/promo-codes/new">
              <Button className="bg-gradient-to-r from-botanical to-sage hover:from-botanical/90 hover:to-sage/90 text-white font-heading font-medium">
                <Plus className="h-4 w-4 mr-2" />
                Create Promo Code
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Total Codes</p>
                    <p className="text-2xl font-bold text-forest mt-1">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-botanical/20 to-sage/20 rounded-lg flex items-center justify-center">
                    <Tag className="h-6 w-6 text-botanical" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Active Codes</p>
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
                    <p className="text-sm font-medium text-botanical/70">Total Uses</p>
                    <p className="text-2xl font-bold text-forest mt-1">{stats.totalUsed}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-400/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Total Discount</p>
                    <p className="text-2xl font-bold text-forest mt-1">R{stats.totalDiscount}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-terracotta/20 to-orange-300/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-terracotta" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-botanical/50" />
                  <Input
                    placeholder="Search promo codes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-sage/20 focus:border-botanical"
                  />
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
                  <Button
                    variant={filterStatus === 'expired' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('expired')}
                    className={filterStatus === 'expired' ? 'bg-botanical text-white' : ''}
                  >
                    Expired
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promo Codes List */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
            <CardContent className="p-6">
              {loading ? (
                <div className="text-center py-8 text-botanical/70">Loading promo codes...</div>
              ) : filteredPromoCodes.length === 0 ? (
                <div className="text-center py-8">
                  <Tag className="h-12 w-12 text-botanical/30 mx-auto mb-3" />
                  <p className="text-botanical/70">No promo codes found</p>
                  <Link href="/admin/promo-codes/new">
                    <Button variant="link" className="text-botanical mt-2">
                      Create your first promo code
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPromoCodes.map((code) => (
                    <div
                      key={code.id}
                      className="flex items-center justify-between p-4 border border-sage/20 rounded-lg hover:border-botanical/40 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-heading font-semibold text-forest">{code.code}</h3>
                          {code.isActive && !isExpired(code) && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                          )}
                          {!code.isActive && (
                            <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Inactive</Badge>
                          )}
                          {isExpired(code) && (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Expired</Badge>
                          )}
                        </div>
                        {code.description && (
                          <p className="text-sm text-botanical/70 mb-2">{code.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-botanical/70">
                          <span className="font-medium text-botanical">{getDiscountDisplay(code)}</span>
                          <span>Used: {code.usedCount}{code.maxUses ? `/${code.maxUses}` : ''}</span>
                          {code.minimumOrderValue && (
                            <span>Min Order: R{code.minimumOrderValue}</span>
                          )}
                          <span>Valid from: {format(new Date(code.validFrom), 'MMM dd, yyyy')}</span>
                          {code.validUntil && (
                            <span>Until: {format(new Date(code.validUntil), 'MMM dd, yyyy')}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(code.id, code.isActive)}
                          className="text-botanical hover:text-botanical/80"
                        >
                          {code.isActive ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </Button>
                        <Link href={`/admin/promo-codes/${code.id}`}>
                          <Button variant="ghost" size="sm" className="text-botanical hover:text-botanical/80">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(code.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
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

