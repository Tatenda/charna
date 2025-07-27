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
              <div className="absolute inset-0 bg-gradient-to-r from-olive-600/60 via-black/40 to-olive-500/50"></div>
            </div>
            
            <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
              <div className="space-y-6">
                <h2 className="text-lg font-semibold tracking-wider text-mustard-dark">
                  {slide.title}
                </h2>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight text-mustard-dark">
                  {slide.subtitle}
                </h1>
                <Link 
                  href="/products"
                  className="inline-block bg-olive-600 text-white px-8 py-3 font-semibold border-2 border-olive-600 hover:bg-transparent hover:text-olive-600 hover:border-olive-400 transition-all duration-300"
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
              className={`w-3 h-3 rounded-full transition-colors border-2 ${
                index === currentSlide 
                  ? 'bg-mustard-dark border-mustard-dark' 
                  : 'bg-transparent border-olive-400 hover:border-mustard-dark'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Category Sections */}
      <section className="py-16 bg-gradient-to-b from-white to-olive-400/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-olive-600 mb-4">Where are you going today?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-olive-600 to-olive-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Link href="/products?category=business" className="text-center group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src="/images/green-backpack.jpg"
                  alt="Work bags"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">WORK</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-olive-600">Work</h3>
            </Link>
            
            <Link href="/products?category=sport" className="text-center group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src="/images/white-tennis-bag.jpg"
                  alt="Sports bags"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-accent/20 group-hover:bg-accent/30 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">SPORTS</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-olive-600">Sports</h3>
            </Link>
            
            <Link href="/products?category=travel" className="text-center group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src="/images/exploring-backpack.jpg"
                  alt="Exploring bags"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-olive-600/20 group-hover:bg-olive-600/30 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">EXPLORING</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-olive-600">Exploring</h3>
            </Link>

            <Link href="/products?category=leisure" className="text-center group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src="/images/white-backpack.jpg"
                  alt="Leisure bags"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-secondary/30 group-hover:bg-secondary/40 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">LEISURE</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-olive-600">Leisure</h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;