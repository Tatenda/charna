import { GetServerSideProps } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import AdminLayout from "@/components/admin/layout/AdminLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Clock,
  Search
} from "lucide-react"

export default function ContactsPage() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-mint/20 via-white to-sage/10">
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading text-forest">Contacts</h1>
              <p className="text-sm text-botanical/80 font-medium mt-1">
                Manage customer inquiries and messages
              </p>
            </div>
            <Button 
              disabled
              className="bg-gradient-to-r from-botanical to-sage hover:from-botanical/90 hover:to-sage/90 text-white font-heading font-medium opacity-50 cursor-not-allowed"
            >
              <Mail className="h-4 w-4 mr-2" />
              Reply to Selected
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Total Contacts</p>
                    <p className="text-2xl font-bold text-forest mt-1">0</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-botanical/20 to-sage/20 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-botanical" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Unread</p>
                    <p className="text-2xl font-bold text-forest mt-1">0</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-terracotta/20 to-orange-300/20 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-terracotta" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Today</p>
                    <p className="text-2xl font-bold text-forest mt-1">0</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-botanical/20 to-sage/20 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-botanical" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-botanical/70">Avg. Response</p>
                    <p className="text-2xl font-bold text-forest mt-1">--</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-botanical/20 to-sage/20 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-botanical" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-sage/20 shadow-lg">
            <CardContent className="p-12">
              <div className="text-center max-w-2xl mx-auto">
                <div className="h-20 w-20 bg-gradient-to-br from-botanical/20 to-sage/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-10 w-10 text-botanical" />
                </div>
                
                <h2 className="text-3xl font-heading font-bold text-forest mb-4">
                  Contact Management Coming Soon
                </h2>
                
                <p className="text-lg text-botanical/80 mb-8">
                  We're building a comprehensive contact management system where you'll be able to:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
                  <div className="flex items-start gap-3 p-4 bg-sage/5 rounded-lg">
                    <div className="h-8 w-8 bg-botanical/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-botanical" />
                    </div>
                    <div>
                      <h3 className="font-medium text-forest mb-1">View All Messages</h3>
                      <p className="text-sm text-botanical/70">Access all customer inquiries in one place</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-sage/5 rounded-lg">
                    <div className="h-8 w-8 bg-botanical/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-4 w-4 text-botanical" />
                    </div>
                    <div>
                      <h3 className="font-medium text-forest mb-1">Contact Details</h3>
                      <p className="text-sm text-botanical/70">See phone, email, and message history</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-sage/5 rounded-lg">
                    <div className="h-8 w-8 bg-botanical/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Search className="h-4 w-4 text-botanical" />
                    </div>
                    <div>
                      <h3 className="font-medium text-forest mb-1">Search & Filter</h3>
                      <p className="text-sm text-botanical/70">Quickly find specific contacts or messages</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-sage/5 rounded-lg">
                    <div className="h-8 w-8 bg-botanical/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-4 w-4 text-botanical" />
                    </div>
                    <div>
                      <h3 className="font-medium text-forest mb-1">Reply & Manage</h3>
                      <p className="text-sm text-botanical/70">Respond to inquiries and track status</p>
                    </div>
                  </div>
                </div>
                
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sage/10 to-botanical/10 rounded-lg border-2 border-sage/20">
                  <Clock className="h-5 w-5 text-botanical" />
                  <span className="text-botanical font-medium">In Development</span>
                </div>
              </div>
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

