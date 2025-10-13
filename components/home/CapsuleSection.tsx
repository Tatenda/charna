import Link from "next/link";
import { useLandingPageSection } from "@/hooks/useLandingPageSection";
import { getImagePath } from "@/lib/imageUtils";

const CapsuleSection = () => {
  const { section: capsuleSection, loading } = useLandingPageSection('capsule');

  if (loading) {
    return (
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <div className="h-10 w-48 bg-gray-200 animate-pulse rounded mx-auto"></div>
          </div>
          <div className="h-[80vh] w-full bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </section>
    );
  }

  if (!capsuleSection || !capsuleSection.images || capsuleSection.images.length === 0) {
    return null; // Hide section if no data
  }

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-georgia-bold text-terracotta mb-4">
            {capsuleSection.title || 'Bag Capsule'}
          </h2>
        </div>
        
        {/* Capsule Options */}
        <div className="flex justify-center gap-6 mb-8 max-w-xl mx-auto">
          {/* Gifting Capsule */}
          <Link href="/browse?category=gifting" className="flex items-center space-x-4 group cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-all duration-300">
            <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center border-2 border-terracotta/20 group-hover:bg-terracotta/20 transition-all duration-300 flex-shrink-0">
              <svg className="w-6 h-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Gifting</h3>
              <p className="text-gray-600 text-sm">Sustainable and timeless gifts</p>
            </div>
          </Link>
          
          {/* Onboarding Capsule */}
          <Link href="/browse?category=onboarding" className="flex items-center space-x-4 group cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-all duration-300">
            <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center border-2 border-terracotta/20 group-hover:bg-terracotta/20 transition-all duration-300 flex-shrink-0">
              <svg className="w-6 h-6 text-terracotta" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                <circle cx="18" cy="8" r="2"/>
                <circle cx="6" cy="8" r="2"/>
                <path d="M18 14c.55 0 1.05.07 1.53.2-.86-.9-2.87-1.2-3.53-1.2v2c.66 0 2 .34 2 2h2c0-1.66-1.34-3-2-3z"/>
                <path d="M6 14c-.55 0-1.05.07-1.53.2.86-.9 2.87-1.2 3.53-1.2v2c-.66 0-2 .34-2 2H4c0-1.66 1.34-3 2-3z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Onboarding</h3>
              <p className="text-gray-600 text-sm">Unforgettable employee experiences</p>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Full Screen Image - FROM DATABASE */}
      <div className="h-[80vh] w-full overflow-hidden">
        {capsuleSection.images[0] ? (
          <img 
            src={getImagePath(capsuleSection.images[0].imageUrl)}
            alt={capsuleSection.images[0].altText}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No capsule image. Add one in admin!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CapsuleSection;

