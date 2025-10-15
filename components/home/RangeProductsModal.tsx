import { useState, useEffect } from 'react';
import { Product } from '@shared/types';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { getImagePath } from '@/lib/imageUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface RangeProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  rangeName: string;
}

interface VariantWithProduct {
  id: number;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  images: string[];
  productId: number;
  productName: string;
  productDescription: string;
}

export const RangeProductsModal = ({ isOpen, onClose, category, rangeName }: RangeProductsModalProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<Record<number, number>>({});
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && category) {
      fetchProducts();
    }
  }, [isOpen, category]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch products by category (includes child categories automatically)
      const response = await fetch(`/api/products/category/${category}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const filteredProducts: Product[] = await response.json();
      
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Extract all variants from products
  const getAllVariants = (): VariantWithProduct[] => {
    const variants: VariantWithProduct[] = [];
    
    products.forEach((product) => {
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant) => {
          variants.push({
            ...variant,
            productId: product.id,
            productName: product.name,
            productDescription: product.description,
          });
        });
      }
    });
    
    return variants;
  };

  const handleQuantityChange = (variantId: number, change: number) => {
    setSelectedVariants((prev) => {
      const currentQty = prev[variantId] || 0;
      const newQty = Math.max(0, Math.min(10, currentQty + change));
      
      if (newQty === 0) {
        const { [variantId]: _, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [variantId]: newQty };
    });
  };

  const handleAddToCart = (variant: VariantWithProduct) => {
    const quantity = selectedVariants[variant.id] || 1;
    
    // Create a product object from the variant
    const productToAdd: Product = {
      id: variant.productId,
      name: `${variant.productName} - ${variant.name}`,
      description: variant.productDescription,
      longDescription: variant.productDescription,
      price: variant.price,
      originalPrice: variant.originalPrice,
      rating: 5,
      reviewCount: 0,
      inStock: variant.inStock,
      category: category,
      colors: [],
      features: [],
      images: variant.images,
      materials: '',
      dimensions: '',
      careInstructions: '',
      featured: false,
      createdAt: new Date(),
    };
    
    addToCart(productToAdd, quantity);
    
    toast({
      title: 'Added to Cart',
      description: `${quantity} × ${variant.productName} - ${variant.name} added to your cart`,
    });
    
    // Reset quantity for this variant
    setSelectedVariants((prev) => {
      const { [variant.id]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleAddAllToCart = () => {
    const variants = getAllVariants();
    let itemsAdded = 0;
    
    Object.entries(selectedVariants).forEach(([variantIdStr, quantity]) => {
      const variantId = parseInt(variantIdStr);
      const variant = variants.find((v) => v.id === variantId);
      
      if (variant && quantity > 0) {
        const productToAdd: Product = {
          id: variant.productId,
          name: `${variant.productName} - ${variant.name}`,
          description: variant.productDescription,
          longDescription: variant.productDescription,
          price: variant.price,
          originalPrice: variant.originalPrice,
          rating: 5,
          reviewCount: 0,
          inStock: variant.inStock,
          category: category,
          colors: [],
          features: [],
          images: variant.images,
          materials: '',
          dimensions: '',
          careInstructions: '',
          featured: false,
          createdAt: new Date(),
        };
        
        addToCart(productToAdd, quantity);
        itemsAdded++;
      }
    });
    
    if (itemsAdded > 0) {
      toast({
        title: 'Added to Cart',
        description: `${itemsAdded} item${itemsAdded > 1 ? 's' : ''} added to your cart`,
      });
      
      setSelectedVariants({});
      onClose();
    }
  };

  const variants = getAllVariants();
  const totalSelectedItems = Object.values(selectedVariants).reduce((sum, qty) => sum + qty, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-georgia-bold text-botanical">
            {rangeName}
          </DialogTitle>
          <DialogDescription>
            Select variants to add to your cart
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 animate-pulse rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
                      <div className="h-3 bg-gray-200 animate-pulse rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : variants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No products available in this range
            </div>
          ) : (
            <div className="space-y-4">
              {variants.map((variant) => {
                const quantity = selectedVariants[variant.id] || 0;
                const mainImage = variant.images[0] || '';
                
                return (
                  <div
                    key={variant.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={getImagePath(mainImage)}
                          alt={variant.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-botanical">
                          {variant.productName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{variant.name}</p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-lg">
                            R{variant.price.toLocaleString()}
                          </span>
                          {variant.originalPrice && variant.originalPrice !== variant.price && (
                            <span className="text-sm text-gray-500 line-through">
                              R{variant.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              variant.inStock
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {variant.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(variant.id, -1)}
                            disabled={!variant.inStock || quantity === 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="w-8 text-center font-semibold">
                            {quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(variant.id, 1)}
                            disabled={!variant.inStock || quantity >= 10}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          onClick={() => handleAddToCart(variant)}
                          disabled={!variant.inStock || quantity === 0}
                          className="bg-botanical hover:bg-botanical/90 text-white mt-2"
                          size="sm"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer with Add All button */}
        {totalSelectedItems > 0 && (
          <div className="border-t pt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {totalSelectedItems} item{totalSelectedItems > 1 ? 's' : ''} selected
            </div>
            <Button
              onClick={handleAddAllToCart}
              className="bg-botanical hover:bg-botanical/90 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add All to Cart ({totalSelectedItems})
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

