import { Link } from "wouter";

const Story = () => {
  return (
    <section id="story" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary mb-6">Our Story</h2>
            <div className="divider mb-6"></div>
            <p className="text-neutral mb-4 leading-relaxed">
              Charna began in Johannesburg with a simple vision: to create exceptional leather goods that showcase the incredible skill and artistry of South African craftspeople. Our workshop is where passion meets precision.
            </p>
            <p className="text-neutral mb-4 leading-relaxed">
              Every Charna piece is handcrafted by skilled local artisans who bring years of experience and deep pride in their work. We believe in the power of traditional craftsmanship combined with contemporary design sensibilities.
            </p>
            <p className="text-neutral mb-6 leading-relaxed">
              Made in Johannesburg with pride, our luxury leather goods represent the best of South African manufacturing – where attention to detail, quality materials, and expert craftsmanship come together.
            </p>
            <Link href="/story" className="btn-secondary inline-block">
              Learn More
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/images/tennis-bag-lifestyle.jpg" 
                alt="Premium leather craftsmanship" 
                className="w-full h-64 object-cover" 
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/images/work-backpack-studio.jpg" 
                alt="Artisan workshop" 
                className="w-full h-64 object-cover" 
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg col-span-2">
              <img 
                src="/images/tennis-bag-court.jpg"
                alt="Handcrafted products in action" 
                className="w-full h-48 object-cover" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
