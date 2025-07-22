import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-secondary-light via-white to-accent-light/20 overflow-hidden">
      {/* 70's Retro Background Elements */}
      <div className="absolute top-0 left-0 w-full h-24 retro-stripe opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary rounded-full opacity-20 transform translate-x-32 translate-y-32"></div>
      <div className="absolute top-1/2 left-0 w-32 h-32 bg-accent rounded-full opacity-30 transform -translate-x-16"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-6 py-3 bg-primary text-white text-sm font-bold uppercase tracking-wider retro-border transform rotate-1">
                  South African Craftsmanship
                </span>
              </div>
              
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tight">
                <span className="block text-primary bg-secondary px-6 py-3 retro-shadow transform -rotate-1 inline-block mb-4">LIGREMO</span>
                <span className="block text-accent font-accent font-semibold text-3xl md:text-4xl uppercase tracking-wider">70's Luxury</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-neutral-dark leading-relaxed font-medium max-w-xl">
                Groovy leather goods handcrafted in Johannesburg with that authentic 70's vibe for the individual who digs exceptional quality and retro style.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/products" className="group bg-primary text-white px-8 py-4 retro-border text-center transform transition-all duration-300 hover:scale-105 retro-shadow font-bold uppercase tracking-wider">
                <span className="flex items-center justify-center gap-3">
                  Far Out Collection
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link href="/story" className="retro-border bg-accent text-white px-8 py-4 text-center group transition-all duration-300 hover:bg-accent-dark font-bold uppercase tracking-wider">
                Our Groovy Story
              </Link>
            </div>
            
            {/* 70's indicators */}
            <div className="flex items-center gap-8 pt-8 border-t-4 border-primary">
              <div className="text-center bg-secondary px-4 py-2 retro-border transform rotate-1">
                <div className="text-2xl font-bold text-primary">Groovy</div>
                <div className="text-sm text-neutral-dark uppercase tracking-wide">Leather</div>
              </div>
              <div className="text-center bg-accent px-4 py-2 retro-border transform -rotate-1">
                <div className="text-2xl font-bold text-white">Hand</div>
                <div className="text-sm text-white uppercase tracking-wide">Crafted</div>
              </div>
              <div className="text-center bg-primary px-4 py-2 retro-border transform rotate-2">
                <div className="text-2xl font-bold text-white">Retro</div>
                <div className="text-sm text-white uppercase tracking-wide">Vibes</div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              {/* Main product image - Retro styled */}
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
                <img 
                  src="/images/green-backpack-lifestyle.jpg" 
                  alt="LIGREMO Executive Backpack - 70's inspired South African leather luxury" 
                  className="retro-border w-full max-h-[700px] object-cover retro-shadow" 
                />
                
                {/* Retro overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-secondary/20"></div>
                
                {/* Brand logo overlay - 70's style */}
                <div className="absolute bottom-6 left-6 bg-secondary retro-border p-4 transform -rotate-2">
                  <div className="text-primary font-bold text-lg tracking-wider uppercase">LIGREMO</div>
                  <div className="text-neutral-dark text-sm uppercase tracking-wide">Groovy SA Craft</div>
                </div>
              </div>
              
              {/* Secondary accent image - Retro style */}
              <div className="absolute -bottom-6 -right-6 z-0 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/images/tennis-bag-lifestyle.jpg" 
                  alt="LIGREMO retro craftsmanship detail" 
                  className="retro-border w-56 h-72 object-cover" 
                />
                
                {/* Price indicator - 70's style */}
                <div className="absolute top-4 right-4 bg-accent retro-border px-3 py-2 transform rotate-3">
                  <div className="text-white text-sm font-bold uppercase">From R2,799</div>
                </div>
              </div>
              
              {/* Retro decorative elements */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-secondary opacity-40 transform rotate-45"></div>
              <div className="absolute top-1/2 -right-12 w-20 h-20 bg-accent opacity-50 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 w-16 h-16 bg-primary opacity-30 transform rotate-12"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;