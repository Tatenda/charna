import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <footer className="product-gradient text-white pt-16 pb-8 relative overflow-hidden">
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-heading text-2xl font-bold mb-4">LIGREMO</h4>
            <p className="text-white/80 mb-6 leading-relaxed">Premium handcrafted leather goods made in Johannesburg. Excellence in every stitch, quality in every detail.</p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition duration-200"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={['fab', 'facebook-f']} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition duration-200"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={['fab', 'instagram']} />
              </a>
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition duration-200"
                aria-label="Pinterest"
              >
                <FontAwesomeIcon icon={['fab', 'pinterest-p']} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-white/70 hover:text-white transition duration-200">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=business" className="text-white/70 hover:text-white transition duration-200">
                  Business Bags
                </Link>
              </li>
              <li>
                <Link href="/products?category=travel" className="text-white/70 hover:text-white transition duration-200">
                  Travel Bags
                </Link>
              </li>
              <li>
                <Link href="/products?category=sport" className="text-white/70 hover:text-white transition duration-200">
                  Sport Bags
                </Link>
              </li>
              <li>
                <Link href="/products?category=leisure" className="text-white/70 hover:text-white transition duration-200">
                  Leisure Bags
                </Link>
              </li>
              <li>
                <Link href="/products?category=custom" className="text-white/70 hover:text-white transition duration-200">
                  Custom Bags
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/story" className="text-white/70 hover:text-white transition duration-200">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-white/70 hover:text-white transition duration-200">
                  Care Guide
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="text-white/70 hover:text-white transition duration-200">
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-white/70 hover:text-white transition duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/70 hover:text-white transition duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/70 hover:text-white transition duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a 
                  href="https://wa.me/27123456789" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/70 hover:text-white transition duration-200 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={['fab', 'whatsapp']} />
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              © 2025 LIGREMO. All rights reserved. Handcrafted in Johannesburg, South Africa.
            </p>
            <div className="flex items-center space-x-6 text-sm text-white/60">
              <span>Made with ❤️ in Johannesburg</span>
              <span>Premium Quality Since 2024</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;