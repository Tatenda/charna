import { useLandingPageSection } from "@/hooks/useLandingPageSection";
import { getImagePath } from "@/lib/imageUtils";

const InstagramSection = () => {
  const { section: instagramSection, loading } = useLandingPageSection('instagram');

  if (loading) {
    return (
      <section className="py-20" style={{backgroundColor: '#7A8471'}}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-gray-600/30 animate-pulse rounded mx-auto"></div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1 md:gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square overflow-hidden bg-gray-700/50 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!instagramSection || !instagramSection.images || instagramSection.images.length === 0) {
    return null; // Hide section if no data
  }

  return (
    <section className="py-20" style={{backgroundColor: instagramSection.settings?.backgroundColor || '#7A8471'}}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-georgia-bold text-white mb-4">
            {instagramSection.title || 'Charna on the #Gram'}
          </h2>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1 md:gap-2">
          {instagramSection.images.map((image) => (
            <div key={image.id} className="aspect-square overflow-hidden">
              <img 
                src={getImagePath(image.imageUrl)} 
                alt={image.altText} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                style={{ imageRendering: 'auto' }} 
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href={instagramSection.settings?.instagramUrl || "https://www.instagram.com/charna.co"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-black text-white px-8 py-3 font-semibold hover:bg-botanical transition-colors duration-300"
          >
            Follow {instagramSection.settings?.instagramHandle || '@charna.co'}
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;

