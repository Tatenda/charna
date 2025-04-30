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
              Living Green Movement began in 2018 in a small workshop in Cape Town, born from a passion for traditional leather craftsmanship and sustainable practices.
            </p>
            <p className="text-neutral mb-4 leading-relaxed">
              Our founder, a third-generation leather artisan, started with a simple mission: create beautiful, functional bags that celebrate South African craftsmanship while providing sustainable livelihoods for local artisans.
            </p>
            <p className="text-neutral mb-6 leading-relaxed">
              Today, we continue to handcraft each bag with the same dedication to quality and community, combining timeless techniques with modern designs that complement your lifestyle.
            </p>
            <Link href="/story" className="btn-secondary inline-block">
              Learn More
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1531914082256-1b9047242426?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Leather craftsmanship" 
                className="w-full h-64 object-cover" 
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1608731267464-c0c889c2ff92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Workshop" 
                className="w-full h-64 object-cover" 
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg col-span-2">
              <img 
                src="https://images.unsplash.com/photo-1604943087673-1c06c2060de4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="South African landscape" 
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
