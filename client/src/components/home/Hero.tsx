import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100/30 overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-6 py-3 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900 text-sm font-medium rounded-full border border-amber-200/50 shadow-sm">
                  Italian Craftsmanship
                </span>
              </div>
              
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[0.9] tracking-tight">
                <span className="block">CONCETTO</span>
                <span className="block text-amber-700 italic font-light">Timeless Elegance</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light max-w-xl">
                Luxury leather goods handcrafted from the finest Italian materials for the discerning individual who appreciates exceptional quality.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="group bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-4 rounded-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl font-medium">
                <span className="flex items-center justify-center gap-3">
                  Explore Collection
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link href="/story" className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-lg text-center group transition-all duration-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 font-medium">
                Our Heritage
              </Link>
            </div>
            
            {/* Luxury indicators */}
            <div className="flex items-center gap-8 pt-8 border-t border-slate-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">Italian</div>
                <div className="text-sm text-slate-600">Leather</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">Hand</div>
                <div className="text-sm text-slate-600">Crafted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">Limited</div>
                <div className="text-sm text-slate-600">Edition</div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              {/* Main product image - Forest Green Backpack */}
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
                <img 
                  src="/images/green-backpack-lifestyle.jpg" 
                  alt="Concetto Executive Backpack in Forest Green - Italian leather luxury" 
                  className="rounded-3xl shadow-2xl w-full max-h-[700px] object-cover border border-amber-200/30" 
                />
                
                {/* Luxury overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-3xl"></div>
                
                {/* Brand logo overlay */}
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="text-slate-900 font-bold text-lg tracking-wider">CONCETTO</div>
                  <div className="text-slate-600 text-sm">Italian Craftsmanship</div>
                </div>
              </div>
              
              {/* Secondary accent image - Brand detail */}
              <div className="absolute -bottom-6 -right-6 z-0 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/images/concetto-brand-logo.jpg" 
                  alt="Concetto brand craftsmanship detail" 
                  className="rounded-2xl shadow-xl w-56 h-72 object-cover border-2 border-white/50" 
                />
                
                {/* Price indicator */}
                <div className="absolute top-4 right-4 bg-amber-100/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-md">
                  <div className="text-amber-900 text-sm font-semibold">From R2,799</div>
                </div>
              </div>
              
              {/* Luxury decorative elements */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-amber-300/20 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 -right-12 w-20 h-20 bg-gradient-to-br from-slate-300/20 to-slate-400/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;