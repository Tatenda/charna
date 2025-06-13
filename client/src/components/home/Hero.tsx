import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-secondary-light via-secondary to-secondary-dark overflow-hidden">
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
                <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                  Handcrafted in South Africa
                </span>
              </div>
              
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[0.9] tracking-tight">
                Made with
                <span className="block text-accent italic">Purpose</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-neutral-light leading-relaxed font-light max-w-xl">
                Premium leather bags that tell a story of craftsmanship, sustainability, and South African heritage.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="group btn-primary text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <span className="flex items-center justify-center gap-2">
                  Explore Collection
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link href="/story" className="btn-secondary text-center group transition-all duration-300 hover:bg-primary hover:text-white">
                Our Story
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center gap-8 pt-8 border-t border-primary/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-neutral-light">Genuine Leather</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-neutral-light">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">Local</div>
                <div className="text-sm text-neutral-light">Craftsmanship</div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              {/* Main product image */}
              <div className="relative z-10 transform rotate-2 hover:rotate-0 transition-transform duration-700">
                <img 
                  src="/images/work-backpack-urban.jpg" 
                  alt="Premium handcrafted South African leather bag" 
                  className="rounded-2xl shadow-2xl w-full max-h-[700px] object-cover border-4 border-white/20" 
                />
              </div>
              
              {/* Secondary accent image */}
              <div className="absolute -bottom-8 -left-8 z-0 transform -rotate-6 opacity-70">
                <img 
                  src="/images/tennis-bag-lifestyle.jpg" 
                  alt="Leather craftsmanship detail" 
                  className="rounded-xl shadow-xl w-48 h-64 object-cover border-2 border-white/30" 
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-8 right-8 w-16 h-16 bg-primary/20 rounded-full blur-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;