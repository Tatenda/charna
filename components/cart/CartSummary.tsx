import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faLock, faTruck } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PromoCodeInput from "./PromoCodeInput";

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
  customerEmail?: string;
  onPromoChange?: (promoData: { code: string; discount: number; promoCodeId?: number } | null) => void;
}

const CartSummary = ({ showCheckoutButton = true, onCheckout, customerEmail, onPromoChange }: CartSummaryProps) => {
  const { cart, cartTotal } = useCart();
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | undefined>();
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoCodeId, setPromoCodeId] = useState<number | undefined>();
  
  // Check if cart contains any test products
  const hasTestProduct = cart.some(item => 
    item.product.id === 9 || item.product.name === "Test Bag"
  );
  
  // No shipping cost for test products, otherwise apply normal logic
  const shippingCost = hasTestProduct ? 0 : (cartTotal >= 1000 ? 0 : 150);
  const discountedSubtotal = cartTotal - appliedDiscount;
  // Product prices already include VAT. Calculate final total
  const finalTotal = discountedSubtotal + shippingCost;
  // Extract VAT from the final total for display purposes
  // VAT = Total × (0.15 / 1.15) = Total × 0.130434...
  const vatRate = 0.15;
  const vatAmount = finalTotal * (vatRate / (1 + vatRate));
  const total = finalTotal; // Total already includes VAT

  const handlePromoApplied = (code: string, discount: number, id?: number) => {
    setAppliedPromoCode(code);
    setAppliedDiscount(discount);
    setPromoCodeId(id);
    
    // Store in localStorage for checkout persistence
    localStorage.setItem('appliedPromoCode', JSON.stringify({
      code,
      discount,
      promoCodeId: id
    }));

    // Notify parent component
    if (onPromoChange) {
      onPromoChange({ code, discount, promoCodeId: id });
    }
  };

  const handlePromoRemoved = () => {
    setAppliedPromoCode(undefined);
    setAppliedDiscount(0);
    setPromoCodeId(undefined);
    
    // Clear from localStorage
    localStorage.removeItem('appliedPromoCode');

    // Notify parent component
    if (onPromoChange) {
      onPromoChange(null);
    }
  };

  // Load promo code from localStorage on mount and re-validate
  useEffect(() => {
    const savedPromo = localStorage.getItem('appliedPromoCode');
    if (savedPromo) {
      try {
        const { code, discount, promoCodeId: id } = JSON.parse(savedPromo);
        
        // Re-validate the promo code with current cart total
        const validateStoredPromo = async () => {
          try {
            const response = await fetch('/api/promo-codes/validate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                code,
                orderTotal: cartTotal,
                customerEmail: customerEmail
              })
            });

            if (response.ok) {
              const data = await response.json();
              // Update with fresh validation data
              setAppliedPromoCode(code);
              setAppliedDiscount(data.discount);
              setPromoCodeId(id);
              
              if (onPromoChange) {
                onPromoChange({ code, discount: data.discount, promoCodeId: id });
              }
            } else {
              // Promo code is no longer valid, clear it
              console.log('Stored promo code is no longer valid, clearing...');
              handlePromoRemoved();
            }
          } catch (error) {
            console.error('Error re-validating saved promo code:', error);
            handlePromoRemoved();
          }
        };

        validateStoredPromo();
      } catch (error) {
        console.error('Error loading saved promo code:', error);
        localStorage.removeItem('appliedPromoCode');
      }
    }
  }, []);

  // If cart total changes and is below minimum, remove promo
  // Also clear promo if cart is empty
  useEffect(() => {
    if (cart.length === 0 && appliedPromoCode) {
      // Cart is empty, clear promo code
      handlePromoRemoved();
    } else if (appliedPromoCode && appliedDiscount > cartTotal) {
      // Cart total is less than discount, invalid promo
      handlePromoRemoved();
    }
  }, [cartTotal, cart.length]);

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-heading text-xl font-semibold mb-4 text-primary">Order Summary</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-neutral">Subtotal (incl. VAT)</span>
          <span className="font-medium">R{cartTotal.toLocaleString()}</span>
        </div>
        
        {appliedDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="font-medium">
              <FontAwesomeIcon icon="tag" className="mr-2" />
              Discount ({appliedPromoCode})
            </span>
            <span className="font-medium">-R{appliedDiscount.toFixed(2)}</span>
          </div>
        )}
        
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
        {cartTotal < 1000 && (
          <div className="text-sm text-neutral-light">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
            Free shipping on orders over R1000
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-200">
          <div className="flex justify-between text-xs text-neutral-light">
            <span className="italic">VAT (15%): R{vatAmount.toFixed(2)} (included above)</span>
          </div>
        </div>
      </div>

      {/* Promo Code Input */}
      <div className="mb-4">
        <PromoCodeInput
          orderTotal={cartTotal}
          customerEmail={customerEmail}
          onPromoApplied={handlePromoApplied}
          onPromoRemoved={handlePromoRemoved}
          appliedPromoCode={appliedPromoCode}
          appliedDiscount={appliedDiscount}
        />
      </div>
      
      <Separator className="my-4" />
      
      <div className="mb-6">
        <div className="flex justify-between font-semibold">
          <span className="text-neutral">Total</span>
          <span className="text-primary text-xl">R{total.toFixed(2)}</span>
        </div>
        {appliedDiscount > 0 && (
          <p className="text-sm text-green-600 text-right mt-1">
            You saved R{appliedDiscount.toFixed(2)}!
          </p>
        )}
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
          <FontAwesomeIcon icon={faLock} className="mr-2" />
          <span>Secure Checkout</span>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faTruck} className="mr-2" />
          <span>Fast Delivery Within 2-5 Business Days</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
