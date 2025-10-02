import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const CartButton = () => {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
  const [open, setOpen] = useState(false);

  const handleCheckout = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="text-primary hover:text-accent transition duration-200 relative">
          <FontAwesomeIcon icon={faShoppingBag} className="text-xl" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl text-primary">Your Cart</SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-auto py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FontAwesomeIcon icon={faShoppingBag} className="text-4xl text-neutral-light mb-4" />
              <p className="text-neutral mb-4">Your cart is empty</p>
              <Button onClick={() => setOpen(false)} className="btn-primary">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <CartItem 
                  key={item.product.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-accent text-neutral">Subtotal</span>
              <span className="font-semibold text-primary">R{cartTotal.toLocaleString()}</span>
            </div>
            <p className="text-sm text-neutral-light mb-4">
              Shipping and taxes calculated at checkout
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button className="btn-secondary" onClick={() => setOpen(false)}>
                Continue Shopping
              </Button>
              <Link href="/checkout" onClick={handleCheckout} className="btn-primary text-center">
                Checkout
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartButton;
