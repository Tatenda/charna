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
    <header className="bg-white fixed w-full z-50 shadow-sm">
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
            <Link href="/" className="font-heading text-2xl sm:text-3xl text-slate-900 font-bold tracking-wider">
              LIGREMO
            </Link>
          </div>
          <nav className="hidden lg:flex space-x-8 font-medium text-sm uppercase tracking-wider">
            <Link 
              href="/" 
              className={`text-slate-700 hover:text-amber-700 transition duration-200 ${isActive('/') ? 'border-b-2 border-amber-700' : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className={`text-slate-700 hover:text-amber-700 transition duration-200 ${isActive('/products') ? 'border-b-2 border-amber-700' : ''}`}
            >
              Collection
            </Link>
            <Link 
              href="/story" 
              className={`text-slate-700 hover:text-amber-700 transition duration-200 ${isActive('/story') ? 'border-b-2 border-amber-700' : ''}`}
            >
              Heritage
            </Link>
            <Link 
              href="/contact" 
              className={`text-slate-700 hover:text-amber-700 transition duration-200 ${isActive('/contact') ? 'border-b-2 border-amber-700' : ''}`}
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/products" className="text-slate-700 hover:text-amber-700 transition duration-200">
              <FontAwesomeIcon icon="search" className="text-xl" />
            </Link>
            <CartButton />
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`lg:hidden bg-white w-full ${mobileMenuOpen ? 'block' : 'hidden'}`}>
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
