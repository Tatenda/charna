import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CartButton from "@/components/cart/CartButton";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white fixed w-full z-50 shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="lg:hidden mr-3 text-primary p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              data-testid="mobile-menu-toggle"
            >
              <FontAwesomeIcon icon="bars" className="text-xl" />
            </button>
            <Link href="/" className="flex items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-georgia-bold text-terracotta">
                Charna.
              </span>
            </Link>
          </div>
          <nav
            className="hidden lg:flex space-x-8 font-medium text-base"
            data-testid="desktop-navigation"
          >
            <Link
              href="/"
              className={`text-forest hover:text-botanical transition duration-200 px-3 py-2 ${isActive("/") ? "text-botanical font-semibold" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/browse"
              className={`text-forest hover:text-botanical transition duration-200 px-3 py-2 ${isActive("/browse") ? "text-botanical font-semibold" : ""}`}
            >
              Shop
            </Link>
            <Link
              href="/story"
              className={`text-forest hover:text-botanical transition duration-200 px-3 py-2 ${isActive("/story") ? "text-botanical font-semibold" : ""}`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-forest hover:text-botanical transition duration-200 px-3 py-2 ${isActive("/contact") ? "text-botanical font-semibold" : ""}`}
            >
              Contact
            </Link>
            {process.env.NODE_ENV === 'development' && (
              <Link
                href="/test-payments"
                className={`text-orange-700 hover:text-orange-800 transition duration-200 px-3 py-2 ${isActive("/test-payments") ? "font-semibold" : ""}`}
                title="Development: Test Payments"
              >
                Test Payments
              </Link>
            )}
          </nav>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/browse"
              className="text-forest hover:text-botanical transition duration-200 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
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
      <div
        className={`lg:hidden bg-white w-full border-t border-gray-100 shadow-lg transition-all duration-300 ${mobileMenuOpen ? "block" : "hidden"}`}
        data-testid="mobile-menu"
      >
        <div className="container mx-auto px-4 py-6">
          <nav className="flex flex-col space-y-2 font-medium">
            <Link
              href="/"
              className={`text-forest hover:text-botanical transition duration-200 py-3 px-2 rounded-lg min-h-[44px] flex items-center ${isActive("/") ? "text-botanical font-semibold bg-botanical/10" : "hover:bg-gray-50"}`}
              onClick={() => setMobileMenuOpen(false)}
              data-testid="mobile-link-home"
            >
              Home
            </Link>
            <Link
              href="/browse"
              className={`text-forest hover:text-botanical transition duration-200 py-3 px-2 rounded-lg min-h-[44px] flex items-center ${isActive("/browse") ? "text-botanical font-semibold bg-botanical/10" : "hover:bg-gray-50"}`}
              onClick={() => setMobileMenuOpen(false)}
              data-testid="mobile-link-browse"
            >
              Shop
            </Link>
            <Link
              href="/story"
              className={`text-forest hover:text-botanical transition duration-200 py-3 px-2 rounded-lg min-h-[44px] flex items-center ${isActive("/story") ? "text-botanical font-semibold bg-botanical/10" : "hover:bg-gray-50"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-forest hover:text-botanical transition duration-200 py-3 px-2 rounded-lg min-h-[44px] flex items-center ${isActive("/contact") ? "text-botanical font-semibold bg-botanical/10" : "hover:bg-gray-50"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {process.env.NODE_ENV === 'development' && (
              <Link
                href="/test-payments"
                className={`text-orange-700 hover:text-orange-800 transition duration-200 py-3 px-2 rounded-lg min-h-[44px] flex items-center ${isActive("/test-payments") ? "font-semibold bg-orange-50" : "hover:bg-orange-50"}`}
                onClick={() => setMobileMenuOpen(false)}
                title="Development: Test Payments"
              >
                Test Payments
              </Link>
            )}
            <Link
              href="/browse"
              className="bg-forest text-white px-6 py-3 font-semibold hover:bg-botanical transition-colors duration-300 text-center mt-6 rounded-lg min-h-[44px] flex items-center justify-center"
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
