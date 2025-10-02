import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@shared/types";

export interface CartItem {
  product: Product;
  quantity: number;
  customizations?: {
    color?: string;
    bagColor?: string;
    sleeveColor?: string;
    embossing?: boolean;
    embossingText?: string;
    embossingPrice?: number;
  };
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity: number, customizations?: CartItem['customizations']) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial load
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      localStorage.removeItem("cart");
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  
  // Calculate total number of items in cart
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate total price of items in cart (including customizations)
  const cartTotal = cart.reduce((sum, item) => {
    const itemPrice = item.product.price + (item.customizations?.embossingPrice || 0);
    return sum + (itemPrice * item.quantity);
  }, 0);
  
  const addToCart = (product: Product, quantity: number, customizations?: CartItem['customizations']) => {
    setCart(prevCart => {
      // For customized items, each customization should be a separate cart item
      if (customizations) {
        // Always add as new item when customizations are involved
        return [...prevCart, { product, quantity, customizations }];
      }
      
      // Check if product already exists in cart (for non-customized items)
      const existingItem = prevCart.find(item => item.product.id === product.id && !item.customizations);
      
      if (existingItem) {
        // Update quantity if product exists
        return prevCart.map(item => 
          item.product.id === product.id && !item.customizations
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item if product doesn't exist
        return [...prevCart, { product, quantity, customizations }];
      }
    });
  };
  
  const updateQuantity = (productId: number, quantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        cartCount, 
        cartTotal, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
