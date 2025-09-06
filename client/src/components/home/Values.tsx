import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Values = () => {
  const values = [
    {
      icon: "leaf",
      title: "Premium Materials",
      description: "We source only the finest full-grain leather, ensuring each piece develops a beautiful patina over time while maintaining exceptional durability.",
    },
    {
      icon: "hammer",
      title: "Expert Craftsmanship",
      description: "Every bag is meticulously handcrafted by skilled artisans in our Johannesburg workshop, combining traditional techniques with modern design.",
    },
    {
      icon: "heart",
      title: "Timeless Design",
      description: "Our designs transcend fleeting trends, focusing on classic silhouettes and refined details that complement your professional lifestyle.",
    },
    {
      icon: "globe-africa",
      title: "South African Heritage",
      description: "Proudly made in Johannesburg, our bags represent the finest of South African craftsmanship and attention to detail.",
    },
  ];

  return (
    <section className="section-spacing bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
            Why Choose LGM
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're committed to creating exceptional leather goods that stand the test of time, combining premium materials with expert craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="modern-card p-8 text-center group hover:scale-105 transition-all duration-300"
            >
              <div className="accent-gradient w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon 
                  icon={value.icon as any} 
                  className="text-2xl text-white" 
                />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 mocha-pink-gradient rounded-2xl p-8 md:p-12 text-center product-shadow">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-6">
            Experience the Difference
          </h3>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust LGM for their everyday carry needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-white/80">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">5★</div>
              <div className="text-white/80">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-white/80">Handcrafted</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;