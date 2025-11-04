import Link from "next/link";
import { useLandingPageSection } from "@/hooks/useLandingPageSection";
import { getImagePath } from "@/lib/imageUtils";

const HeroSection = () => {
  const { section: heroSection, loading } = useLandingPageSection('hero');

  // Get dynamic content from database or use defaults
  const heroImage = heroSection?.images?.[0]?.imageUrl || '/image_1757230274214.png';
  const heroTitle = heroSection?.title || 'Handcrafted, beautiful and affordable bags';
  const heroCTA = heroSection?.settings?.ctaText || 'Shop Bags';
  const heroCTALink = heroSection?.settings?.ctaLink || '/browse?category=work';

  if (loading) {
    return (
      <section className="relative min-h-[60vh] sm:min-h-[70vh] md:h-[85vh] flex items-center overflow-hidden pt-16 md:pt-0 bg-gray-900 animate-pulse">
        <div className="container mx-auto px-4 text-center">
          <div className="h-8 w-96 bg-gray-700 rounded mx-auto mb-6"></div>
          <div className="h-12 w-40 bg-gray-700 rounded mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] md:h-[85vh] flex items-center overflow-hidden pt-16 md:pt-0">
      {/* Background Image - FROM DATABASE */}
      <div className="absolute inset-0" style={{
        backgroundImage: `url(${getImagePath(heroImage)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}></div>
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/15"></div>
      
      {/* Navigation Bar - Mobile Responsive */}
      <div className="absolute top-4 md:top-20 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-xs sm:max-w-none px-4 sm:px-0">
        <nav className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-full px-4 sm:px-8 py-3 md:py-4 border border-white/20">
          <div className="flex flex-wrap sm:flex-nowrap justify-center gap-2 sm:gap-4 md:gap-8 text-xs sm:text-sm font-medium">
            <Link href="/browse?category=work" className="text-white hover:text-stone-200 transition-colors duration-200 px-2 sm:px-4 py-2 rounded-full hover:bg-white/10 whitespace-nowrap">
              Work
            </Link>
            <Link href="/browse?category=leisure" className="text-white hover:text-stone-200 transition-colors duration-200 px-2 sm:px-4 py-2 rounded-full hover:bg-white/10 whitespace-nowrap">
              Leisure
            </Link>
            <Link href="/browse?category=sport" className="text-white hover:text-stone-200 transition-colors duration-200 px-2 sm:px-4 py-2 rounded-full hover:bg-white/10 whitespace-nowrap">
              Sport
            </Link>
            <Link href="/browse?category=travel" className="text-white hover:text-stone-200 transition-colors duration-200 px-2 sm:px-4 py-2 rounded-full hover:bg-white/10 whitespace-nowrap">
              Travel
            </Link>
            <Link href="/browse?category=accessories" className="text-white hover:text-stone-200 transition-colors duration-200 px-2 sm:px-4 py-2 rounded-full hover:bg-white/10 whitespace-nowrap">
              Accessories
            </Link>
            <Link href="/browse?category=onboarding" className="text-white hover:text-stone-200 transition-colors duration-200 px-2 sm:px-4 py-2 rounded-full hover:bg-white/10 whitespace-nowrap">
              Onboarding
            </Link>
          </div>
        </nav>
      </div>
      
      {/* Central Content - FROM DATABASE */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-xs sm:max-w-xl md:max-w-4xl mx-auto space-y-6 md:space-y-8 mt-16 sm:mt-20 md:mt-0">
          <p className="text-lg sm:text-xl lg:text-2xl text-stone-200 leading-relaxed max-w-xl md:max-w-2xl mx-auto">
            {heroTitle}
          </p>
          <div className="flex justify-center">
            <Link
              href={heroCTALink}
              className="inline-block bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white px-6 sm:px-10 py-3 md:py-4 text-base md:text-lg font-semibold rounded-md hover:bg-white/15 hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 md:-translate-x-6 min-h-[44px] flex items-center"
              data-testid="button-shop-bags"
            >
              {heroCTA}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

