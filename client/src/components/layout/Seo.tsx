import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string;
  author?: string;
  robots?: string;
}

const Seo = ({ 
  title, 
  description, 
  image = '/images/hero-background.png',
  url,
  type = 'website',
  keywords = 'leather bags, handcrafted bags, South Africa, Johannesburg, premium leather, work bags, travel bags, tennis bags, business bags',
  author = 'Charna',
  robots = 'index, follow'
}: SeoProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (selector: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (element) {
        element.content = content;
      } else {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          const property = selector.match(/property="([^"]+)"/)?.[1];
          if (property) element.setAttribute('property', property);
        } else if (selector.includes('name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) element.setAttribute('name', name);
        }
        element.content = content;
        document.head.appendChild(element);
      }
    };

    // Helper function to generate full image URL
    const getFullImageUrl = (imageUrl: string) => {
      // Check if the URL is already absolute (starts with http:// or https://)
      if (/^https?:\/\//i.test(imageUrl)) {
        return imageUrl;
      }
      // For relative URLs, prepend the origin
      return `${window.location.origin}${imageUrl}`;
    };

    // Basic meta tags
    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[name="keywords"]', keywords);
    updateMetaTag('meta[name="author"]', author);

    // Open Graph tags
    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:type"]', type);
    updateMetaTag('meta[property="og:image"]', getFullImageUrl(image));
    updateMetaTag('meta[property="og:site_name"]', 'Charna');
    
    if (url) {
      updateMetaTag('meta[property="og:url"]', `${window.location.origin}${url}`);
    } else {
      updateMetaTag('meta[property="og:url"]', window.location.href);
    }

    // Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', title);
    updateMetaTag('meta[name="twitter:description"]', description);
    updateMetaTag('meta[name="twitter:image"]', getFullImageUrl(image));
    
    // Additional structured data
    updateMetaTag('meta[name="robots"]', robots);
    updateMetaTag('meta[name="language"]', 'English');
    updateMetaTag('meta[name="revisit-after"]', '7 days');

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = url ? `${window.location.origin}${url}` : window.location.href;
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = url ? `${window.location.origin}${url}` : window.location.href;
      document.head.appendChild(canonicalLink);
    }

  }, [title, description, image, url, type, keywords, author, robots]);

  return null; // This component doesn't render anything
};

export default Seo;