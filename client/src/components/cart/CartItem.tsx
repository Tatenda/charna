import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CartItem as CartItemType } from "@/hooks/useCart";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
}

const CartItem = ({ item, updateQuantity, removeFromCart }: CartItemProps) => {
  const { product, quantity } = item;
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateQuantity(product.id, parseInt(e.target.value));
  };

  const handleRemove = () => {
    removeFromCart(product.id);
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
          >
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
        <p className="text-sm text-neutral-light mb-2">R{product.price.toLocaleString()}</p>
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
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <span className="font-medium text-primary">
            R{(product.price * quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
