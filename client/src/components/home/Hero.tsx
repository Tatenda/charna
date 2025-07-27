import { Link } from "wouter";
import { useState, useEffect } from "react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "LOOKBOOK",
      subtitle: "For Every Journey",
      image: "/images/backpack-olive.jpg"
    },
    {
      id: 2,
      title: "NEW SEASON",
      subtitle: "PREMIUM COLLECTION",
      image: "/images/crossbody-cream.jpg"
    },
    {
      id: 3,
      title: "NEW ARRIVAL", 
      subtitle: "SHOP THE COLLECTION",
      image: "/images/backpack-brown.jpg"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      {/* Hero Carousel */}
      <section className="relative h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0">
              <img 
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            
            <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
              <div className="space-y-6">
                <h2 className="text-lg font-semibold tracking-wider text-mustard">
                  {slide.title}
                </h2>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight text-mustard">
                  {slide.subtitle}
                </h1>
                <Link 
                  href="/products"
                  className="inline-block bg-white text-primary px-8 py-3 font-semibold hover:bg-accent hover:text-white transition-colors duration-300"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Category Sections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Where are you going today?</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Link href="/products?category=business" className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:z-10 relative">
              <div className="relative overflow-hidden rounded-lg mb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                <img 
                  src="/images/green-backpack.jpg"
                  alt="Work bags"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white transition-all duration-500">
                  <span className="text-2xl font-bold mb-2 group-hover:text-3xl transition-all duration-500">WORK</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-center px-4">
                    <p className="text-sm mb-2">Professional bags for the modern workplace</p>
                    <span className="bg-herbal-tonic text-white px-4 py-2 rounded-full text-xs font-semibold">Shop Now</span>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-olive-600 group-hover:text-herbal-tonic transition-colors duration-300">Work</h3>
            </Link>
            
            <Link href="/products?category=sport" className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:z-10 relative">
              <div className="relative overflow-hidden rounded-lg mb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                <img 
                  src="/images/white-tennis-bag.jpg"
                  alt="Sports bags"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white transition-all duration-500">
                  <span className="text-2xl font-bold mb-2 group-hover:text-3xl transition-all duration-500">SPORTS</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-center px-4">
                    <p className="text-sm mb-2">Athletic gear for your active lifestyle</p>
                    <span className="bg-herbal-tonic text-white px-4 py-2 rounded-full text-xs font-semibold">Shop Now</span>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-olive-600 group-hover:text-herbal-tonic transition-colors duration-300">Sports</h3>
            </Link>
            
            <Link href="/products?category=travel" className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:z-10 relative">
              <div className="relative overflow-hidden rounded-lg mb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                <img 
                  src="/images/exploring-backpack.jpg"
                  alt="Exploring bags"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white transition-all duration-500">
                  <span className="text-2xl font-bold mb-2 group-hover:text-3xl transition-all duration-500">EXPLORING</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-center px-4">
                    <p className="text-sm mb-2">Adventure bags for your journeys</p>
                    <span className="bg-herbal-tonic text-white px-4 py-2 rounded-full text-xs font-semibold">Shop Now</span>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-olive-600 group-hover:text-herbal-tonic transition-colors duration-300">Exploring</h3>
            </Link>

            <Link href="/products?category=leisure" className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:z-10 relative">
              <div className="relative overflow-hidden rounded-lg mb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                <img 
                  src="/images/white-backpack.jpg"
                  alt="Leisure bags"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white transition-all duration-500">
                  <span className="text-2xl font-bold mb-2 group-hover:text-3xl transition-all duration-500">LEISURE</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-center px-4">
                    <p className="text-sm mb-2">Relaxed bags for everyday comfort</p>
                    <span className="bg-herbal-tonic text-white px-4 py-2 rounded-full text-xs font-semibold">Shop Now</span>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-olive-600 group-hover:text-herbal-tonic transition-colors duration-300">Leisure</h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;