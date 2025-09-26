import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [hasEmbossing, setHasEmbossing] = useState(false);
  const [embossingText, setEmbossingText] = useState("");
  
  const embossingPrice = 80; // R80.00 for embossing

  const handleAddToCart = () => {
    const customizations = hasEmbossing ? {
      embossing: true,
      embossingText: embossingText.trim(),
      embossingPrice: embossingPrice
    } : undefined;

    addToCart(product, quantity, customizations);
    
    const totalPrice = product.price + (hasEmbossing ? embossingPrice * 100 : 0); // Convert embossing to cents
    const embossingNote = hasEmbossing ? ` with embossing "${embossingText.trim()}"` : '';
    
    toast({
      title: "Added to Cart",
      description: `${quantity} × ${product.name}${embossingNote} added to your cart. (R${formatPrice(totalPrice)})`,
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleSaveToWishlist = () => {
    toast({
      title: "Saved to Wishlist",
      description: `${product.name} has been saved to your wishlist.`,
    });
  };

  return (
    <div>
      <span className={`inline-block ${product.badge === 'Bestseller' ? 'bg-accent' : 'bg-primary'} text-white text-xs font-accent uppercase tracking-wider px-3 py-1 mb-3 rounded`}>
        {product.badge}
      </span>
      <h1 className="font-heading text-3xl font-semibold text-primary mb-3">{product.name}</h1>
      <div className="flex items-center mb-4">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon 
              key={i} 
              icon={i < Math.floor(product.rating) ? "star" : (i < product.rating ? "star-half-alt" : ["far", "star"])} 
              className="text-yellow-500"
            />
          ))}
        </div>
        <span className="ml-2 text-sm text-neutral-light">
          {product.rating.toFixed(1)} ({product.reviewCount} reviews)
        </span>
      </div>
      <p className="text-neutral mb-6 leading-relaxed">{product.description}</p>
      
      <div className="mb-6">
        <h4 className="font-accent font-semibold mb-2 text-sm uppercase">Features</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <FontAwesomeIcon icon="check" className="text-primary mr-2" /> {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-semibold text-primary">
              R{formatPrice(product.price + (hasEmbossing ? embossingPrice * 100 : 0))}
            </span>
            {hasEmbossing && (
              <span className="block text-sm text-neutral-light mt-1">
                Base price: R{formatPrice(product.price)} + Embossing: R{embossingPrice}.00
              </span>
            )}
            {product.originalPrice && (
              <span className="ml-2 text-neutral-light line-through">
                R{formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <span className={`${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs px-2 py-1 rounded`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-accent font-semibold mb-3 text-sm uppercase">Additional Options</h4>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="embossing"
              checked={hasEmbossing}
              onChange={(e) => {
                setHasEmbossing(e.target.checked);
                if (!e.target.checked) setEmbossingText("");
              }}
              className="mt-1 mr-3 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              data-testid="checkbox-embossing"
            />
            <div className="flex-1">
              <label htmlFor="embossing" className="font-medium text-neutral cursor-pointer">
                Add Custom Embossing (+R{embossingPrice}.00)
              </label>
              <p className="text-sm text-neutral-light mt-1">
                Personalize your package with custom embossing on the leather goods
              </p>
              
              {hasEmbossing && (
                <div className="mt-3 space-y-3">
                  <div>
                    <label htmlFor="embossing-text" className="block text-sm font-medium text-neutral mb-2">
                      Embossing Text (max 10 characters)
                    </label>
                    <input
                      type="text"
                      id="embossing-text"
                      value={embossingText}
                      onChange={(e) => setEmbossingText(e.target.value.slice(0, 10))}
                      placeholder="Enter text to emboss"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      data-testid="input-embossing-text"
                    />
                  </div>
                  
                  {embossingText.trim() && (
                    <div className="bg-amber-50 p-4 rounded-lg border">
                      <p className="text-sm text-neutral-light mb-2">Preview:</p>
                      <div 
                        className="text-2xl font-bold text-amber-900 tracking-wider"
                        style={{ 
                          fontFamily: 'serif',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                          letterSpacing: '2px'
                        }}
                        data-testid="preview-embossing"
                      >
                        {embossingText.trim()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="quantity" className="block text-sm font-medium text-neutral mb-2">
          Quantity
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={handleQuantityChange}
          className="bg-white border border-gray-300 text-neutral rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={!product.inStock}
          data-testid="select-quantity"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button 
          className={`btn-primary flex-1 flex items-center justify-center ${!product.inStock || (hasEmbossing && !embossingText.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleAddToCart}
          disabled={!product.inStock || (hasEmbossing && !embossingText.trim())}
          data-testid="button-add-to-cart"
        >
          <FontAwesomeIcon icon="shopping-bag" className="mr-2" /> 
          Add to Cart {hasEmbossing && embossingText.trim() && `(+R${embossingPrice})`}
        </button>
        <button 
          className="btn-secondary flex items-center justify-center"
          onClick={handleSaveToWishlist}
        >
          <FontAwesomeIcon icon={["far", "heart"]} className="mr-2" /> Save
        </button>
      </div>
      
      <div className="mt-6 text-sm text-neutral-light flex items-center">
        <FontAwesomeIcon icon="truck" className="mr-2" /> Free shipping on orders over R1000
      </div>
    </div>
  );
};

export default ProductDetails;
