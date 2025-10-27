import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLandingPageSection } from '@/hooks/useLandingPageSection';
import { getImagePath } from '@/lib/imageUtils';

// Separate component for category tile with hover animation
const CategoryTile = ({ category, metadata, hoverImages }: any) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isHovered && hoverImages.length > 0) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % hoverImages.length);
      }, 1500);
    } else {
      setCurrentImageIndex(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, hoverImages.length]);

  return (
    <Link
      href={category.linkUrl || '/browse'}
      className={`${metadata.gridSpan || 'col-span-1 row-span-1'} group relative overflow-hidden shadow-xl h-full w-full`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {hoverImages.length > 0 ? (
        // Animated hover images
        hoverImages.map((imgUrl: string, imgIndex: number) => (
          <img
            key={imgIndex}
            src={getImagePath(imgUrl)}
            alt={`${category.altText} - ${imgIndex + 1}`}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imgIndex === currentImageIndex ? 'opacity-100' : 'opacity-0 absolute inset-0'
            }`}
            style={{ imageRendering: 'auto' }}
          />
        ))
      ) : (
        // Single image
        <img
          src={getImagePath(category.imageUrl)}
          alt={category.altText}
          className="w-full h-full object-cover"
          style={{ imageRendering: 'auto' }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
      <div className="absolute bottom-6 left-6 text-white min-h-[60px] flex flex-col justify-end">
        <h3 className="text-lg font-semibold text-white mb-1 leading-tight">
          {metadata.categoryName || category.caption || 'Category'}
        </h3>
        <p className="text-sm opacity-90 text-white leading-tight">
          {metadata.description || ''}
        </p>
      </div>
    </Link>
  );
};

const CategoriesSection = () => {
  const { section: categoriesSection, loading } = useLandingPageSection('categories');

  if (loading) {
    return (
      <section className="relative overflow-hidden" style={{backgroundColor: '#7A8471'}}>
        <div className="relative z-10 text-center py-16">
          <div className="h-10 w-48 bg-gray-600/30 animate-pulse rounded mx-auto mb-4"></div>
          <div className="h-6 w-32 bg-gray-600/30 animate-pulse rounded mx-auto"></div>
        </div>
        <div className="h-[70vh] flex items-center justify-center">
          <div className="text-white text-xl">Loading categories...</div>
        </div>
      </section>
    );
  }

  if (!categoriesSection || !categoriesSection.images || categoriesSection.images.length === 0) {
    return null; // Hide section if no data
  }

  return (
    <section className="relative overflow-hidden" style={{backgroundColor: categoriesSection.settings?.backgroundColor || '#7A8471'}}>
      {/* Header */}
      <div className="relative z-10 text-center py-16">
        <h2 className="text-4xl font-georgia-bold text-white mb-4">
          {categoriesSection.title || 'Discover'}
        </h2>
        {categoriesSection.subtitle && (
          <p className="text-xl text-white/80">{categoriesSection.subtitle}</p>
        )}
      </div>
      
      {/* Desktop Grid - Responsive based on number of categories */}
      <div className="hidden md:grid md:grid-cols-6 md:grid-rows-2 gap-2 h-[70vh] w-full px-0">
        {categoriesSection.images.map((category) => {
          const metadata = category.metadata || {};
          const hoverImages = metadata.hoverImages || [];

          return (
            <CategoryTile
              key={category.id}
              category={category}
              metadata={metadata}
              hoverImages={hoverImages}
            />
          );
        })}
      </div>

      {/* Mobile Grid - Simpler layout */}
      <div className="md:hidden grid grid-cols-2 gap-3 px-4 pb-8">
        {categoriesSection.images.map((category, index) => {
          const metadata = category.metadata || {};
          const isLast = index === categoriesSection.images.length - 1;
          
          return (
            <Link
              key={category.id}
              href={category.linkUrl || '/browse'}
              className={`${isLast && categoriesSection.images.length % 2 !== 0 ? 'col-span-2' : ''} aspect-square group relative overflow-hidden shadow-xl rounded-lg`}
            >
              <img
                src={getImagePath(category.imageUrl)}
                alt={category.altText}
                className="w-full h-full object-cover"
                style={{ imageRendering: 'auto' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-sm font-semibold">{metadata.categoryName || category.caption}</h3>
                {metadata.description && (
                  <p className="text-xs opacity-90">{metadata.description}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="py-16"></div>
    </section>
  );
};

export default CategoriesSection;
