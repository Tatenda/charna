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
  Tag
} from "lucide-react"
import Link from "next/link"

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
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b-2 border-sage/20">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h2 className="text-lg font-heading font-semibold text-forest">
                {navigation.find(item => item.href === router.pathname)?.name || "Dashboard"}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
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
