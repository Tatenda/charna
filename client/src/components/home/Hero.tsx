import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="relative pt-24 min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-tight">
                <span className="block text-[#c7a2a2]">
                  Designed with you
                </span>
                <span className="block accent-gradient bg-clip-text text-transparent">
                  in Mind
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed">
                Premium handcrafted leather goods made in Johannesburg, designed for the modern professional who values quality and style.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/products" className="group accent-gradient text-white px-8 py-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105 product-shadow font-semibold">
                <span className="flex items-center justify-center gap-3">
                  Explore Collection
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link href="/story" className="border-2 border-primary text-primary px-8 py-4 rounded-xl text-center group transition-all duration-300 hover:bg-primary hover:text-white font-semibold">
                Our Story
              </Link>
            </div>
            
            {/* Quality indicators */}
            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">Premium</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Leather</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">Hand</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Crafted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">South</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">African</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative">
              {/* Main product image */}
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
                <img 
                  src="/images/green-backpack-lifestyle.jpg" 
                  alt="LIGREMO Executive Backpack - Premium South African leather luxury" 
                  className="rounded-2xl w-full max-h-[700px] object-cover product-shadow" 
                />
                
                {/* Modern overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent rounded-2xl"></div>
                
                {/* Brand badge */}
                <div className="absolute top-6 left-6 glass-effect px-4 py-2 rounded-full">
                  <span className="text-primary font-bold text-sm">LIGREMO</span>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute -top-4 -left-4 w-full h-full bg-accent/10 rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;