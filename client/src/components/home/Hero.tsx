import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="bg-secondary">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-primary leading-tight">
              Made in South Africa, Made with Purpose
            </h1>
            <p className="mt-4 text-lg text-neutral-light leading-relaxed">
              Handcrafted leather bags designed for real life – stylish, practical, and local.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/products" className="btn-primary text-center">
                Shop Collection
              </Link>
              <Link href="/story" className="btn-secondary text-center">
                Our Story
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Handcrafted South African leather bag" 
              className="rounded-lg shadow-lg max-h-[600px] object-cover" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
