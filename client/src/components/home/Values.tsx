import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHands, faGem, faCrown } from "@fortawesome/free-solid-svg-icons";

const valueItems = [
  {
    icon: faHands,
    title: "Groovy SA Craftsmanship",
    description: "Each LIGREMO piece is lovingly handcrafted by rad artisans in Johannesburg, using far-out traditional techniques with a 70's twist that's totally righteous.",
    stats: "Local Vibes"
  },
  {
    icon: faGem,
    title: "Far Out Materials",
    description: "We dig the most righteous full-grain leather, hand-picked for its exceptional groovy quality that gets more beautiful with every adventure.",
    stats: "Premium Leather"
  },
  {
    icon: faCrown,
    title: "Retro Groove Design",
    description: "Every LIGREMO creation is a perfect blend of 70's cool and modern funk, designed for the individual who digs authentic style with soul.",
    stats: "Retro Luxury"
  }
];

const Values = () => {
  return (
    <section className="bg-gradient-to-b from-secondary-light to-accent-light/30 py-20 relative overflow-hidden">
      {/* 70's Background Elements */}
      <div className="absolute top-0 right-0 w-full h-16 retro-stripe opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary opacity-10 transform rotate-45 -translate-x-32 translate-y-32"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-6 py-3 bg-primary text-white text-sm font-bold uppercase tracking-wider retro-border transform rotate-1">
              Groovy Excellence
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6 retro-shadow bg-secondary px-8 py-4 inline-block transform -rotate-1">
            70's SA Excellence
          </h2>
          <p className="text-xl text-neutral-dark max-w-3xl mx-auto leading-relaxed font-medium">
            Every LIGREMO piece embodies the grooviest South African craftsmanship, far-out materials, and totally righteous commitment to retro luxury
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueItems.map((item, index) => (
            <div key={index} className="group relative bg-white retro-border p-8 retro-shadow hover:scale-105 transition-all duration-500 transform hover:rotate-1">
              {/* 70's Background pattern */}
              <div className="absolute inset-0 opacity-10 retro-stripe"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-20 h-20 bg-secondary retro-border flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 transform rotate-3">
                  <FontAwesomeIcon icon={item.icon} className="text-primary text-2xl" />
                </div>
                
                {/* Stats badge */}
                <div className="text-center mb-4">
                  <span className="inline-block px-3 py-1 bg-accent text-white text-sm font-bold uppercase tracking-wider retro-border transform -rotate-1">
                    {item.stats}
                  </span>
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="font-heading text-2xl font-bold text-primary mb-4">{item.title}</h3>
                  <p className="text-neutral-dark leading-relaxed font-medium">{item.description}</p>
                </div>
                
                {/* Decorative element */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-secondary transform rotate-45 opacity-80"></div>
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
