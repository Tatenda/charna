import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Privacy() {
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
            Privacy Policy
          </h1>
          <p className="text-xl text-white/80 mt-4">
            Your privacy is our priority
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-secondary-light/20">
            <p className="text-gray-600 mb-8">
              <strong>Effective Date:</strong> June 14, 2025
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                make a purchase, or contact us for support.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Personal information (name, email, phone number)</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely by our payment partners)</li>
                <li>Communication preferences</li>
                <li>Product reviews and feedback</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect to provide, maintain, and improve our services:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Provide customer service and support</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Communicate about products, services, and promotions</li>
                <li>Improve our website and customer experience</li>
                <li>Prevent fraud and enhance security</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                information only in these limited circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>With service providers who help us operate our business</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. This includes 
                encryption of sensitive data and regular security assessments.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">Cookies</h2>
              <p className="text-gray-600">
                We use cookies and similar technologies to enhance your browsing experience, analyze website 
                traffic, and personalize content. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-4 p-4 bg-secondary-light/20 rounded">
                <p className="text-gray-600">
                  <strong>Email:</strong> privacy@concetto.com<br />
                  <strong>Address:</strong> Concetto Privacy Office<br />
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