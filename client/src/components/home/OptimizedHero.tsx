import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import LazyImage from "@/components/ui/LazyImage";
import { withMemo } from "@/components/ui/memo";
import { getHeroImage, carouselImages } from "@/lib/heroAssets";
import { debounce } from "@/lib/imageOptimization";

const OptimizedHero = withMemo(() => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Preload next image for smoother transitions
  useEffect(() => {
    const nextIndex = (currentSlide + 1) % carouselImages.length;
    const nextImage = carouselImages[nextIndex];
    if (nextImage) {
      // Preload next image
      new Image().src = getHeroImage(nextImage.src);
    }
  }, [currentSlide]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* Hero Carousel */}
      <div className="relative h-screen overflow-hidden">
        {carouselImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{ 
              display: Math.abs(index - currentSlide) <= 1 ? 'block' : 'none' // Only render current and adjacent slides
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Text Content */}
              <div className="flex flex-col justify-center items-start px-8 lg:px-16 py-20 bg-gradient-to-br from-white/90 to-stone-100/90">
                <div className="max-w-xl">
                  <h1 className="text-4xl lg:text-6xl font-heading font-bold text-black mb-6 leading-tight">
                    <span className="block">{image.title}</span>
                  </h1>
                  
                  <p className="text-xl lg:text-2xl text-black mb-8 font-medium">
                    {image.subtitle}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/products" 
                      className="btn-primary px-8 py-4 text-lg font-semibold text-center"
                      data-testid="button-shop-collection"
                    >
                      Shop the Collection
                    </Link>
                    <Link 
                      href="/story" 
                      className="btn-outline px-8 py-4 text-lg font-semibold text-center"
                      data-testid="button-our-story"
                    >
                      Our Story
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Image Content */}
              <div className="relative h-full">
                <LazyImage
                  src={getHeroImage(image.src)}
                  alt={image.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  priority={index === 0} // Priority load first image
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-botanical w-8' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
            data-testid={`button-slide-${index}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Category Preview */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-black mb-4">
              Where are you going today?
            </h2>
            <p className="text-lg text-neutral max-w-2xl mx-auto">
              From the boardroom to the tennis court, our handcrafted bags are designed for every journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Work', image: 'oliveBackpack', link: '/products?category=business' },
              { title: 'Sport', image: 'creamCrossbody', link: '/products?category=sport' }, 
              { title: 'Travel', image: 'brownBackpack', link: '/products?category=travel' },
              { title: 'Leisure', image: 'oliveBackpack', link: '/products?category=leisure' }
            ].map((category, index) => (
              <Link 
                key={category.title}
                href={category.link}
                className="group relative overflow-hidden rounded-xl hover:transform hover:scale-105 transition-all duration-300"
                data-testid={`link-category-${category.title.toLowerCase()}`}
              >
                <div className="aspect-square relative">
                  <LazyImage
                    src={getHeroImage(category.image)}
                    alt={`${category.title} bags`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-heading font-bold text-white mb-2">
                      {category.title}
                    </h3>
                    <span className="text-botanical font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Shop Now →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bag Methodology */}
      <div className="bg-peach-fuzz py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Bag Methodology
            </h2>
            <p className="text-xl text-white/90">Know your bag</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Style',
                description: 'Timeless designs that complement your lifestyle'
              },
              {
                title: 'Functionality', 
                description: 'Thoughtfully designed for your daily needs'
              },
              {
                title: 'Quality',
                description: 'Premium materials and South African craftsmanship'
              }
            ].map((pillar) => (
              <div key={pillar.title} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-white rounded-full" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {pillar.title}
                </h3>
                <p className="text-white/90 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default OptimizedHero;