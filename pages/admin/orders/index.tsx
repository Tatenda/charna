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
  Tag
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

  useEffect(() => {
    fetchOrders();
  }, []);

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
                <div className="space-y-4">
                  {orders.map((order) => {
                    const customerName = order.customerInfo?.firstName 
                      ? `${order.customerInfo.firstName} ${order.customerInfo.lastName}`
                      : 'Unknown Customer';
                    const customerEmail = order.customerInfo?.email || '';
                    const isExpanded = expandedOrder === order.id;
                    const webhookData = order.webhookPayload;
                    
                    return (
                      <div
                        key={order.id}
                        className="flex flex-col p-4 border border-sage/20 rounded-lg hover:border-botanical/40 transition-colors gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-heading font-semibold text-forest">
                              Order #{order.id}
                            </h3>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              {order.status}
                            </Badge>
                            {order.promoCodeUsed && (
                              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {order.promoCodeUsed}
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-botanical/70">
                            <p className="font-medium text-botanical">{customerName}</p>
                            <p>{customerEmail}</p>
                            <p className="text-xs">{format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {order.subtotal && order.subtotal !== order.totalAmount && (
                            <div className="space-y-1 mb-2">
                              <p className="text-sm text-botanical/60">
                                Subtotal: <span className="line-through">R{order.subtotal.toLocaleString()}</span>
                              </p>
                              {order.discountAmount && order.discountAmount > 0 && (
                                <p className="text-sm text-green-600 font-medium">
                                  Discount: -R{order.discountAmount.toLocaleString()}
                                </p>
                              )}
                            </div>
                          )}
                          <p className="text-2xl font-bold text-forest">
                            R{order.totalAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-botanical/60 mt-1">
                            {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                        
                        {/* Expand/Collapse Button */}
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                            className="text-xs"
                          >
                            {isExpanded ? 'Hide Details' : 'Show Details'}
                          </Button>
                        </div>
                        
                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="border-t border-sage/20 pt-4 mt-2 space-y-4">
                            {/* Order Items */}
                            <div>
                              <h4 className="font-semibold text-forest mb-2">Order Items:</h4>
                              <div className="space-y-2">
                                {order.items?.map((item: any, idx: number) => (
                                  <div key={idx} className="bg-sage/5 p-3 rounded text-sm">
                                    <p className="font-medium">{item.productName || item.name}</p>
                                    <div className="text-botanical/70 space-y-1 mt-1">
                                      <p>Quantity: {item.quantity}</p>
                                      <p>Price: R{item.price}</p>
                                      {item.customizations && Object.keys(item.customizations).length > 0 && (
                                        <div className="mt-2 text-xs">
                                          <p className="font-medium">Customizations:</p>
                                          {item.customizations.embossing && (
                                            <p>• Embossing: {item.customizations.embossingText || 'Yes'} (+R{item.customizations.embossingPrice})</p>
                                          )}
                                          {item.customizations.color && (
                                            <p>• Color: {item.customizations.color}</p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Payment Info */}
                            {(order.paymentId || webhookData) && (
                              <div>
                                <h4 className="font-semibold text-forest mb-2">Payment Information:</h4>
                                <div className="bg-sage/5 p-3 rounded text-sm space-y-1">
                                  {order.paymentId && (
                                    <p><span className="font-medium">Payment ID:</span> {order.paymentId}</p>
                                  )}
                                  {webhookData?.payload?.paymentMethodDetails && (
                                    <p><span className="font-medium">Payment Method:</span> {webhookData.payload.paymentMethodDetails.type}</p>
                                  )}
                                  {webhookData?.payload?.currency && (
                                    <p><span className="font-medium">Currency:</span> {webhookData.payload.currency}</p>
                                  )}
                                  {webhookData?.payload?.mode && (
                                    <p><span className="font-medium">Mode:</span> <Badge variant="outline" className="text-xs">{webhookData.payload.mode}</Badge></p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Webhook Payload (Developer Info) */}
                            {webhookData && (
                              <div>
                                <h4 className="font-semibold text-forest mb-2">Webhook Data (Dev):</h4>
                                <details className="bg-gray-50 p-3 rounded">
                                  <summary className="cursor-pointer text-xs font-medium text-botanical/70 hover:text-botanical">
                                    View Raw Webhook Payload
                                  </summary>
                                  <pre className="mt-2 text-xs overflow-auto max-h-96 bg-white p-2 rounded border">
                                    {JSON.stringify(webhookData, null, 2)}
                                  </pre>
                                </details>
                              </div>
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

