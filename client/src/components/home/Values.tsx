import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const valueItems = [
  {
    icon: "hands",
    title: "Master Craftsmanship",
    description: "Each piece is hand-stitched by master artisans with over 50 years of collective experience, using time-honored techniques passed down through generations.",
    stats: "50+ Years Experience"
  },
  {
    icon: "leaf",
    title: "Premium Materials",
    description: "We source only the finest full-grain leather from ethically raised South African cattle, ensuring durability that lasts decades.",
    stats: "100% Full-Grain Leather"
  },
  {
    icon: "heart",
    title: "Local Impact",
    description: "Every purchase directly empowers local communities, supporting 25+ artisan families and preserving traditional South African leather craft heritage.",
    stats: "25+ Families Supported"
  }
];

const Values = () => {
  return (
    <section className="bg-gradient-to-b from-white to-secondary-light py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
              Our Promise
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            Crafted with Purpose
          </h2>
          <p className="text-xl text-neutral-light max-w-3xl mx-auto leading-relaxed">
            Every bag tells a story of heritage, quality, and commitment to our communities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueItems.map((item, index) => (
            <div key={index} className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-primary/5">
              {/* Background pattern */}
              <div className="absolute inset-0 rounded-2xl opacity-5 bg-gradient-to-br from-primary to-accent"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon icon={item.icon} className="text-white text-2xl" />
                </div>
                
                {/* Stats badge */}
                <div className="text-center mb-4">
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full border border-accent/20">
                    {item.stats}
                  </span>
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="font-heading text-2xl font-bold text-primary mb-4">{item.title}</h3>
                  <p className="text-neutral-light leading-relaxed">{item.description}</p>
                </div>
                
                {/* Decorative element */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call-to-action */}
        <div className="text-center mt-16">
          <div className="inline-block p-8 bg-white rounded-2xl shadow-lg border border-primary/10">
            <h3 className="font-heading text-2xl font-bold text-primary mb-4">
              Experience the Difference
            </h3>
            <p className="text-neutral-light mb-6 max-w-md">
              Join thousands of satisfied customers who trust our commitment to quality and authenticity
            </p>
            <div className="flex justify-center items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-neutral-light">Happy Customers</div>
              </div>
              <div className="w-px h-12 bg-primary/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-neutral-light">Satisfaction Rate</div>
              </div>
              <div className="w-px h-12 bg-primary/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">Lifetime</div>
                <div className="text-sm text-neutral-light">Warranty</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;
