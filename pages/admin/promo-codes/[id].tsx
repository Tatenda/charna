import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Users, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';

interface PromoCodeDetail {
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
  usageLogs: Array<{
    id: number;
    customerEmail: string;
    discountApplied: number;
    createdAt: Date;
    orderId?: number;
  }>;
  orders: Array<{
    id: number;
    totalAmount: number;
    discountAmount: number;
    createdAt: Date;
    customerInfo: any;
  }>;
}

export default function EditPromoCodePage() {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [promoCode, setPromoCode] = useState<PromoCodeDetail | null>(null);

  const [formData, setFormData] = useState({
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    maxUses: '',
    maxUsesPerUser: '',
    validFrom: '',
    validUntil: '',
    minimumOrderValue: '',
    isActive: true
  });

  useEffect(() => {
    if (id) {
      fetchPromoCode();
    }
  }, [id]);

  const fetchPromoCode = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('GET', `/api/admin/promo-codes/${id}`);
      const data = await response.json();
      setPromoCode(data);

      // Populate form
      setFormData({
        description: data.description || '',
        discountType: data.discountType,
        discountValue: data.discountValue.toString(),
        maxUses: data.maxUses?.toString() || '',
        maxUsesPerUser: data.maxUsesPerUser?.toString() || '',
        validFrom: new Date(data.validFrom).toISOString().split('T')[0],
        validUntil: data.validUntil ? new Date(data.validUntil).toISOString().split('T')[0] : '',
        minimumOrderValue: data.minimumOrderValue?.toString() || '',
        isActive: data.isActive
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch promo code',
        variant: 'destructive'
      });
      router.push('/admin/promo-codes');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Discount value must be greater than 0',
        variant: 'destructive'
      });
      return;
    }

    if (formData.discountType === 'percentage') {
      const value = parseFloat(formData.discountValue);
      if (value < 1 || value > 100) {
        toast({
          title: 'Validation Error',
          description: 'Percentage discount must be between 1 and 100',
          variant: 'destructive'
        });
        return;
      }
    }

    setSaving(true);

    try {
      const payload = {
        description: formData.description.trim() || undefined,
        discountType: formData.discountType,
        discountValue: parseInt(formData.discountValue),
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
        maxUsesPerUser: formData.maxUsesPerUser ? parseInt(formData.maxUsesPerUser) : undefined,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil || undefined,
        minimumOrderValue: formData.minimumOrderValue ? parseInt(formData.minimumOrderValue) : undefined,
        isActive: formData.isActive
      };

      await apiRequest('PUT', `/api/admin/promo-codes/${id}`, payload);

      toast({
        title: 'Success!',
        description: 'Promo code updated successfully'
      });

      router.push('/admin/promo-codes');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update promo code',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const isExpired = promoCode?.validUntil && new Date(promoCode.validUntil) < new Date();

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10 flex items-center justify-center">
          <div className="text-botanical/70">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!promoCode) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10">
        <div className="space-y-6 p-6 max-w-6xl">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/admin/promo-codes">
              <Button variant="ghost" className="text-botanical hover:text-botanical/80">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-heading text-forest">{promoCode.code}</h1>
                {promoCode.isActive && !isExpired && (
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                )}
                {!promoCode.isActive && (
                  <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
                )}
                {isExpired && (
                  <Badge className="bg-red-100 text-red-700">Expired</Badge>
                )}
              </div>
              <p className="text-sm text-botanical/80 font-medium mt-1">
                Edit promotional code settings
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
                  <CardHeader>
                    <CardTitle className="text-forest">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-botanical">Promo Code</Label>
                      <Input
                        value={promoCode.code}
                        disabled
                        className="bg-gray-50 mt-1"
                      />
                      <p className="text-xs text-botanical/60 mt-1">Code cannot be changed</p>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-botanical">Description (Internal)</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="e.g. Summer sale promotion for new customers"
                        className="border-sage/20 focus:border-botanical mt-1"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Discount Settings */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
                  <CardHeader>
                    <CardTitle className="text-forest">Discount Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-botanical">Discount Type *</Label>
                      <RadioGroup
                        value={formData.discountType}
                        onValueChange={(value) => handleChange('discountType', value)}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="percentage" id="percentage" />
                          <Label htmlFor="percentage" className="cursor-pointer font-normal">Percentage (%)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fixed" id="fixed" />
                          <Label htmlFor="fixed" className="cursor-pointer font-normal">Fixed Amount (R)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="discountValue" className="text-botanical">Discount Value *</Label>
                      <Input
                        id="discountValue"
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) => handleChange('discountValue', e.target.value)}
                        placeholder={formData.discountType === 'percentage' ? 'e.g. 10' : 'e.g. 50'}
                        className="border-sage/20 focus:border-botanical mt-1"
                        min="1"
                        max={formData.discountType === 'percentage' ? '100' : undefined}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="minimumOrderValue" className="text-botanical">Minimum Order Value (Optional)</Label>
                      <Input
                        id="minimumOrderValue"
                        type="number"
                        value={formData.minimumOrderValue}
                        onChange={(e) => handleChange('minimumOrderValue', e.target.value)}
                        placeholder="e.g. 500"
                        className="border-sage/20 focus:border-botanical mt-1"
                        min="0"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Limits */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
                  <CardHeader>
                    <CardTitle className="text-forest">Usage Limits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="maxUses" className="text-botanical">Maximum Total Uses (Optional)</Label>
                      <Input
                        id="maxUses"
                        type="number"
                        value={formData.maxUses}
                        onChange={(e) => handleChange('maxUses', e.target.value)}
                        placeholder="Unlimited"
                        className="border-sage/20 focus:border-botanical mt-1"
                        min="1"
                      />
                      <p className="text-xs text-botanical/60 mt-1">
                        Currently used: {promoCode.usedCount} times
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="maxUsesPerUser" className="text-botanical">Maximum Uses Per Customer</Label>
                      <Input
                        id="maxUsesPerUser"
                        type="number"
                        value={formData.maxUsesPerUser}
                        onChange={(e) => handleChange('maxUsesPerUser', e.target.value)}
                        placeholder="1"
                        className="border-sage/20 focus:border-botanical mt-1"
                        min="1"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Validity Period */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
                  <CardHeader>
                    <CardTitle className="text-forest">Validity Period</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="validFrom" className="text-botanical">Valid From *</Label>
                      <Input
                        id="validFrom"
                        type="date"
                        value={formData.validFrom}
                        onChange={(e) => handleChange('validFrom', e.target.value)}
                        className="border-sage/20 focus:border-botanical mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="validUntil" className="text-botanical">Valid Until (Optional)</Label>
                      <Input
                        id="validUntil"
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => handleChange('validUntil', e.target.value)}
                        className="border-sage/20 focus:border-botanical mt-1"
                        min={formData.validFrom}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Status */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
                  <CardHeader>
                    <CardTitle className="text-forest">Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="isActive" className="text-botanical">Active</Label>
                        <p className="text-xs text-botanical/60">Code can be used when active</p>
                      </div>
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleChange('isActive', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-4">
                  <Link href="/admin/promo-codes" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-botanical to-sage hover:from-botanical/90 hover:to-sage/90 text-white font-heading font-medium"
                    disabled={saving}
                  >
                    {saving ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Promo Code
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Stats & Usage Sidebar */}
            <div className="space-y-6">
              {/* Usage Stats */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
                <CardHeader>
                  <CardTitle className="text-forest text-lg">Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-botanical/70">Total Uses</span>
                    </div>
                    <span className="text-lg font-bold text-forest">{promoCode.usedCount}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-botanical/70">Orders</span>
                    </div>
                    <span className="text-lg font-bold text-forest">{promoCode.orders.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Usage */}
              {promoCode.usageLogs.length > 0 && (
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
                  <CardHeader>
                    <CardTitle className="text-forest text-lg">Recent Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {promoCode.usageLogs.slice(0, 5).map((log) => (
                        <div key={log.id} className="text-sm border-b border-sage/10 pb-2 last:border-0">
                          <p className="text-botanical/70 truncate">{log.customerEmail}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-botanical/50">
                              {format(new Date(log.createdAt), 'MMM dd, yyyy')}
                            </span>
                            <span className="text-xs font-medium text-green-600">
                              -R{log.discountApplied}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
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

