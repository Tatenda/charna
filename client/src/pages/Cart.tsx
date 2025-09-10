import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [, setLocation] = useLocation();

  // Set page title
  useEffect(() => {
    document.title = "Your Cart | Charna";
  }, []);

  const handleContinueShopping = () => {
    setLocation('/products');
  };

  const handleCheckout = () => {
    setLocation('/checkout');
  };

  return (
    <div className="bg-secondary-light">
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl md:text-4xl font-semibold mb-4">Your Cart</h1>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FontAwesomeIcon icon="shopping-bag" className="text-5xl text-neutral-light mb-4" />
            <h2 className="font-heading text-2xl font-semibold mb-4">Your Cart is Empty</h2>
            <p className="text-neutral-light mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <button 
              onClick={handleContinueShopping}
              className="btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="font-heading text-xl font-semibold">{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</h2>
                  <button 
                    onClick={handleContinueShopping}
                    className="text-primary hover:text-accent text-sm font-accent"
                  >
                    Continue Shopping
                  </button>
                </div>
                
                <div className="divide-y">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-6">
                      <CartItem 
                        item={item}
                        updateQuantity={updateQuantity}
                        removeFromCart={removeFromCart}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Shipping Policy */}
              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h3 className="font-accent text-sm uppercase tracking-wider font-semibold mb-3">Shipping Policy</h3>
                <ul className="space-y-2 text-sm text-neutral">
                  <li className="flex items-start">
                    <FontAwesomeIcon icon="check" className="text-primary mt-1 mr-2" />
                    <span>Free shipping on orders over R1000</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon="check" className="text-primary mt-1 mr-2" />
                    <span>Standard shipping (2-5 business days): R150</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon="check" className="text-primary mt-1 mr-2" />
                    <span>All South African provinces delivered to</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon="check" className="text-primary mt-1 mr-2" />
                    <span>International shipping available upon request</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <CartSummary showCheckoutButton={true} onCheckout={handleCheckout} />

              {/* Secure Checkout */}
              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h3 className="font-accent text-sm uppercase tracking-wider font-semibold mb-3">We Accept</h3>
                <div className="flex flex-wrap gap-4">
                  <FontAwesomeIcon icon={['fab', 'cc-visa']} className="text-2xl text-blue-700" />
                  <FontAwesomeIcon icon={['fab', 'cc-mastercard']} className="text-2xl text-red-600" />
                  <FontAwesomeIcon icon={['fab', 'cc-amex']} className="text-2xl text-blue-500" />
                  <img src="https://www.payfast.co.za/assets/images/logos/payfast-logo.svg" alt="PayFast" className="h-6" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
