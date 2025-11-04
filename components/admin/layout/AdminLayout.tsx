import { ReactNode } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  MessageSquare,
  Settings,
  LogOut,
  User,
  FolderTree,
  Tag,
  Image,
  ChevronRight,
  Bell,
  FileText,
  Type
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/admin/login")
    return null
  }

  if (session?.user?.role !== "admin") {
    router.push("/admin/login")
    return null
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Promo Codes", href: "/admin/promo-codes", icon: Tag },
    { name: "Embossing Options", href: "/admin/embossing-options", icon: Type },
    { name: "Landing Page", href: "/admin/landing-page", icon: Image },
    { name: "Page Content", href: "/admin/page-content", icon: FileText },
    { name: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  ]

  const handleSignOut = () => {
    signOut({ callbackUrl: "/admin/login" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint/10 via-white to-sage/5">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-sm shadow-xl border-r-2 border-sage/20">
        <div className="flex h-16 items-center justify-center border-b-2 border-sage/20 bg-gradient-to-r from-sage/10 to-botanical/10">
          <h1 className="text-xl font-heading font-bold text-forest">Charna Admin</h1>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = router.pathname === item.href
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-heading font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-botanical/20 to-sage/20 text-forest border-2 border-sage/30 shadow-sm"
                        : "text-botanical/80 hover:bg-gradient-to-r hover:from-sage/10 hover:to-botanical/10 hover:text-forest hover:border-2 hover:border-sage/20"
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-botanical' : 'text-sage'}`} />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Simplified Header */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm shadow-sm border-b border-sage/10">
          <div className="flex items-center justify-between px-6 py-3">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/admin" className="text-botanical/60 hover:text-botanical transition-colors font-medium">
                Admin
              </Link>
              {router.pathname !== "/admin" && (
                <>
                  <ChevronRight className="h-4 w-4 text-sage/40" />
                  <span className="text-forest font-semibold">
                    {navigation
                      .slice()
                      .sort((a, b) => b.href.length - a.href.length)
                      .find(item => router.pathname.startsWith(item.href))?.name || "Page"}
                  </span>
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative hover:bg-sage/10">
                <Bell className="h-5 w-5 text-botanical/70" />
                {/* Notification badge - example */}
                {false && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-terracotta text-white text-xs flex items-center justify-center">
                    3
                  </span>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-sage/10">
                    <Avatar className="h-8 w-8 border-2 border-sage/20">
                      <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                      <AvatarFallback className="bg-botanical/10 text-botanical">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-forest hidden md:inline">
                      {session?.user?.name?.split(' ')[0] || 'Admin'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{session?.user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
