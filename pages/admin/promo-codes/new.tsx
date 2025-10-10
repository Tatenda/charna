import { useState } from 'react';
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
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function NewPromoCodePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    maxUses: '',
    maxUsesPerUser: '1',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: '',
    minimumOrderValue: '',
    isActive: true
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing characters
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleChange('code', code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.code.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Promo code is required',
        variant: 'destructive'
      });
      return;
    }

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
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim() || undefined,
        discountType: formData.discountType,
        discountValue: parseInt(formData.discountValue),
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
        maxUsesPerUser: formData.maxUsesPerUser ? parseInt(formData.maxUsesPerUser) : 1,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil || undefined,
        minimumOrderValue: formData.minimumOrderValue ? parseInt(formData.minimumOrderValue) : undefined,
        isActive: formData.isActive
      };

      const response = await apiRequest('POST', '/api/admin/promo-codes', payload);
      const data = await response.json();

      toast({
        title: 'Success!',
        description: 'Promo code created successfully'
      });

      router.push('/admin/promo-codes');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create promo code',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10">
        <div className="space-y-6 p-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/admin/promo-codes">
              <Button variant="ghost" className="text-botanical hover:text-botanical/80">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading text-forest">Create Promo Code</h1>
              <p className="text-sm text-botanical/80 font-medium mt-1">
                Add a new promotional discount code
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 mb-6">
              <CardHeader>
                <CardTitle className="text-forest">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="code" className="text-botanical">Promo Code *</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                      placeholder="e.g. SUMMER2025"
                      className="border-sage/20 focus:border-botanical"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateCode}
                      className="whitespace-nowrap"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-botanical/60 mt-1">Will be converted to uppercase</p>
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
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 mb-6">
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
                  <Label htmlFor="discountValue" className="text-botanical">
                    Discount Value *
                  </Label>
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
                  <p className="text-xs text-botanical/60 mt-1">
                    {formData.discountType === 'percentage' 
                      ? 'Enter percentage (1-100)' 
                      : 'Enter amount in Rands'}
                  </p>
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
                  <p className="text-xs text-botanical/60 mt-1">Minimum cart value in Rands to apply this code</p>
                </div>
              </CardContent>
            </Card>

            {/* Usage Limits */}
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 mb-6">
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
                  <p className="text-xs text-botanical/60 mt-1">Leave empty for unlimited uses</p>
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
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 mb-6">
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
                  <p className="text-xs text-botanical/60 mt-1">Leave empty for no expiry date</p>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 mb-6">
              <CardHeader>
                <CardTitle className="text-forest">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isActive" className="text-botanical">Active</Label>
                    <p className="text-xs text-botanical/60">Code can be used immediately when active</p>
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
                    Create Promo Code
                  </>
                )}
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

