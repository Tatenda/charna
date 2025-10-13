import Link from "next/link";
import { useLandingPageSection } from "@/hooks/useLandingPageSection";
import { getImagePath } from "@/lib/imageUtils";

const RangesSection = () => {
  const { section: rangesSection, loading } = useLandingPageSection('ranges');

  if (loading) {
    return (
      <section className="py-12" style={{backgroundColor: '#F5F1E8'}}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="h-10 w-48 bg-gray-200 animate-pulse rounded mx-auto mb-4"></div>
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="w-full h-80 bg-gray-200 animate-pulse rounded-xl"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!rangesSection || !rangesSection.images || rangesSection.images.length === 0) {
    return null; // Hide section if no data
  }

  return (
    <section className="py-12" style={{backgroundColor: rangesSection.settings?.backgroundColor || '#F5F1E8'}}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-georgia-bold text-botanical mb-4">
            {rangesSection.title || 'Our Ranges'}
          </h2>
          <Link 
            href={rangesSection.settings?.ctaLink || '/browse?category=work'} 
            className="bg-botanical text-white px-8 py-3 font-semibold hover:bg-botanical/90 transition-colors rounded-lg"
          >
            {rangesSection.settings?.ctaText || 'Shop All'}
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {rangesSection.images.map((range) => {
            const metadata = range.metadata || {};
            
            return (
              <Link 
                key={range.id}
                href={range.linkUrl || '/browse?category=work'} 
                className="group cursor-pointer block"
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  {/* Main image */}
                  <img 
                    src={getImagePath(range.imageUrl)}
                    alt={range.altText}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 group-hover:opacity-0"
                    style={{ imageRendering: 'auto' }}
                  />
                  
                  {/* Hover image (if available) */}
                  {metadata.hoverImage && (
                    <img 
                      src={getImagePath(metadata.hoverImage)}
                      alt={`${range.altText} - Alternate view`}
                      className="absolute inset-0 w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 opacity-0 group-hover:opacity-100"
                      style={{ imageRendering: 'auto' }}
                    />
                  )}

                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Could integrate add to cart functionality here
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <h3 className="text-lg text-botanical mb-2">
                  {metadata.rangeName || range.caption || 'Product Range'}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {metadata.description || range.caption || ''}
                </p>
                {metadata.price && (
                  <p className="font-bold text-black">R{metadata.price}</p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RangesSection;

