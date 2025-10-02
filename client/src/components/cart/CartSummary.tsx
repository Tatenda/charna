import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
}

const CartSummary = ({ showCheckoutButton = true, onCheckout }: CartSummaryProps) => {
  const { cart, cartTotal } = useCart();
  
  // Check if any item in cart is a test product
  const hasTestProduct = cart.some(item => 
    item.product.badge === "Test" || 
    item.product.name.toLowerCase().includes("test")
  );
  
  const shippingCost = hasTestProduct ? 0 : (cartTotal >= 1000 ? 0 : 150);
  const total = cartTotal + shippingCost;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-heading text-xl font-semibold mb-4 text-primary">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-neutral">Subtotal</span>
          <span className="font-medium">R{cartTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral">Shipping</span>
          <span className="font-medium">
            {shippingCost === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `R${shippingCost.toLocaleString()}`
            )}
          </span>
        </div>
        {cartTotal < 1000 && !hasTestProduct && (
          <div className="text-sm text-neutral-light">
            <FontAwesomeIcon icon="info-circle" className="mr-1" />
            Free shipping on orders over R1000
          </div>
        )}
        {hasTestProduct && (
          <div className="text-sm text-green-600">
            <FontAwesomeIcon icon="check-circle" className="mr-1" />
            Free shipping for test products
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between font-semibold">
          <span className="text-neutral">Total</span>
          <span className="text-primary text-xl">R{total.toLocaleString()}</span>
        </div>
      </div>
      
      {showCheckoutButton && (
        <Button 
          className="btn-primary w-full"
          onClick={handleCheckout}
          disabled={cart.length === 0}
        >
          {cart.length === 0 ? 'Your Cart is Empty' : 'Proceed to Checkout'}
        </Button>
      )}
      
      <div className="mt-4 text-sm text-neutral-light">
        <div className="flex items-center mb-2">
          <FontAwesomeIcon icon="lock" className="mr-2" />
          <span>Secure Checkout</span>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon="truck" className="mr-2" />
          <span>Fast Delivery Within 2-5 Business Days</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
