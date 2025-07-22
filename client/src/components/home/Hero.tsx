import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="relative pt-0 min-h-screen flex items-center overflow-hidden">
      {/* Blurred background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/green-backpack-lifestyle.jpg" 
          alt="Background" 
          className="w-full h-full object-cover blur-lg scale-110" 
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 backdrop-blur-sm bg-white/10 p-8 rounded-2xl border border-white/20">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                <span className="block">
                  Crafted
                </span>
                <span className="block text-yellow-300">
                  Excellence
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed">
                Premium handcrafted leather goods made in Johannesburg, designed for the modern professional who values quality and style.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/products" className="group bg-white text-primary px-8 py-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105 product-shadow font-semibold">
                <span className="flex items-center justify-center gap-3">
                  Explore Collection
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link href="/story" className="border-2 border-white text-white px-8 py-4 rounded-xl text-center group transition-all duration-300 hover:bg-white hover:text-primary font-semibold backdrop-blur-sm">
                Our Story
              </Link>
            </div>
            
            {/* Quality indicators */}
            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Premium</div>
                <div className="text-sm text-white/80 uppercase tracking-wide">Leather</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Hand</div>
                <div className="text-sm text-white/80 uppercase tracking-wide">Crafted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">South</div>
                <div className="text-sm text-white/80 uppercase tracking-wide">African</div>
              </div>
            </div>
          </div>
          
          {/* Focused product image */}
          <div className="relative">
            <div className="relative">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
                <img 
                  src="/images/green-backpack-lifestyle.jpg" 
                  alt="LIGREMO Executive Backpack - Premium South African leather luxury" 
                  className="rounded-2xl w-full max-h-[700px] object-cover product-shadow ring-4 ring-white/30" 
                />
                
                {/* Brand badge */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-primary font-bold text-sm">LIGREMO</span>
                </div>
              </div>
              
              {/* Focused glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-white/20 via-yellow-300/20 to-white/20 rounded-3xl blur-xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;