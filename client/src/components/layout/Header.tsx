import { useState } from "react";
import { Link, useLocation } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CartButton from "@/components/cart/CartButton";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white fixed w-full z-50 shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="lg:hidden mr-4 text-primary"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon="bars" className="text-xl" />
            </button>
            <Link href="/" className="font-heading text-2xl sm:text-3xl text-primary font-bold tracking-wide">
              LIGREMO
            </Link>
          </div>
          <nav className="hidden lg:flex space-x-8 font-medium text-sm">
            <Link 
              href="/" 
              className={`text-primary hover:text-accent transition duration-200 px-3 py-2 rounded-lg ${isActive('/') ? 'bg-accent text-white' : 'hover:bg-gray-50'}`}
            >
              Home
            </Link>
            <Link 
              href="/products?category=business" 
              className={`text-primary hover:text-accent transition duration-200 px-3 py-2 rounded-lg ${isActive('/products') ? 'bg-accent text-white' : 'hover:bg-gray-50'}`}
            >
              Business
            </Link>
            <Link 
              href="/products?category=travel" 
              className={`text-primary hover:text-accent transition duration-200 px-3 py-2 rounded-lg hover:bg-gray-50`}
            >
              Travel
            </Link>
            <Link 
              href="/products?category=sport" 
              className={`text-primary hover:text-accent transition duration-200 px-3 py-2 rounded-lg hover:bg-gray-50`}
            >
              Sport
            </Link>
            <Link 
              href="/products?category=leisure" 
              className={`text-primary hover:text-accent transition duration-200 px-3 py-2 rounded-lg hover:bg-gray-50`}
            >
              Leisure
            </Link>
            <Link 
              href="/products?category=custom" 
              className={`text-primary hover:text-accent transition duration-200 px-3 py-2 rounded-lg hover:bg-gray-50`}
            >
              Custom
            </Link>
            <Link 
              href="/story" 
              className={`text-primary hover:text-accent transition duration-200 px-3 py-2 rounded-lg ${isActive('/story') ? 'bg-accent text-white' : 'hover:bg-gray-50'}`}
            >
              Our Story
            </Link>
            <Link 
              href="/contact" 
              className={`text-primary hover:text-accent transition duration-200 px-3 py-2 rounded-lg ${isActive('/contact') ? 'bg-accent text-white' : 'hover:bg-gray-50'}`}
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/products" className="text-primary hover:text-accent transition duration-200 p-2 rounded-lg hover:bg-gray-50">
              <FontAwesomeIcon icon="search" className="text-lg" />
            </Link>
            <CartButton />
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`lg:hidden bg-white w-full border-t border-gray-100 shadow-lg ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-3 font-medium text-sm">
            <Link
              href="/"
              className={`hover:text-accent transition duration-200 py-3 px-2 rounded-lg ${isActive('/') ? 'text-accent bg-gray-50' : 'hover:bg-gray-50'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products?category=business"
              className={`hover:text-accent transition duration-200 py-3 px-2 rounded-lg ${isActive('/products') ? 'text-accent bg-gray-50' : 'hover:bg-gray-50'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Business Bags
            </Link>
            <Link
              href="/products?category=travel"
              className={`hover:text-accent transition duration-200 py-2 border-b border-primary/20`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Travel Bags
            </Link>
            <Link
              href="/products?category=sport"
              className={`hover:text-accent transition duration-200 py-2 border-b border-primary/20`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Sport Bags
            </Link>
            <Link
              href="/products?category=leisure"
              className={`hover:text-accent transition duration-200 py-2 border-b border-primary/20`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Leisure Bags
            </Link>
            <Link
              href="/products?category=custom"
              className={`hover:text-accent transition duration-200 py-2 border-b border-primary/20`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Custom Bags
            </Link>
            <Link
              href="/story"
              className={`hover:text-accent transition duration-200 py-2 border-b border-primary/20 ${isActive('/story') ? 'text-accent' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Our Vibe
            </Link>
            <Link
              href="/contact"
              className={`hover:text-accent transition duration-200 py-2 ${isActive('/contact') ? 'text-accent' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
