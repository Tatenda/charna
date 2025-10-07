import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Product } from "@shared/types";
import { getImagePath } from "@/lib/imageUtils";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Use variant pricing if available, otherwise fall back to product pricing
  const currentPrice = product.variants && product.variants.length > 0 
    ? product.variants[0].price 
    : product.price;
  const originalPrice = product.variants && product.variants.length > 0 
    ? product.variants[0].originalPrice 
    : product.originalPrice;
    
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/browse?category=${product.category}`}>
        <div className="relative">
          <img 
            src={getImagePath(
              product.variants && product.variants.length > 0 && product.variants[0].images.length > 0 
                ? product.variants[0].images[0] 
                : product.images && product.images.length > 0 
                  ? product.images[0] 
                  : ''
            )} 
            alt={product.name} 
            className="w-full h-64 object-cover"
            style={{ imageRendering: 'auto' }}
          />
          {product.badge && (
            <span className="absolute top-4 left-4 inline-block bg-accent text-white text-xs font-accent uppercase tracking-wider px-3 py-1 rounded">
              {product.badge}
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="absolute top-4 right-4 inline-block bg-green-600 text-white text-xs font-accent uppercase tracking-wider px-3 py-1 rounded">
              {discountPercentage}% Off
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-heading text-xl font-semibold mb-2 text-primary">{product.name}</h3>
          <div className="flex items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon 
                  key={i} 
                  icon={i < Math.floor(product.rating) ? "star" : (i < product.rating ? "star-half-alt" : ["far", "star"])} 
                  className="text-yellow-500 text-sm"
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-neutral-light">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>
          <p className="text-sm text-neutral mb-4 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold text-primary">R{currentPrice.toLocaleString()}</span>
              {originalPrice && originalPrice > currentPrice && (
                <span className="ml-2 text-sm text-neutral-light line-through">
                  R{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              {(product.variants && product.variants.length > 0 ? product.variants[0].inStock : product.inStock) ? "In Stock" : "Out of Stock"}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
