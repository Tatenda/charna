import { useState, useEffect } from "react"
import { GetServerSideProps } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import AdminLayout from "@/components/admin/layout/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  Search,
  Filter,
  Tag,
  Mail
} from "lucide-react"
import { format } from "date-fns"
import { apiRequest } from "@/lib/queryClient"

interface Order {
  id: number;
  customerInfo: any;
  items: any[];
  subtotal?: number;
  discountAmount?: number;
  totalAmount: number;
  promoCodeUsed?: string;
  paymentId?: string;
  status: string;
  webhookPayload?: any;
  createdAt: Date;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [sendingReceipt, setSendingReceipt] = useState<number | null>(null);
  const [embossingOptions, setEmbossingOptions] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchOrders();
    fetchEmbossingOptions();
  }, []);

  const fetchEmbossingOptions = async () => {
    try {
      const response = await fetch('/api/embossing-options');
      if (response.ok) {
        const options = await response.json();
        const optionsMap: Record<number, string> = {};
        options.forEach((option: { id: number; name: string }) => {
          optionsMap[option.id] = option.name;
        });
        setEmbossingOptions(optionsMap);
      }
    } catch (error) {
      console.error('Failed to fetch embossing options:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReceipt = async (orderId: number, customerEmail: string) => {
    setSendingReceipt(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/send-receipt`, {
        method: 'POST',
      });

      if (response.ok) {
        alert(`Receipt sent successfully to ${customerEmail}`);
      } else {
        const error = await response.json();
        alert(`Failed to send receipt: ${error.message}`);
      }
    } catch (error) {
      console.error('Error sending receipt:', error);
      alert('Failed to send receipt. Please try again.');
    } finally {
      setSendingReceipt(null);
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    revenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    avgOrder: orders.length > 0 ? Math.round(orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length) : 0,
    totalDiscount: orders.reduce((sum, o) => sum + (o.discountAmount || 0), 0)
  };
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10">
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading text-forest">Orders</h1>
              <p className="text-sm text-botanical/80 font-medium mt-1">
                Manage and track customer orders
              </p>
            </div>
            <Button 
              disabled
              className="bg-gradient-to-r from-botanical to-sage hover:from-botanical/90 hover:to-sage/90 text-white font-heading font-medium opacity-50 cursor-not-allowed"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter Orders
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Total Orders</p>
                    <p className="text-2xl font-bold text-forest mt-1">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-botanical/20 to-sage/20 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-botanical" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Revenue</p>
                    <p className="text-2xl font-bold text-forest mt-1">R{stats.revenue.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-botanical/20 to-sage/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-botanical" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Avg. Order Value</p>
                    <p className="text-2xl font-bold text-forest mt-1">R{stats.avgOrder.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-botanical/20 to-sage/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-botanical" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Total Discounts</p>
                    <p className="text-2xl font-bold text-forest mt-1">R{stats.totalDiscount.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-green-400/20 to-green-500/20 rounded-lg flex items-center justify-center">
                    <Tag className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
            <CardHeader>
              <CardTitle className="text-forest">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-botanical/70">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-botanical/30 mx-auto mb-3" />
                  <p className="text-botanical/70">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => {
                    const customerName = order.customerInfo?.firstName 
                      ? `${order.customerInfo.firstName} ${order.customerInfo.lastName}`
                      : 'Unknown Customer';
                    const customerEmail = order.customerInfo?.email || '';
                    const isExpanded = expandedOrder === order.id;
                    const webhookData = order.webhookPayload;
                    const paymentMethod = webhookData?.payload?.paymentMethodDetails?.type || 'card';
                    
                    return (
                      <div
                        key={order.id}
                        className="border border-sage/20 rounded-lg hover:border-botanical/40 transition-colors overflow-hidden"
                      >
                        {/* Compact Header - Always Visible */}
                        <div 
                          className="p-3 cursor-pointer hover:bg-sage/5 transition-colors"
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            {/* Left Section: Order Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-base font-heading font-semibold text-forest">
                                  #{order.id}
                                </h3>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                                  {order.status}
                                </Badge>
                                {order.promoCodeUsed && (
                                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 flex items-center gap-1 text-xs">
                                    <Tag className="h-3 w-3" />
                                    {order.promoCodeUsed}
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {paymentMethod.replace('_', ' ')}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-4 text-xs text-botanical/70">
                                <span className="font-medium text-botanical truncate">{customerName}</span>
                                <span className="truncate">{customerEmail}</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(order.createdAt), 'MMM dd, HH:mm')}
                                </span>
                              </div>
                              
                              {/* Items Preview */}
                              <div className="mt-2 flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-botanical/60">
                                  {order.items?.slice(0, 2).map((item: any, idx: number) => (
                                    <span key={idx}>
                                      {item.quantity}x {item.productName || item.name}
                                      {idx < Math.min(order.items.length - 1, 1) && ', '}
                                    </span>
                                  ))}
                                  {order.items?.length > 2 && ` +${order.items.length - 2} more`}
                                </span>
                                {order.items?.some((item: any) => item.customizations?.embossing) && (
                                  <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100 text-xs font-semibold border border-amber-300 px-1.5 py-0">
                                    ✨ Has Embossing
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            {/* Right Section: Pricing */}
                            <div className="text-right flex-shrink-0">
                              <div className="text-2xl font-bold text-forest">
                                R{order.totalAmount.toLocaleString()}
                              </div>
                              {order.discountAmount && order.discountAmount > 0 && (
                                <div className="text-xs space-y-0.5 mt-1">
                                  <p className="text-botanical/60 line-through">
                                    R{order.subtotal?.toLocaleString()}
                                  </p>
                                  <p className="text-green-600 font-medium">
                                    -R{order.discountAmount.toLocaleString()} saved
                                  </p>
                                </div>
                              )}
                              <div className="flex items-center justify-end gap-2 mt-2">
                                <Package className="h-3 w-3 text-botanical/50" />
                                <span className="text-xs text-botanical/60">
                                  {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                                </span>
                              </div>
                            </div>
                            
                            {/* Expand Icon */}
                            <div className="flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                {isExpanded ? (
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                ) : (
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="border-t border-sage/20 bg-sage/5 px-4 py-3 space-y-3">
                            {/* Customer Details */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <h4 className="text-xs font-semibold text-forest mb-2">Customer Details</h4>
                                <div className="text-xs space-y-1 text-botanical/70">
                                  <p>{customerName}</p>
                                  <p>{customerEmail}</p>
                                  {order.customerInfo?.phone && <p>{order.customerInfo.phone}</p>}
                                  
                                  {/* Shipping Address */}
                                  {order.customerInfo?.address && (
                                    <div className="mt-2">
                                      <p className="font-semibold text-forest mb-1">Shipping:</p>
                                      <p>
                                        {order.customerInfo.address}<br/>
                                        {order.customerInfo.city}, {order.customerInfo.province} {order.customerInfo.postalCode}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {/* Billing Address - Only show if different */}
                                  {!order.customerInfo?.sameAsBilling && order.customerInfo?.billingAddress && (
                                    <div className="mt-2">
                                      <p className="font-semibold text-forest mb-1">Billing:</p>
                                      <p>
                                        {order.customerInfo.billingAddress}<br/>
                                        {order.customerInfo.billingCity}, {order.customerInfo.billingProvince} {order.customerInfo.billingPostalCode}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-xs font-semibold text-forest mb-2">Payment Details</h4>
                                <div className="text-xs space-y-1 text-botanical/70">
                                  {order.paymentId && (
                                    <p><span className="font-medium">ID:</span> {order.paymentId.substring(0, 20)}...</p>
                                  )}
                                  <p><span className="font-medium">Method:</span> {paymentMethod.replace('_', ' ')}</p>
                                  {webhookData?.payload?.currency && (
                                    <p><span className="font-medium">Currency:</span> {webhookData.payload.currency}</p>
                                  )}
                                  {webhookData?.payload?.mode && (
                                    <p><span className="font-medium">Mode:</span> {webhookData.payload.mode}</p>
                                  )}
                                  <p><span className="font-medium">Date:</span> {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm:ss')}</p>
                                </div>
                              </div>
                            </div>

                            {/* Order Items - Compact Table */}
                            <div>
                              <h4 className="text-xs font-semibold text-forest mb-2">Items Ordered</h4>
                              <div className="bg-white rounded border border-sage/10 overflow-hidden">
                                <table className="w-full text-xs">
                                  <thead className="bg-sage/10">
                                    <tr>
                                      <th className="text-left p-2 font-medium text-forest">Product</th>
                                      <th className="text-center p-2 font-medium text-forest">Qty</th>
                                      <th className="text-right p-2 font-medium text-forest">Price</th>
                                      <th className="text-right p-2 font-medium text-forest">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items?.map((item: any, idx: number) => (
                                      <tr key={idx} className="border-t border-sage/10">
                                        <td className="p-2">
                                          <div>
                                            <p className="font-medium text-botanical">{item.productName || item.name}</p>
                                            {item.customizations && (
                                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                {item.customizations.embossing && (
                                                  <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100 text-xs font-semibold border border-amber-300">
                                                    ✨ Embossing{item.customizations.embossingOptionId && embossingOptions[item.customizations.embossingOptionId] ? ` (${embossingOptions[item.customizations.embossingOptionId]})` : ''}: "{item.customizations.embossingText || 'Yes'}"
                                                  </Badge>
                                                )}
                                                {item.customizations.color && (
                                                  <Badge variant="outline" className="text-xs">
                                                    {item.customizations.color}
                                                  </Badge>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </td>
                                        <td className="p-2 text-center text-botanical/70">{item.quantity}</td>
                                        <td className="p-2 text-right">
                                          <div className="text-botanical/70">
                                            R{item.price.toLocaleString()}
                                            {item.customizations?.embossingPrice && (
                                              <div className="text-xs text-amber-900 font-semibold">
                                                + R{item.customizations.embossingPrice}
                                              </div>
                                            )}
                                          </div>
                                        </td>
                                        <td className="p-2 text-right font-medium text-forest">
                                          R{((item.price + (item.customizations?.embossingPrice || 0)) * item.quantity).toLocaleString()}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* Order Summary */}
                              <div className="mt-3 bg-white rounded border border-sage/10 p-3">
                                <div className="space-y-1.5 text-xs">
                                  {order.subtotal && (
                                    <div className="flex justify-between">
                                      <span className="text-botanical/70">Subtotal:</span>
                                      <span className="font-medium text-forest">R{order.subtotal.toLocaleString()}</span>
                                    </div>
                                  )}
                                  {order.discountAmount && order.discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                      <span className="font-medium">
                                        {order.promoCodeUsed ? `Discount (${order.promoCodeUsed}):` : 'Discount:'}
                                      </span>
                                      <span className="font-semibold">-R{order.discountAmount.toLocaleString()}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between pt-1.5 border-t border-sage/20">
                                    <span className="font-semibold text-forest">Total:</span>
                                    <span className="font-bold text-forest text-sm">R{order.totalAmount.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="mt-3 flex gap-2">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSendReceipt(order.id, customerEmail);
                                  }}
                                  disabled={sendingReceipt === order.id}
                                  className="bg-botanical hover:bg-botanical/90 text-white text-xs"
                                  size="sm"
                                >
                                  {sendingReceipt === order.id ? (
                                    <>
                                      <svg className="animate-spin h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Sending...
                                    </>
                                  ) : (
                                    <>
                                      <Mail className="h-3 w-3 mr-1.5" />
                                      Send Receipt
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* Webhook Payload (Developer Info) */}
                            {webhookData && (
                              <details className="text-xs">
                                <summary className="cursor-pointer font-medium text-botanical/70 hover:text-botanical py-1">
                                  🔧 Developer: View Raw Webhook Data
                                </summary>
                                <pre className="mt-2 text-xs overflow-auto max-h-64 bg-white p-3 rounded border border-sage/20 text-botanical/70">
                                  {JSON.stringify(webhookData, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session || session.user?.role !== 'admin') {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

