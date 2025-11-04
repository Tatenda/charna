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
  rangeId: number;
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

export const RangeProductsModal = ({ isOpen, onClose, category, rangeName, rangeId }: RangeProductsModalProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<Record<number, number>>({});
  const [embossingEnabled, setEmbossingEnabled] = useState<Record<number, boolean>>({});
  const [embossingText, setEmbossingText] = useState<Record<number, string>>({});
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const embossingPrice = 80; // R80.00 for embossing

  useEffect(() => {
    if (isOpen && rangeId) {
      fetchProducts();
    }
  }, [isOpen, rangeId]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch all products
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const allProducts: Product[] = await response.json();
      
      // Filter products that have this range assigned
      const filteredProducts = allProducts.filter((product: any) => {
        return product.rangeIds && Array.isArray(product.rangeIds) && product.rangeIds.includes(rangeId);
      });
      
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
    const hasEmbossing = embossingEnabled[variant.id] || false;
    const embossingTextValue = embossingText[variant.id] || '';
    
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
    
    const customizations = hasEmbossing && embossingTextValue.trim() ? {
      embossing: true,
      embossingText: embossingTextValue.trim(),
      embossingPrice: embossingPrice
    } : undefined;
    
    addToCart(productToAdd, quantity, customizations);
    
    const totalPrice = variant.price + (hasEmbossing ? embossingPrice : 0);
    const embossingNote = hasEmbossing && embossingTextValue.trim() ? ` with embossing "${embossingTextValue.trim()}"` : '';
    
    toast({
      title: 'Added to Cart',
      description: `${quantity} × ${variant.productName} - ${variant.name}${embossingNote} (R${totalPrice.toLocaleString()})`,
    });
    
    // Reset for this variant
    setSelectedVariants((prev) => {
      const { [variant.id]: _, ...rest } = prev;
      return rest;
    });
    setEmbossingEnabled((prev) => {
      const { [variant.id]: _, ...rest } = prev;
      return rest;
    });
    setEmbossingText((prev) => {
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
      <DialogContent 
        className="max-w-7xl max-h-[90vh] w-[95vw] sm:w-[98vw] p-0 overflow-hidden"
        style={{ maxHeight: '90vh', top: '50%', transform: 'translate(-50%, -50%)', overflow: 'hidden' }}
      >
        <div className="flex flex-col h-full" style={{ maxHeight: '90vh', overflow: 'hidden' }}>
          <DialogHeader className="flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b">
             <DialogTitle className="text-xl sm:text-2xl font-georgia-bold text-botanical">
               {rangeName}
             </DialogTitle>
             <DialogDescription className="text-sm">
               Select variants to add to your cart
             </DialogDescription>
           </DialogHeader>

           <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 min-h-0">
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
              <div className="space-y-4 md:space-y-5">
                {variants.map((variant) => {
                  const quantity = selectedVariants[variant.id] || 0;
                  const mainImage = variant.images[0] || '';
                  
                  return (
                    <div
                      key={variant.id}
                      className="border rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow bg-white"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-4 md:gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                          <img
                            src={getImagePath(mainImage)}
                            alt={variant.name}
                            className="w-full md:w-full h-48 md:h-48 object-cover rounded"
                          />
                        </div>

                                                {/* Product Info */}
                        <div className="flex-1 text-center md:text-left space-y-3">
                          <div>
                            <h3 className="font-semibold text-xl text-botanical mb-1">
                              {variant.productName}
                            </h3>
                            <p className="text-sm text-gray-600">{variant.name}</p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xl text-botanical">
                                R{(variant.price + (embossingEnabled[variant.id] ? embossingPrice : 0)).toLocaleString()}
                              </span>
                              {variant.originalPrice && variant.originalPrice !== variant.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  R{variant.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            {embossingEnabled[variant.id] && (
                              <div className="text-xs text-gray-600">
                                <span>Base: R{variant.price.toLocaleString()}</span>
                                <span className="mx-1">+</span>
                                <span>Embossing: R{embossingPrice}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                                variant.inStock
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {variant.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>

                          {/* Embossing Option */}
                          <div className="space-y-3 mt-4 pt-4 border-t">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={embossingEnabled[variant.id] || false}
                                onChange={(e) => {
                                  setEmbossingEnabled(prev => ({
                                    ...prev,
                                    [variant.id]: e.target.checked
                                  }));
                                  if (!e.target.checked) {
                                    setEmbossingText(prev => ({
                                      ...prev,
                                      [variant.id]: ''
                                    }));
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                              <span className="font-medium text-gray-700">
                                Add Embossing (+R{embossingPrice})
                              </span>
                            </label>
                            
                            {embossingEnabled[variant.id] && (
                              <div className="space-y-2">
                                {/* Embossing Demo Image */}
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Sample embossing placement:</p>
                                  <img 
                                    src="/embose/Embossing-Sans-Serif-font.png" 
                                    alt="Embossing example on bottom right corner of product"
                                    className="w-full max-w-xs rounded-lg border border-gray-200"
                                  />
                                </div>
                                
                                <input
                                  type="text"
                                  value={embossingText[variant.id] || ''}
                                  onChange={(e) => {
                                    const value = e.target.value.slice(0, 20);
                                    setEmbossingText(prev => ({
                                      ...prev,
                                      [variant.id]: value
                                    }));
                                  }}
                                  placeholder="Embossing text (max 20 chars)"
                                  className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-botanical"
                                  maxLength={20}
                                />
                                                                 <p className="text-xs text-gray-500">
                                   {(embossingText[variant.id]?.length || 0)}/20 characters
                                 </p>
                                 
                                 {/* Embossing Preview Image */}
                                 {embossingText[variant.id]?.trim() && (
                                   <div className="mt-2">
                                     <p className="text-xs text-gray-500 mb-1">Embossing preview (Sans Serif Font):</p>
                                     <img 
                                       src="/embodding-sans-serif.png" 
                                       alt={`Embossing preview showing "${embossingText[variant.id]?.trim()}" on product`}
                                       className="w-full max-w-xs rounded-lg border border-gray-200 object-contain max-h-48"
                                     />
                                   </div>
                                 )}
                               </div>
                             )}
                           </div>
                         </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-center md:items-end justify-center md:justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => handleQuantityChange(variant.id, -1)}
                              disabled={!variant.inStock || quantity === 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            
                            <span className="w-12 text-center font-semibold text-lg">
                              {quantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => handleQuantityChange(variant.id, 1)}
                              disabled={!variant.inStock || quantity >= 10}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            onClick={() => handleAddToCart(variant)}
                            disabled={
                              !variant.inStock || 
                              quantity === 0 || 
                              (embossingEnabled[variant.id] && !embossingText[variant.id]?.trim())
                            }
                            className="bg-botanical hover:bg-botanical/90 text-white w-full md:w-auto min-w-[140px]"
                            size="default"
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
          </div>

           {/* Footer with Add All button */}
           {totalSelectedItems > 0 && (
             <div className="flex-shrink-0 border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3">
              <div className="text-sm text-gray-600 text-center sm:text-left">
                {totalSelectedItems} item{totalSelectedItems > 1 ? 's' : ''} selected
              </div>
              <Button
                onClick={handleAddAllToCart}
                className="bg-botanical hover:bg-botanical/90 text-white w-full sm:w-auto"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add All to Cart ({totalSelectedItems})
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

