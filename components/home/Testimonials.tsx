import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";

const testimonials = [
  {
    rating: 5,
    text: "I absolutely love my tennis bag! The quality is exceptional, and it perfectly blends style with functionality. I get compliments everywhere I go.",
    name: "Lisa M.",
    location: "Cape Town",
    initial: "L"
  },
  {
    rating: 5,
    text: "The work backpack is sleek, professional, and incredibly well-made. It's comfortable to carry all day and has completely replaced my briefcase.",
    name: "Thabo K.",
    location: "Johannesburg",
    initial: "T"
  },
  {
    rating: 4.5,
    text: "I bought the tennis bag as a gift for my wife and she couldn't be happier. The craftsmanship is outstanding and supporting local artisans makes it even better.",
    name: "James B.",
    location: "Durban",
    initial: "J"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary">What Our Customers Say</h2>
          <div className="divider mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500" />
                ))}
                {testimonial.rating % 1 === 0.5 && (
                  <FontAwesomeIcon icon={faStarHalfAlt} className="text-yellow-500" />
                )}
              </div>
              <p className="text-neutral italic mb-4">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.initial}
                </div>
                <div className="ml-3">
                  <h4 className="font-accent font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-neutral-light">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
