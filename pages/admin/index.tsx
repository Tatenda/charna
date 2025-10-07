import { GetServerSideProps } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AdminLayout from "@/components/admin/layout/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, MessageSquare, Users, Tag, Star, Eye } from "lucide-react"

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalContacts: number
  totalUsers: number
  totalCategories: number
  totalVariants: number
  activeProducts: number
  featuredProducts: number
}

interface AdminDashboardProps {
  stats: DashboardStats
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      description: "Products in catalog",
      icon: Package,
      color: "text-forest",
      bgColor: "bg-gradient-to-br from-sage/10 to-botanical/10",
      borderColor: "border-sage/20"
    },
    {
      title: "Active Products",
      value: stats.activeProducts,
      description: "Currently available",
      icon: Eye,
      color: "text-botanical",
      bgColor: "bg-gradient-to-br from-leaf/10 to-botanical/10",
      borderColor: "border-leaf/20"
    },
    {
      title: "Featured Products",
      value: stats.featuredProducts,
      description: "Highlighted items",
      icon: Star,
      color: "text-terracotta",
      bgColor: "bg-gradient-to-br from-terracotta/10 to-orange-200/20",
      borderColor: "border-terracotta/20"
    },
    {
      title: "Product Variants",
      value: stats.totalVariants,
      description: "Color & style options",
      icon: Tag,
      color: "text-moss",
      bgColor: "bg-gradient-to-br from-eucalyptus/10 to-moss/10",
      borderColor: "border-eucalyptus/20"
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      description: "Product categories",
      icon: MessageSquare,
      color: "text-forest",
      bgColor: "bg-gradient-to-br from-mint/20 to-sage/10",
      borderColor: "border-mint/30"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      description: "Customer orders",
      icon: ShoppingCart,
      color: "text-botanical",
      bgColor: "bg-gradient-to-br from-leaf/10 to-botanical/10",
      borderColor: "border-botanical/20"
    },
    {
      title: "Contact Messages",
      value: stats.totalContacts,
      description: "Customer inquiries",
      icon: MessageSquare,
      color: "text-moss",
      bgColor: "bg-gradient-to-br from-eucalyptus/10 to-moss/10",
      borderColor: "border-eucalyptus/20"
    },
    {
      title: "Admin Users",
      value: stats.totalUsers,
      description: "System administrators",
      icon: Users,
      color: "text-forest",
      bgColor: "bg-gradient-to-br from-sage/10 to-forest/10",
      borderColor: "border-sage/20"
    }
  ]

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10">
        <div className="space-y-6 p-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-heading text-forest">
              Dashboard Overview
            </h1>
            <p className="text-sm text-botanical/80 font-medium">
              Manage your collection of handcrafted bags and accessories
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title} className={`${stat.bgColor} ${stat.borderColor} border-2 hover:shadow-lg transition-all duration-300 group hover:scale-105`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-heading font-semibold text-forest">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform duration-200`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold font-heading ${stat.color}`}>{stat.value}</div>
                    <p className="text-sm text-botanical/70 font-medium mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="bg-white/90 backdrop-blur-sm border-2 border-botanical/30 shadow-xl rounded-2xl p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-heading font-bold text-forest mb-2">Quick Actions</h2>
              <p className="text-sm text-botanical/80">Common administrative tasks</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="group p-4 bg-gradient-to-br from-sage/20 to-botanical/10 border-2 border-sage/30 rounded-xl hover:border-botanical/40 hover:from-sage/30 hover:to-botanical/20 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105">
                <div className="flex items-center space-x-3 mb-2">
                  <Package className="h-5 w-5 text-botanical group-hover:scale-110 transition-transform duration-200" />
                  <h3 className="font-heading font-semibold text-forest text-sm">Add New Product</h3>
                </div>
                <p className="text-xs text-botanical/70">Create a new product in your catalog</p>
              </div>
              <div className="group p-4 bg-gradient-to-br from-sage/20 to-botanical/10 border-2 border-sage/30 rounded-xl hover:border-botanical/40 hover:from-sage/30 hover:to-botanical/20 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105">
                <div className="flex items-center space-x-3 mb-2">
                  <ShoppingCart className="h-5 w-5 text-botanical group-hover:scale-110 transition-transform duration-200" />
                  <h3 className="font-heading font-semibold text-forest text-sm">View Recent Orders</h3>
                </div>
                <p className="text-xs text-botanical/70">Check latest customer orders</p>
              </div>
              <div className="group p-4 bg-gradient-to-br from-sage/20 to-botanical/10 border-2 border-sage/30 rounded-xl hover:border-botanical/40 hover:from-sage/30 hover:to-botanical/20 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105">
                <div className="flex items-center space-x-3 mb-2">
                  <Tag className="h-5 w-5 text-botanical group-hover:scale-110 transition-transform duration-200" />
                  <h3 className="font-heading font-semibold text-forest text-sm">Manage Categories</h3>
                </div>
                <p className="text-xs text-botanical/70">Organize product categories</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session || session.user?.role !== "admin") {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    }
  }

  // Fetch actual stats from database
  const [
    totalProducts,
    totalOrders,
    totalContacts,
    totalUsers,
    totalCategories,
    totalVariants,
    activeProducts,
    featuredProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.contact.count(),
    prisma.user.count(),
    prisma.category.count(),
    prisma.productVariant.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { featured: true } }),
  ]);

  const stats: DashboardStats = {
    totalProducts,
    totalOrders,
    totalContacts,
    totalUsers,
    totalCategories,
    totalVariants,
    activeProducts,
    featuredProducts,
  }

  return {
    props: {
      stats,
    },
  }
}
