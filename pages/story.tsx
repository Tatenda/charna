import { useState, useEffect } from "react";
import Seo from "@/components/layout/Seo";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import WhatsAppBanner from "@/components/home/WhatsAppBanner";
import { getImagePath } from "@/lib/imageUtils";

const Story = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pageMeta, setPageMeta] = useState<any>(null);

  // Fetch CMS content and metadata on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/page-content/about-us');
        if (response.ok) {
          const data = await response.json();
          if (data.content) {
            setContent(data.content);
          }
          // Also store metadata for SEO
          setPageMeta(data);
        }
      } catch (error) {
        console.error('Error fetching About Us page content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show loading state
  if (loading || !content) {
    return (
      <div className="bg-secondary-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary-light">
      <Seo 
        title={pageMeta?.metaTitle || "Our Story | Charna. - Made in Johannesburg with Purpose"}
        description={pageMeta?.metaDescription || "Discover the story behind Charna.'s handcrafted leather bags. Learn about our skilled South African artisans in Johannesburg who create premium leather goods with traditional craftsmanship and sustainable practices."}
        keywords="Charna. story, South African craftsmanship, Johannesburg leather workshop, artisan bags, sustainable leather goods, handmade bags South Africa"
        image="/images/tennis-bag-lifestyle.jpg"
        url="/story"
      />
      {/* Hero */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-4">
            {content.hero.title}
          </h1>
          <p className="text-white/80 text-center max-w-3xl mx-auto text-lg">
            {content.hero.description}
          </p>
        </div>
      </div>
      
      {/* Origin Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-semibold text-primary mb-6">{content.originStory.heading}</h2>
              <div className="divider mb-6"></div>
              {content.originStory.paragraphs && content.originStory.paragraphs.map((paragraph: string, index: number) => (
                <p key={index} className={`text-neutral leading-relaxed ${index < content.originStory.paragraphs.length - 1 ? 'mb-4' : ''}`}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div>
              <img 
                src={getImagePath(content.originStory.imageUrl)} 
                alt={content.originStory.imageAlt} 
                className="rounded-lg shadow-lg w-full"
                style={{ imageRendering: 'auto' }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Values and Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-semibold text-primary">{content.values.heading}</h2>
            <div className="divider mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.values.items && content.values.items.map((item: any, index: number) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={item.icon as any} className="text-primary text-2xl" />
                </div>
                <h3 className="font-accent text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-neutral">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <blockquote className="text-2xl font-heading text-primary italic max-w-3xl mx-auto">
              "{content.quote.text}"
            </blockquote>
            <p className="mt-4 font-accent font-semibold">{content.quote.author}</p>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-4">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-semibold text-primary mb-6">{content.cta.heading}</h2>
          <p className="text-neutral max-w-2xl mx-auto mb-8">
            {content.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {content.cta.buttons && content.cta.buttons.map((button: any, index: number) => (
              <Link key={index} href={button.url} className={`btn-${button.variant}`}>
                {button.text}
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      <WhatsAppBanner />
    </div>
  );
};

export default Story;
