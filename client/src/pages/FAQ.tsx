import { ArrowLeft, Plus, Minus } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "What makes Charna leather bags special?",
    answer: "Each Charna bag is handcrafted from the finest full-grain leather using traditional artisan techniques in our Johannesburg workshop. Our leather develops a beautiful patina over time, making each piece unique. We focus on timeless design that transcends trends, ensuring your investment lasts for decades."
  },
  {
    id: 2,
    question: "How long does shipping take?",
    answer: "Standard delivery takes 5-7 business days and is free on orders over R2,000. Express delivery (2-3 business days) is available for R150. International shipping varies by destination (7-21 business days)."
  },
  {
    id: 3,
    question: "What is your return policy?",
    answer: "We offer a 30-day return window from delivery date. Items must be in original condition with tags attached. Contact our customer service team for a return authorization and prepaid shipping label."
  },
  {
    id: 4,
    question: "How should I care for my leather bag?",
    answer: "Use a high-quality leather conditioner every 3-6 months. Avoid prolonged sun exposure and store in the provided dust bag when not in use. For ivory leather, use specialized cleaners and handle with extra care due to the light color."
  },
  {
    id: 5,
    question: "Are your bags suitable for laptops?",
    answer: "Yes! Our Executive Tote accommodates 13\" laptops, while the Compact Backpack fits 13\" devices. Both feature padded compartments to protect your electronics while maintaining the elegant silhouette."
  },
  {
    id: 6,
    question: "Do you offer custom monogramming?",
    answer: "We offer discrete monogramming services for an additional fee. Contact our customer service team to discuss personalization options that maintain the sophisticated aesthetic of your Charna piece."
  },
  {
    id: 7,
    question: "What if my bag needs repair?",
    answer: "We stand behind our craftsmanship. Contact us for any repair needs, and we'll assess whether it's covered under our quality guarantee. We also offer professional restoration services for aging pieces."
  },
  {
    id: 8,
    question: "How do I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email. You can also log into your account to view order status and tracking information."
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

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
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white/80 mt-4">
            Everything you need to know about Charna
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className="bg-white rounded-lg shadow-sm border border-secondary-light/20 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-secondary-light/10 transition duration-200"
                >
                  <h3 className="text-lg font-semibold text-primary pr-4">
                    {faq.question}
                  </h3>
                  {openItems.includes(faq.id) ? (
                    <Minus className="w-5 h-5 text-accent flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-accent flex-shrink-0" />
                  )}
                </button>
                
                {openItems.includes(faq.id) && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still have questions? */}
          <div className="mt-16 bg-primary text-white p-8 rounded-lg text-center">
            <h3 className="text-2xl font-heading font-bold mb-4">Still have questions?</h3>
            <p className="mb-6">Our customer service team is here to help with any inquiries about our luxury leather collection.</p>
            <Link 
              href="/contact" 
              className="inline-block bg-accent hover:bg-accent-light text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}