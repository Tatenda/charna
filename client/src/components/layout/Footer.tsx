import { Link, useLocation } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import charnaLogo from '@assets/image_1757323855942.png';
import { WHATSAPP_NUMBER } from '@/lib/constants';

const Footer = () => {
  const [, setLocation] = useLocation();
  
  const handleShopLinkClick = (category: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setLocation(`/browse?category=${category}`);
  };
  return (
    <footer className="bg-white text-gray-800 pt-16 pb-8 relative overflow-hidden border-t border-gray-200">
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <img 
              src={charnaLogo} 
              alt="Charna" 
              className="h-16 w-auto mb-4"
            />
            <p className="text-gray-600 mb-6 leading-relaxed">Premium handcrafted leather goods made in Johannesburg. Excellence in every stitch, quality in every detail.</p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-gray-100 hover:bg-herbal-tonic hover:text-white rounded-lg flex items-center justify-center transition duration-200 text-gray-600"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={['fab', 'facebook-f']} />
              </a>
              <a 
                href="https://www.instagram.com/charna.co?igsh=MXBscWkyNjQybWI2Mw%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-gray-100 hover:bg-herbal-tonic hover:text-white rounded-lg flex items-center justify-center transition duration-200 text-gray-600"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={['fab', 'instagram']} />
              </a>
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-gray-100 hover:bg-herbal-tonic hover:text-white rounded-lg flex items-center justify-center transition duration-200 text-gray-600"
                aria-label="Pinterest"
              >
                <FontAwesomeIcon icon={['fab', 'pinterest-p']} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-black">Shop</h4>
            <ul className="space-y-3">
              <li>
                <a href="/browse?category=work" onClick={handleShopLinkClick('work')} className="text-gray-600 hover:text-black transition duration-200 cursor-pointer">
                  Work Bags
                </a>
              </li>
              <li>
                <a href="/browse?category=leisure" onClick={handleShopLinkClick('leisure')} className="text-gray-600 hover:text-black transition duration-200 cursor-pointer">
                  Leisure Bags
                </a>
              </li>
              <li>
                <a href="/browse?category=sport" onClick={handleShopLinkClick('sport')} className="text-gray-600 hover:text-black transition duration-200 cursor-pointer">
                  Sport Bags
                </a>
              </li>
              <li>
                <a href="/browse?category=travel" onClick={handleShopLinkClick('travel')} className="text-gray-600 hover:text-black transition duration-200 cursor-pointer">
                  Travel Bags
                </a>
              </li>
              <li>
                <a href="/browse?category=accessories" onClick={handleShopLinkClick('accessories')} className="text-gray-600 hover:text-black transition duration-200 cursor-pointer">
                  Accessories
                </a>
              </li>
              <li>
                <a href="/browse?category=onboarding" onClick={handleShopLinkClick('onboarding')} className="text-gray-600 hover:text-black transition duration-200 cursor-pointer">
                  Onboarding
                </a>
              </li>
              <li>
                <a href="/browse?category=gifting" onClick={handleShopLinkClick('gifting')} className="text-gray-600 hover:text-black transition duration-200 cursor-pointer">
                  Gifting
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-black">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/story" className="text-gray-600 hover:text-black transition duration-200">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-black transition duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-gray-600 hover:text-black transition duration-200">
                  Care Guide
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="text-gray-600 hover:text-black transition duration-200">
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4 text-black">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-black transition duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-black transition duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-black transition duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-herbal-tonic transition duration-200 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={['fab', 'whatsapp']} />
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 Charna. All rights reserved. Handcrafted in Johannesburg, South Africa.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
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