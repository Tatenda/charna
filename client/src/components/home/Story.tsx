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
              Concetto began in Johannesburg, born from a family dream spanning generations. My father's Italian parents had always envisioned creating a luxury bag business, carrying with them rich traditions of Italian leather craftsmanship.
            </p>
            <p className="text-neutral mb-4 leading-relaxed">
              Though their dream remained unrealized, the vision lived on. Today, we've brought that Italian heritage to life in South Africa, where we handcraft each piece using traditional techniques combined with local artisanal excellence.
            </p>
            <p className="text-neutral mb-6 leading-relaxed">
              Made in Johannesburg with Italian soul, our luxury leather goods honor both family legacy and the exceptional craftsmanship of local artisans who bring these timeless designs to life.
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
