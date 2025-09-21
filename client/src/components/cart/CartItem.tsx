import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CartItem as CartItemType, useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
}

const CartItem = ({ item, updateQuantity, removeFromCart }: CartItemProps) => {
  const { product, quantity, customizations } = item;
  const { addToCart } = useCart();
  const [embossingEnabled, setEmbossingEnabled] = useState(customizations?.embossing || false);
  const [embossingText, setEmbossingText] = useState(customizations?.embossingText || '');
  const [isEditingEmbossing, setIsEditingEmbossing] = useState(false);
  
  const embossingPrice = 80; // Standard embossing price
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateQuantity(product.id, parseInt(e.target.value));
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };
  
  const handleEmbossingToggle = (enabled: boolean) => {
    setEmbossingEnabled(enabled);
    if (!enabled) {
      setEmbossingText('');
      setIsEditingEmbossing(false);
    }
    updateCartItemWithEmbossing(enabled, enabled ? embossingText : '');
  };
  
  const handleEmbossingTextSave = () => {
    updateCartItemWithEmbossing(embossingEnabled, embossingText);
    setIsEditingEmbossing(false);
  };
  
  const updateCartItemWithEmbossing = (embossing: boolean, text: string) => {
    // Remove the current item and add it back with new customizations
    removeFromCart(product.id);
    
    const newCustomizations = {
      ...customizations,
      embossing,
      embossingText: text,
      embossingPrice: embossing ? embossingPrice : 0
    };
    
    addToCart(product, quantity, newCustomizations);
  };

  return (
    <div className="flex items-start border-b pb-4">
      <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="h-full w-full object-cover"
          style={{ imageRendering: 'auto' }}
        />
      </div>
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <h4 className="font-medium text-primary">{product.name}</h4>
          <button 
            className="text-neutral-light hover:text-accent"
            onClick={handleRemove}
            aria-label="Remove item"
            data-testid={`button-remove-${product.id}`}
          >
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
        <div className="text-sm text-neutral-light mb-2">
          <p>R{product.price.toLocaleString()}</p>
          {customizations?.embossing && (
            <p className="text-accent">+ Embossing: R{embossingPrice}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <label htmlFor={`quantity-${product.id}`} className="mr-2 text-sm text-neutral">
              Qty:
            </label>
            <select
              id={`quantity-${product.id}`}
              value={quantity}
              onChange={handleQuantityChange}
              className="bg-white border border-gray-200 text-neutral rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              data-testid={`select-quantity-${product.id}`}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <span className="font-medium text-primary">
            R{((product.price + (customizations?.embossingPrice || 0)) * quantity).toLocaleString()}
          </span>
        </div>
        
        {/* Embossing Options */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              id={`embossing-${product.id}`}
              checked={embossingEnabled}
              onCheckedChange={handleEmbossingToggle}
              data-testid={`checkbox-embossing-${product.id}`}
            />
            <label htmlFor={`embossing-${product.id}`} className="text-sm font-medium">
              Add Embossing (+R{embossingPrice})
            </label>
          </div>
          
          {embossingEnabled && (
            <div className="mt-2 space-y-2">
              {customizations?.embossingText && !isEditingEmbossing ? (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-neutral">Embossing: "{customizations.embossingText}"</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingEmbossing(true)}
                    data-testid={`button-edit-embossing-${product.id}`}
                  >
                    <FontAwesomeIcon icon="edit" className="text-xs" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter embossing text (e.g., initials, name)"
                    value={embossingText}
                    onChange={(e) => setEmbossingText(e.target.value)}
                    maxLength={20}
                    className="text-sm"
                    data-testid={`input-embossing-${product.id}`}
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleEmbossingTextSave}
                      disabled={!embossingText.trim()}
                      data-testid={`button-save-embossing-${product.id}`}
                    >
                      Save
                    </Button>
                    {isEditingEmbossing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditingEmbossing(false);
                          setEmbossingText(customizations?.embossingText || '');
                        }}
                        data-testid={`button-cancel-embossing-${product.id}`}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-neutral-light">Max 20 characters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;