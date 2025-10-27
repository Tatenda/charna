import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface PageContent {
  id: number;
  pageName: string;
  title: string | null;
  enabled: boolean;
  updatedAt: string;
}

export default function PageContentList() {
  const router = useRouter();
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageContents();
  }, []);

  const fetchPageContents = async () => {
    try {
      const response = await fetch('/api/admin/page-content');
      if (response.ok) {
        const data = await response.json();
        setPageContents(data);
      }
    } catch (error) {
      console.error('Error fetching page contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const predefinedPages = [
    { pageName: 'about-us', title: 'About Us', description: 'Edit the About Us page content' },
    { pageName: 'contact', title: 'Contact', description: 'Edit the Contact page content' },
    { pageName: 'shipping-returns', title: 'Shipping & Returns', description: 'Edit Shipping & Returns page' },
    { pageName: 'faq', title: 'FAQ', description: 'Edit Frequently Asked Questions' },
    { pageName: 'privacy', title: 'Privacy Policy', description: 'Edit Privacy Policy content' },
    { pageName: 'terms', title: 'Terms & Conditions', description: 'Edit Terms & Conditions' },
  ];

  const getPageStatus = (pageName: string) => {
    const existing = pageContents.find(p => p.pageName === pageName);
    return {
      exists: !!existing,
      enabled: existing?.enabled || false,
      lastUpdated: existing?.updatedAt
    };
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Page Content Management</h1>
          <p className="text-neutral">
            Edit content for static pages like About Us, Contact, and more.
          </p>
        </div>

        {/* Page Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predefinedPages.map((page) => {
            const status = getPageStatus(page.pageName);
            
            return (
              <Card key={page.pageName} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1">{page.title}</CardTitle>
                      <CardDescription>{page.description}</CardDescription>
                    </div>
                    {status.exists && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        status.enabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {status.enabled ? 'Published' : 'Draft'}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-neutral">
                      <strong>Page:</strong> {page.pageName}
                    </div>
                    {status.lastUpdated && (
                      <div className="text-xs text-neutral">
                        Last updated: {new Date(status.lastUpdated).toLocaleDateString()}
                      </div>
                    )}
                    <Link href={`/admin/page-content/${page.pageName}`}>
                      <Button className="w-full" variant={status.exists ? "default" : "outline"}>
                        {status.exists ? 'Edit Content' : 'Create Content'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Custom Pages Section */}
        {pageContents.some(p => !predefinedPages.find(pp => pp.pageName === p.pageName)) && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-primary mb-6">Custom Pages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageContents
                .filter(p => !predefinedPages.find(pp => pp.pageName === p.pageName))
                .map((page) => (
                  <Card key={page.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{page.title || page.pageName}</CardTitle>
                      <CardDescription>{page.pageName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/admin/page-content/${page.pageName}`}>
                        <Button className="w-full">Edit Content</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
