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
      {/* Marketing Banner */}
      <div className="bg-primary text-white py-2 text-center text-sm">
        Save 20% on all premium leather bags this weekend! Free shipping on orders over R1500
      </div>

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
                <h2 className="text-lg font-semibold tracking-wider text-accent">
                  {slide.title}
                </h2>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
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

      {/* Promotional Banners */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Where are you going today?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src="/images/backpack-olive.jpg"
                  alt="30% discount"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">30% OFF</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-olive-600">30% discount</h3>
            </div>
            
            <div className="text-center group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src="/images/crossbody-cream.jpg"
                  alt="free shipping"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-accent/20 group-hover:bg-accent/30 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">FREE SHIP</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-olive-600">free shipping</h3>
            </div>
            
            <div className="text-center group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src="/images/backpack-brown.jpg"
                  alt="special gifts"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-olive-600/20 group-hover:bg-olive-600/30 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">GIFTS</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-olive-600">special gifts</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;