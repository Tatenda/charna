import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ShippingReturns() {
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
            Shipping & Returns
          </h1>
          <p className="text-xl text-white/80 mt-4">
            Your luxury purchase, delivered with care
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Shipping Information */}
          <section className="mb-16">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8">Shipping Information</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-secondary-light/20">
                <h3 className="text-xl font-semibold text-primary mb-4">Standard Delivery</h3>
                <p className="text-gray-600 mb-4">5-7 business days</p>
                <p className="text-2xl font-bold text-accent">Free</p>
                <p className="text-sm text-gray-500 mt-2">On orders over R2,000</p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm border border-secondary-light/20">
                <h3 className="text-xl font-semibold text-primary mb-4">Express Delivery</h3>
                <p className="text-gray-600 mb-4">2-3 business days</p>
                <p className="text-2xl font-bold text-accent">R150</p>
                <p className="text-sm text-gray-500 mt-2">Nationwide coverage</p>
              </div>
            </div>

            <div className="mt-8 bg-accent-light/10 p-6 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">International Shipping</h4>
              <p className="text-gray-600">
                We ship worldwide. International delivery times vary by destination (7-21 business days). 
                Customs duties and taxes may apply and are the responsibility of the recipient.
              </p>
            </div>
          </section>

          {/* Returns Policy */}
          <section className="mb-16">
            <h2 className="text-3xl font-heading font-bold text-primary mb-8">Returns Policy</h2>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-secondary-light/20">
              <h3 className="text-xl font-semibold text-primary mb-4">30-Day Return Window</h3>
              <p className="text-gray-600 mb-6">
                We offer a 30-day return period from the date of delivery. Items must be in original condition 
                with all tags attached and packaging intact.
              </p>
              
              <h4 className="font-semibold text-primary mb-3">Return Process:</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Contact our customer service team</li>
                <li>Receive your return authorization and shipping label</li>
                <li>Pack your item securely in original packaging</li>
                <li>Ship using provided return label</li>
                <li>Receive refund within 5-7 business days of receipt</li>
              </ol>
            </div>
          </section>

          {/* Contact for Questions */}
          <section className="bg-primary text-white p-8 rounded-lg text-center">
            <h3 className="text-2xl font-heading font-bold mb-4">Questions?</h3>
            <p className="mb-6">Our customer service team is here to help with any shipping or return inquiries.</p>
            <Link 
              href="/contact" 
              className="inline-block bg-accent hover:bg-accent-light text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
            >
              Contact Us
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}