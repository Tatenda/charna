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
    <header className="bg-secondary fixed w-full z-50 retro-border border-b-4 border-primary shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="lg:hidden mr-4 text-primary"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon="bars" className="text-xl" />
            </button>
            <Link href="/" className="font-heading text-2xl sm:text-3xl text-primary font-bold tracking-wider bg-white px-4 py-2 retro-border transform -rotate-1">
              LIGREMO
            </Link>
          </div>
          <nav className="hidden lg:flex space-x-6 font-bold text-sm uppercase tracking-wider">
            <Link 
              href="/" 
              className={`text-primary hover:text-accent transition duration-200 px-3 py-2 ${isActive('/') ? 'bg-accent text-white retro-border' : 'hover:bg-white hover:retro-border'}`}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className={`text-primary hover:text-accent transition duration-200 px-3 py-2 ${isActive('/products') ? 'bg-accent text-white retro-border' : 'hover:bg-white hover:retro-border'}`}
            >
              Groovy Gear
            </Link>
            <Link 
              href="/story" 
              className={`text-primary hover:text-accent transition duration-200 px-3 py-2 ${isActive('/story') ? 'bg-accent text-white retro-border' : 'hover:bg-white hover:retro-border'}`}
            >
              Our Vibe
            </Link>
            <Link 
              href="/contact" 
              className={`text-primary hover:text-accent transition duration-200 px-3 py-2 ${isActive('/contact') ? 'bg-accent text-white retro-border' : 'hover:bg-white hover:retro-border'}`}
            >
              Get In Touch
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/products" className="text-primary hover:text-accent transition duration-200 bg-white px-3 py-2 retro-border">
              <FontAwesomeIcon icon="search" className="text-lg" />
            </Link>
            <CartButton />
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`lg:hidden bg-secondary w-full retro-border border-t-4 border-primary ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col space-y-3 font-accent text-sm uppercase tracking-wider">
            <Link
              href="/"
              className={`hover:text-accent transition duration-200 py-2 border-b border-gray-100 ${isActive('/') ? 'text-accent' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`hover:text-accent transition duration-200 py-2 border-b border-gray-100 ${isActive('/products') ? 'text-accent' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/story"
              className={`hover:text-accent transition duration-200 py-2 border-b border-gray-100 ${isActive('/story') ? 'text-accent' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Our Story
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
