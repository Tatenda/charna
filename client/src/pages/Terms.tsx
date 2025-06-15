import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Terms() {
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
            Terms & Conditions
          </h1>
          <p className="text-xl text-white/80 mt-4">
            Terms of service for Concetto luxury leather goods
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-secondary-light/20">
            <p className="text-gray-600 mb-8">
              <strong>Effective Date:</strong> June 14, 2025
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using the Concetto website and purchasing our products, you accept and agree 
                to be bound by these Terms and Conditions. If you do not agree to these terms, please do not 
                use our services.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">Products and Services</h2>
              <p className="text-gray-600 mb-4">
                Concetto offers luxury leather goods crafted from premium Italian leather. All products are 
                handmade and may have slight variations that add to their unique character.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Product descriptions and images are for illustration purposes</li>
                <li>Colors may vary slightly due to monitor settings</li>
                <li>Leather characteristics may vary as each hide is unique</li>
                <li>We reserve the right to modify or discontinue products</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">Pricing and Payment</h2>
              <p className="text-gray-600 mb-4">
                All prices are listed in South African Rand (ZAR) and include applicable taxes unless otherwise stated.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Prices are subject to change without notice</li>
                <li>Payment is required at time of order</li>
                <li>We accept major credit cards and secure payment methods</li>
                <li>Orders are processed upon payment verification</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">Shipping and Delivery</h2>
              <p className="text-gray-600 mb-4">
                We ship worldwide with care and attention to ensure your luxury purchase arrives in perfect condition.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Delivery times are estimates and may vary</li>
                <li>Risk of loss transfers upon delivery to carrier</li>
                <li>International customers are responsible for customs duties</li>
                <li>Shipping costs are calculated at checkout</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">Returns and Exchanges</h2>
              <p className="text-gray-600 mb-4">
                We offer a 30-day return policy for items in original condition.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Items must be unused with original tags and packaging</li>
                <li>Customer is responsible for return shipping costs</li>
                <li>Refunds processed within 5-7 business days</li>
                <li>Personalized items cannot be returned</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">Intellectual Property</h2>
              <p className="text-gray-600">
                All content on this website, including designs, logos, and product images, is the property of 
                Concetto and protected by copyright and trademark laws. Unauthorized use is prohibited.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">Limitation of Liability</h2>
              <p className="text-gray-600">
                Concetto's liability is limited to the purchase price of the product. We are not liable for 
                indirect, incidental, or consequential damages.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">Contact Information</h2>
              <p className="text-gray-600">
                For questions about these Terms and Conditions, please contact us:
              </p>
              <div className="mt-4 p-4 bg-secondary-light/20 rounded">
                <p className="text-gray-600">
                  <strong>Email:</strong> legal@concetto.com<br />
                  <strong>Address:</strong> Concetto Legal Department<br />
                  Johannesburg, South Africa
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}