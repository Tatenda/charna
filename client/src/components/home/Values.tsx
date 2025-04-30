import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const valueItems = [
  {
    icon: "hands",
    title: "Handcrafted Quality",
    description: "Each bag is meticulously crafted by skilled South African artisans, ensuring exceptional quality and attention to detail."
  },
  {
    icon: "leaf",
    title: "Sustainable Practices",
    description: "We source materials responsibly and minimize waste in our production process to reduce our environmental footprint."
  },
  {
    icon: "heart",
    title: "Community Support",
    description: "Every purchase directly supports local artisans and their families, helping to sustain traditional craftsmanship in South Africa."
  }
];

const Values = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary">Our Values</h2>
          <div className="divider mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueItems.map((item, index) => (
            <div key={index} className="text-center p-6 transition-all duration-300 hover:shadow-md rounded-lg">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={item.icon} className="text-primary text-2xl" />
              </div>
              <h3 className="font-accent text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-neutral">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;
