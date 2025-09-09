import { useState } from "react";
import { Link, useLocation } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CartButton from "@/components/cart/CartButton";
import charnaLogo from '@assets/image_1757316339645.png';

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
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="lg:hidden mr-4 text-primary"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon="bars" className="text-xl" />
            </button>
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src={charnaLogo} 
                alt="Charna" 
                className="h-12 sm:h-14 lg:h-16 w-auto"
              />
              <span className="text-forest text-lg font-medium">...</span>
            </Link>
          </div>
          <nav className="hidden lg:flex space-x-8 font-medium text-sm">
            <Link 
              href="/" 
              className={`text-forest hover:text-botanical transition duration-200 px-3 py-2 ${isActive('/') ? 'text-botanical font-semibold' : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/browse" 
              className={`text-forest hover:text-botanical transition duration-200 px-3 py-2 ${isActive('/browse') ? 'text-botanical font-semibold' : ''}`}
            >
              Shop
            </Link>
            <Link 
              href="/story" 
              className={`text-forest hover:text-botanical transition duration-200 px-3 py-2 ${isActive('/story') ? 'text-botanical font-semibold' : ''}`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`text-forest hover:text-botanical transition duration-200 px-3 py-2 ${isActive('/contact') ? 'text-botanical font-semibold' : ''}`}
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-6">
            <Link href="/browse" className="text-forest hover:text-botanical transition duration-200">
              <FontAwesomeIcon icon="search" className="text-lg" />
            </Link>
            <CartButton />
            <Link 
              href="/browse"
              className="bg-forest text-white px-6 py-2 font-semibold hover:bg-botanical transition-colors duration-300 hidden lg:block"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`lg:hidden bg-white w-full border-t border-gray-100 shadow-lg ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-4 font-medium">
            <Link
              href="/"
              className={`text-forest hover:text-botanical transition duration-200 py-2 ${isActive('/') ? 'text-botanical font-semibold' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/browse"
              className={`text-forest hover:text-botanical transition duration-200 py-2 ${isActive('/browse') ? 'text-botanical font-semibold' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/story"
              className={`text-forest hover:text-botanical transition duration-200 py-2 ${isActive('/story') ? 'text-botanical font-semibold' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-forest hover:text-botanical transition duration-200 py-2 ${isActive('/contact') ? 'text-botanical font-semibold' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/browse"
              className="bg-forest text-white px-6 py-3 font-semibold hover:bg-botanical transition-colors duration-300 text-center mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop Now
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
