import { ArrowLeft, Droplets, Sun, Shield, Heart } from "lucide-react";
import { Link } from "wouter";

const careSteps = [
  {
    icon: <Droplets className="w-8 h-8 text-accent" />,
    title: "Regular Conditioning",
    description: "Apply high-quality leather conditioner every 3-6 months to maintain suppleness and prevent cracking.",
    details: [
      "Use only premium leather conditioners",
      "Test on a small, hidden area first",
      "Apply with a soft, clean cloth in circular motions",
      "Allow to absorb completely before use"
    ]
  },
  {
    icon: <Sun className="w-8 h-8 text-accent" />,
    title: "Protect from Elements",
    description: "Shield your LGM bag from direct sunlight, heat, and moisture to preserve its beauty.",
    details: [
      "Avoid prolonged sun exposure",
      "Keep away from heat sources",
      "If wet, pat dry immediately with soft cloth",
      "Allow to air dry naturally, never use heat"
    ]
  },
  {
    icon: <Shield className="w-8 h-8 text-accent" />,
    title: "Proper Storage",
    description: "Store your bag correctly to maintain its shape and prevent damage when not in use.",
    details: [
      "Use the provided dust bag for storage",
      "Stuff with tissue paper to maintain shape",
      "Store in cool, dry place with good ventilation",
      "Avoid plastic bags which can cause moisture buildup"
    ]
  },
  {
    icon: <Heart className="w-8 h-8 text-accent" />,
    title: "Gentle Handling",
    description: "Handle your luxury piece with care to ensure it ages beautifully over decades.",
    details: [
      "Avoid overstuffing to prevent stretching",
      "Handle by the handles or straps, not the body",
      "Keep sharp objects in separate compartments",
      "Clean hands before handling light-colored leather"
    ]
  }
];

const specificCare = [
  {
    product: "Ivory Leather",
    tips: [
      "Use specialized ivory leather cleaner only",
      "Handle with clean hands to prevent staining",
      "Professional cleaning recommended every 6 months",
      "Store away from colored items to prevent transfer"
    ]
  },
  {
    product: "Cognac Leather",
    tips: [
      "Will develop beautiful patina over time",
      "Regular conditioning enhances the rich color",
      "Minor scuffs often buff out naturally with use",
      "Embrace the character that develops with age"
    ]
  }
];

export default function Care() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-light to-white">
      {/* Header */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-accent-light hover:text-white mb-6 transition duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-heading font-bold">
            Care Instructions
          </h1>
          <p className="text-xl text-white/80 mt-4">
            Preserve the beauty of your LGM leather for generations
          </p>
        </div>
      </div>

      {/* Care Steps */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-primary text-center mb-12">
            Essential Care Steps
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {careSteps.map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-secondary-light/20">
                <div className="flex items-center mb-4">
                  {step.icon}
                  <h3 className="text-xl font-semibold text-primary ml-3">{step.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="text-sm text-gray-500 flex items-start">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Specific Care by Product */}
          <div className="mb-16">
            <h2 className="text-3xl font-heading font-bold text-primary text-center mb-12">
              Product-Specific Care
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {specificCare.map((care, index) => (
                <div key={index} className="bg-accent-light/10 p-8 rounded-lg">
                  <h3 className="text-xl font-semibold text-primary mb-4">{care.product}</h3>
                  <ul className="space-y-3">
                    {care.tips.map((tip, idx) => (
                      <li key={idx} className="text-gray-600 flex items-start">
                        <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Services */}
          <div className="bg-primary text-white p-8 rounded-lg text-center">
            <h3 className="text-2xl font-heading font-bold mb-4">Professional Care Services</h3>
            <p className="mb-6 max-w-2xl mx-auto">
              For deep cleaning, restoration, or repairs, our network of certified leather artisans 
              can help maintain your LGM piece to the highest standards.
            </p>
            <Link 
              href="/contact" 
              className="inline-block bg-accent hover:bg-accent-light text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
            >
              Contact for Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}