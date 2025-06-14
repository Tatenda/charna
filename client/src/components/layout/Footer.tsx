import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-heading text-xl font-semibold mb-4">CONCETTO</h4>
            <p className="text-white/70 mb-4">Exquisite Italian leather craftsmanship. Luxury redefined through timeless design.</p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-accent-light transition duration-200"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={['fab', 'facebook-f']} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-accent-light transition duration-200"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={['fab', 'instagram']} />
              </a>
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-accent-light transition duration-200"
                aria-label="Pinterest"
              >
                <FontAwesomeIcon icon={['fab', 'pinterest-p']} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-accent text-sm uppercase tracking-wider font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-white/70 hover:text-white transition duration-200">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=tennis" className="text-white/70 hover:text-white transition duration-200">
                  Tennis Bags
                </Link>
              </li>
              <li>
                <Link href="/products?category=work" className="text-white/70 hover:text-white transition duration-200">
                  Work Bags
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-white/70 hover:text-white transition duration-200">
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-accent text-sm uppercase tracking-wider font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/story" className="text-white/70 hover:text-white transition duration-200">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/story#sustainability" className="text-white/70 hover:text-white transition duration-200">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/story#craftspeople" className="text-white/70 hover:text-white transition duration-200">
                  Craftspeople
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-accent text-sm uppercase tracking-wider font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping-returns" className="text-white/70 hover:text-white transition duration-200">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/70 hover:text-white transition duration-200">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-white/70 hover:text-white transition duration-200">
                  Care Instructions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/70 hover:text-white transition duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-white/50 text-sm">
              © {new Date().getFullYear()} Concetto. All rights reserved.
            </div>
            <div className="text-white/50 text-sm md:text-right">
              <Link href="/terms" className="hover:text-white transition duration-200">Terms & Conditions</Link> | 
              <Link href="/privacy" className="hover:text-white transition duration-200 ml-2">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
