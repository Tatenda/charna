import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

function generateSitemap(urls: SitemapUrl[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') || 
                  'https://www.charna.co.za';

  // Static pages
  const staticPages: SitemapUrl[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: `${baseUrl}/browse`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/story`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/faq`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      loc: `${baseUrl}/shipping-returns`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      loc: `${baseUrl}/care`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      loc: `${baseUrl}/privacy`,
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.3,
    },
    {
      loc: `${baseUrl}/terms`,
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.3,
    },
  ];

  // Fetch all active products from database
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Add product pages to sitemap
    const productPages: SitemapUrl[] = products.map((product) => ({
      loc: `${baseUrl}/products/${product.id}`,
      lastmod: product.updatedAt.toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.8,
    }));

    // Combine all URLs
    const allUrls = [...staticPages, ...productPages];

    // Generate sitemap XML
    const sitemap = generateSitemap(allUrls);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to static pages only if database query fails
    const sitemap = generateSitemap(staticPages);
    
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  }
};

// This export is required for Next.js to treat this as a page
export default function Sitemap() {
  return null;
}
