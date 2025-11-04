import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { Product } from "@shared/types";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Seo from "@/components/layout/Seo";
import { getImagePath } from "@/lib/imageUtils";

// Background image for browse page
const johannesburgSkyline = "/ChatGPT Image Sep 18, 2025, 10_43_30 PM_1758254550927.png";

// Types
interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  images: string[];
  isDefault: boolean;
  attributes: Array<{
    attributeType: string;
    attributeValue: string;
  }>;
}

// Use the existing Product type from shared/types
type ProductWithVariants = Product;

// Constants
const PACKAGE_PRODUCT_IDS = {
  ONBOARDING_PACKAGE_1: 229, // "The Perfect Onboarding Package"
  ONBOARDING_PACKAGE_2: 230, // "The Perfect Onboarding Package 2"
} as const;

// Custom hook for image cycling functionality
const useImageCycling = (images: string[], hasImages: boolean) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  const startCycling = useCallback(() => {
    if (!hasImages) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = window.setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 900);
  }, [hasImages, images.length]);

  const stopCycling = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleImageClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (hasImages) {
      e.preventDefault();
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  }, [hasImages, images.length]);

  useEffect(() => {
    return () => {
      stopCycling();
    };
  }, [stopCycling]);

  return {
    currentImageIndex,
    startCycling,
    stopCycling,
    handleImageClick,
  };
};

// Interface for database categories
interface CategoryNode {
  id: number;
  name: string;
  slug: string;
  displayName: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  parentId: number | null;
  sortOrder: number;
  productCount: number;
  children: Array<{
    id: number;
    name: string;
    slug: string;
    displayName: string;
    description: string | null;
    icon: string | null;
    parentId: number | null;
    sortOrder: number;
  }>;
}

export default function Browse() {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([0, 6000]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Database-driven categories
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // State that tracks current category from URL
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    return (router.query.category as string) || null;
  });
  
  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/public');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          // Auto-select first category if none selected
          if (!selectedCategory && data.length > 0) {
            setSelectedCategory(data[0].slug);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);
  
  // Update category when router query changes
  useEffect(() => {
    if (router.query.category && typeof router.query.category === 'string') {
      setSelectedCategory(router.query.category);
    }
  }, [router.query.category]);

  // Also read from URL on client side for immediate updates
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get('category');
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, []);

  // Package customization modal state
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState('tan');
  const [includeEmbossing, setIncludeEmbossing] = useState(false);
  const [embossingText, setEmbossingText] = useState("");
  const [embossingOptions, setEmbossingOptions] = useState<any[]>([]);
  const [selectedEmbossingOptionId, setSelectedEmbossingOptionId] = useState<number | null>(null);
  
  // Package 2 specific customization state
  const [selectedBagColor, setSelectedBagColor] = useState('navy'); // navy or olive
  const [selectedSleeveColor, setSelectedSleeveColor] = useState('tan'); // tan or navy
  
  const { toast } = useToast();

  // Fetch embossing options
  useEffect(() => {
    const fetchEmbossingOptions = async () => {
      try {
        const response = await fetch('/api/embossing-options');
        if (response.ok) {
          const data = await response.json();
          setEmbossingOptions(data);
        }
      } catch (error) {
        console.error('Error fetching embossing options:', error);
      }
    };
    fetchEmbossingOptions();
  }, []);

  // Update category when URL changes (for browser back/forward navigation)
  useEffect(() => {
    const updateCategoryFromURL = () => {
      if (router.query.category && typeof router.query.category === 'string') {
        setSelectedCategory(router.query.category);
      }
    };

    // Update immediately
    updateCategoryFromURL();

    // Listen for route changes
    const handleRouteChange = () => {
      updateCategoryFromURL();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.query.category, router.events]);

  // Generate dynamic SEO content based on category
  // Package Item Component for cycling images within package
  const PackageItem = ({ item, isPackage2 = false }: { item: any, isPackage2?: boolean }) => {
    const hasImages = Array.isArray(item.images) && item.images.length > 1;
    const { currentImageIndex, startCycling, stopCycling, handleImageClick } = useImageCycling(
      item.images || [],
      hasImages
    );
    
    const currentImage = hasImages ? item.images[currentImageIndex] : item.image;
    
    return (
      <div 
        className={`relative overflow-hidden rounded-lg ${item.size === 'large' && !isPackage2 ? 'row-span-2' : ''}`}
        onMouseEnter={startCycling}
        onMouseLeave={stopCycling}
      >
        <img
          src={getImagePath(currentImage)}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${hasImages ? 'cursor-pointer' : ''}`}
          onClick={handleImageClick}
          onTouchStart={handleImageClick}
        />
        {hasImages && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {item.images.map((_: string, index: number) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
          <p className="text-white text-xs font-medium">{item.name}</p>
        </div>
      </div>
    );
  };

  // ProductTile component with image cycling functionality
  const ProductTile = ({ product, onAddToCart }: { product: ProductWithVariants, onAddToCart: (product: ProductWithVariants) => void }) => {
    const hasGallery = Array.isArray(product.images) && product.images.length > 1;
    const { currentImageIndex, startCycling, stopCycling, handleImageClick } = useImageCycling(
      product.images || [],
      hasGallery
    );
    
    const currentImage = hasGallery ? product.images[currentImageIndex] : (product.images && product.images[0]) || '';
    
    // For variants: combine product name with variant name
    // product.product exists when this is a variant, otherwise it's a regular product
    const displayName = (product as any).product 
      ? `${(product as any).product.name} - ${product.name}`
      : product.name;
    
    // For variants: use the parent product's description
    const displayDescription = (product as any).product?.description || product.description;
    
    // Special package layout
    if (product.isPackage && product.packageItems) {
      // Package 1 (3 items): large + 2 small in 2x2 grid with span
      // Package 2 (4 items): 4 medium in 2x2 grid  
      const isPackage2 = product.packageItems.length === 4;
      
      return (
        <div
          data-testid={`tile-product-${product.id}`}
          className="group bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 w-full"
        >
          <div className="aspect-square relative w-full p-2">
            <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
              {product.packageItems.map((item: any, index: number) => (
                <PackageItem key={index} item={item} isPackage2={isPackage2} />
              ))}
            </div>
          </div>
          
          <div className="p-3 sm:p-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product);
              }}
              className="w-full border border-gray-400 text-gray-700 py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium hover:border-gray-600 hover:text-gray-900 transition-colors duration-200 rounded mb-3 min-h-[44px]"
            >
              Add to Cart
            </button>
            
            <h3 className="text-xs sm:text-sm text-gray-900 mb-1 font-medium line-clamp-2">
              {displayName}
            </h3>
            
            {displayDescription && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{displayDescription}</p>
            )}
            
            <div>
              <span className="text-gray-900 font-semibold text-xs sm:text-sm">
                R{product.price}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // Regular product layout
    return (
      <div
        data-testid={`tile-product-${product.id}`}
        className="group bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 w-full"
        onMouseEnter={startCycling}
        onMouseLeave={stopCycling}
      >
        <div className="aspect-square overflow-hidden relative w-full">
          <img
            data-testid={`img-product-${product.id}`}
            src={getImagePath(currentImage)}
            alt={displayName}
            loading="lazy"
            className={`w-full h-full ${product.name === "Navy Tennis Bag" ? "object-contain" : "object-cover"} group-hover:scale-110 transition-transform duration-500 ${hasGallery ? 'cursor-pointer' : ''}`}
            style={{
              imageRendering: 'auto'
            }}
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onClick={handleImageClick}
            onTouchStart={handleImageClick}
          />
          {hasGallery && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {product.images.map((_: string, index: number) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="p-3 sm:p-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            className="w-full border border-gray-400 text-gray-700 py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium hover:border-gray-600 hover:text-gray-900 transition-colors duration-200 rounded mb-3 min-h-[44px]"
          >
            Add to Cart
          </button>
          
          <h3 className="text-xs sm:text-sm text-gray-900 mb-1 font-medium line-clamp-2">
            {displayName}
          </h3>
          
          {displayDescription && (
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{displayDescription}</p>
          )}
          
          <div>
            <span className="text-gray-900 font-semibold text-xs sm:text-sm">
              R{product.price}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const getSEOContent = () => {
    if (!selectedCategory) {
      return {
        title: 'Browse Leather Bags | Charna Leather Goods',
        description: 'Browse our collection of handcrafted leather bags, backpacks, and accessories. Premium South African leather goods crafted in Johannesburg.'
      };
    }
    
    const categoryTitle = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
    const baseTitle = `${categoryTitle} Bags | Charna Leather Goods`;
    const descriptions: Record<string, string> = {
      'Work': 'Discover Charna\'s professional work bags and business backpacks. Handcrafted in Johannesburg from premium leather for the modern professional.',
      'Leisure': 'Explore Charna\'s leisure collection of casual bags and everyday accessories. Perfect for weekend adventures and daily errands.',
      'Sport': 'Shop Charna\'s sports collection including tennis bags and athletic gear. Handcrafted leather bags for the active lifestyle.',
      'Travel': 'Browse Charna\'s travel collection of luggage and travel bags. Premium leather travel gear made in South Africa.',
      'Accessories': 'Discover Charna\'s leather accessories including laptop sleeves, desk mats, and luggage tags. Handcrafted in Johannesburg.',
      'Onboarding': 'Explore Charna\'s corporate onboarding packages and business gifts. Premium leather goods for employee welcome packages.',
      'Gifting': 'Find the perfect leather gift from Charna\'s curated collection. Handcrafted bags and accessories made in South Africa.'
    };
    
    return {
      title: baseTitle,
      description: descriptions[categoryTitle] || descriptions['Work'],
      keywords: `${categoryTitle.toLowerCase()} bags, Charna leather goods, handcrafted leather, South African leather bags, ${categoryTitle.toLowerCase()} accessories`
    };
  };

  // selectedCategory is now calculated directly from URL, no state management needed

  // Scroll to top when navigating to browse page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.asPath]);

  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products by selected category
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/category/${selectedCategory}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Filter products by price (category filtering now done by API)
  const filteredVariants = useMemo(() => {
    if (!products.length) return [];
    
    // Filter by price only (category already filtered by API)
    const filteredProducts = products.filter((product) => {
      return product.price >= priceRange[0] && product.price <= priceRange[1];
    });
    
    // Then extract all variants from filtered products
    const variants = [];
    for (const product of filteredProducts) {
      if (product.variants && product.variants.length > 0) {
        // Add product info to each variant
        product.variants.forEach((variant: ProductVariant) => {
          variants.push({
            ...variant,
            product: {
              id: product.id,
              name: product.name,
              description: product.description,
              longDescription: product.longDescription,
              materials: product.materials,
              dimensions: product.dimensions,
              careInstructions: product.careInstructions,
              badge: product.badge,
              rating: product.rating,
              reviewCount: product.reviewCount,
              featured: product.featured,
              createdAt: product.createdAt,
              category: product.category,
              categories: product.categories
            }
          });
        });
      } else {
        // If no variants, create a default variant from the product
        variants.push({
          id: product.id,
          name: product.name,
          sku: `${product.name.toUpperCase().replace(/\s+/g, '-')}`,
          price: product.price,
          originalPrice: product.originalPrice,
          inStock: product.inStock,
          images: product.images,
          isDefault: true,
          attributes: [],
          product: {
            id: product.id,
            name: product.name,
            description: product.description,
            longDescription: product.longDescription,
            materials: product.materials,
            dimensions: product.dimensions,
            careInstructions: product.careInstructions,
            badge: product.badge,
            rating: product.rating,
            reviewCount: product.reviewCount,
            featured: product.featured,
            createdAt: product.createdAt,
            category: product.category,
            categories: product.categories
          }
        });
      }
    }
    
    return variants;
  }, [products, priceRange]);


  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    router.push(`/browse?category=${categoryId}`);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setPriceRange([priceRange[0], value]);
  };

  const handleAddToCart = (product: ProductWithVariants) => {
    // Check if this is a package that needs customization
    if (product.isPackage && (product.id === PACKAGE_PRODUCT_IDS.ONBOARDING_PACKAGE_1 || product.id === PACKAGE_PRODUCT_IDS.ONBOARDING_PACKAGE_2)) {
      setSelectedProduct(product);
      
      // Reset customization state based on package
      if (product.id === PACKAGE_PRODUCT_IDS.ONBOARDING_PACKAGE_1) {
        // Package 1: laptop bag color choice
        setSelectedColor('tan');
        setIncludeEmbossing(false);
        setEmbossingText("");
        setSelectedEmbossingOptionId(null);
      } else if (product.id === PACKAGE_PRODUCT_IDS.ONBOARDING_PACKAGE_2) {
        // Package 2: bag color and sleeve color choices
        setSelectedBagColor('navy');
        setSelectedSleeveColor('tan');
        setIncludeEmbossing(false);
        setEmbossingText("");
        setSelectedEmbossingOptionId(null);
      }
      
      setShowCustomizationModal(true);
      return;
    }
    
    // Check if this is an individual product that supports embossing
    if (product.id === 24) { // Wine Bottle Bag
      setSelectedProduct(product);
      setIncludeEmbossing(false);
      setEmbossingText("");
      setSelectedEmbossingOptionId(null);
      setShowCustomizationModal(true);
      return;
    }
    
    // Check if this product has color variations
    if (product.colors && product.colors.length > 0) {
      setSelectedProduct(product);
      setSelectedColor(product.colors[0]); // Default to first color
              setIncludeEmbossing(false);
        setEmbossingText("");
        setSelectedEmbossingOptionId(null);
        setShowCustomizationModal(true);
        return;
    }

    // All other products - show customization modal for embossing
    setSelectedProduct(product);
    setIncludeEmbossing(false);
    setEmbossingText("");
    setSelectedEmbossingOptionId(null);
    setShowCustomizationModal(true);
    return;

  };

  // Handle customized package add to cart
  const handleCustomizedAddToCart = () => {
    if (!selectedProduct) return;

    const selectedOption = embossingOptions.find(opt => opt.id === selectedEmbossingOptionId);
    const embossingPrice = includeEmbossing && selectedOption ? selectedOption.price : 0;
    let customizations;
    let productName;

    if (selectedProduct.id === 13) {
      // Package 1 customizations
      customizations = {
        color: selectedColor,
        embossing: includeEmbossing,
        embossingText: includeEmbossing ? embossingText.trim() : undefined,
        embossingPrice: embossingPrice,
        embossingOptionId: includeEmbossing && selectedEmbossingOptionId ? selectedEmbossingOptionId : undefined
      };
      productName = `${selectedProduct.name} - ${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}${includeEmbossing ? ' + Embossing' : ''}`;
    } else if (selectedProduct.id === 14) {
      // Package 2 customizations
      customizations = {
        bagColor: selectedBagColor,
        sleeveColor: selectedSleeveColor,
        embossing: includeEmbossing,
        embossingText: includeEmbossing ? embossingText.trim() : undefined,
        embossingPrice: embossingPrice,
        embossingOptionId: includeEmbossing && selectedEmbossingOptionId ? selectedEmbossingOptionId : undefined
      };
      productName = `${selectedProduct.name} - ${selectedBagColor.charAt(0).toUpperCase() + selectedBagColor.slice(1)} Bag / ${selectedSleeveColor.charAt(0).toUpperCase() + selectedSleeveColor.slice(1)} Sleeve${includeEmbossing ? ' + Embossing' : ''}`;
    } else if (selectedProduct.id === 24) {
      // Wine Bottle Bag (individual product with embossing)
      customizations = {
        embossing: includeEmbossing,
        embossingText: includeEmbossing ? embossingText.trim() : undefined,
        embossingPrice: embossingPrice,
        embossingOptionId: includeEmbossing && selectedEmbossingOptionId ? selectedEmbossingOptionId : undefined
      };
      productName = `${selectedProduct.name}${includeEmbossing ? ' + Embossing' : ''}`;
    } else if (selectedProduct.colors && selectedProduct.colors.length > 0) {
      // Individual product with color variations
      customizations = {
        color: selectedColor,
        embossing: includeEmbossing,
        embossingText: includeEmbossing ? embossingText.trim() : undefined,
        embossingPrice: embossingPrice,
        embossingOptionId: includeEmbossing && selectedEmbossingOptionId ? selectedEmbossingOptionId : undefined
      };
      productName = `${selectedProduct.name}${selectedColor ? ' - ' + selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1) : ''}${includeEmbossing ? ' + Embossing' : ''}`;
    } else {
      // Default case for all other products (includes embossing)
      customizations = {
        embossing: includeEmbossing,
        embossingText: includeEmbossing ? embossingText.trim() : undefined,
        embossingPrice: embossingPrice,
        embossingOptionId: includeEmbossing && selectedEmbossingOptionId ? selectedEmbossingOptionId : undefined
      };
      productName = `${selectedProduct.name}${includeEmbossing ? ' + Embossing' : ''}`;
    }

    // Convert to full Product schema format with customizations
    const fullProduct: Product = {
      id: selectedProduct.id,
      name: productName || selectedProduct.name,
      description: selectedProduct.description || `Premium handcrafted ${selectedProduct.category} package from Johannesburg`,
      longDescription: `Meticulously crafted in our Johannesburg workshop, this ${selectedProduct.name.toLowerCase()} represents the perfect blend of South African craftsmanship and modern design.`,
      price: selectedProduct.price,
      originalPrice: undefined,
      rating: 5,
      reviewCount: 12,
      inStock: true,
      badge: "Signature",
      category: selectedProduct.category,
      colors: ["natural", "cognac"],
      features: ["Premium leather", "Handcrafted", "Made in Johannesburg"],
      images: selectedProduct.images ?? [selectedProduct.image],
      materials: "Premium Italian leather",
      dimensions: "40cm x 30cm x 15cm",
      careInstructions: "Clean with leather conditioner, avoid water",
      featured: true,
      createdAt: new Date()
    };

    addToCart(fullProduct, 1, customizations);
    
    toast({
      title: "Added to Cart",
      description: `${fullProduct.name} has been added to your cart.`,
    });

    setShowCustomizationModal(false);
    setSelectedProduct(null);
  };

  const seoContent = getSEOContent();

  return (
    <div className="min-h-screen bg-browse text-white pt-16 md:pt-20 overflow-x-hidden relative">
      {/* Johannesburg Skyline Background - Full Page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${johannesburgSkyline})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 1,
            zIndex: 0
          }}
        ></div>
      </div>
      <Seo 
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        url={`/browse${router.asPath.includes('?') ? '?' + router.asPath.split('?')[1] : ''}`}
        image=""
      />
      {/* Breadcrumb Navigation */}
      <div className="px-4 md:px-6 py-4 text-sm text-white/70 max-w-full relative z-10">
        <div className="flex items-center flex-wrap">
          <Link href="/" className="hover:text-white flex-shrink-0">Home</Link>
          <span className="mx-2 flex-shrink-0">&gt;</span>
          <span className="text-white capitalize truncate">{selectedCategory}</span>
        </div>
      </div>

      {/* Top Category Navigation Tabs - Mobile Friendly */}
      <div className="px-4 md:px-6 mb-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-2">
          {categoriesLoading ? (
            <div className="flex items-center justify-center py-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`text-xs sm:text-sm font-medium transition-colors duration-200 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap min-h-[40px] sm:min-h-[44px] flex-shrink-0 ${
                    selectedCategory === category.slug
                      ? 'bg-botanical/60 text-white'
                      : 'text-stone-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {category.displayName}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden px-4 mb-4 relative z-20">
        <button
          data-testid="button-filters"
          aria-controls="filters-panel"
          aria-expanded={isMobileFiltersOpen}
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 min-h-[44px]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.121A1 1 0 013 6.414V4z" />
          </svg>
          Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row min-h-0">
        {/* Left Sidebar - Desktop & Mobile Responsive */}
        <div 
          id="filters-panel"
          data-testid="filters-panel"
          className={`md:w-80 px-4 md:px-6 py-4 transition-all duration-300 flex-shrink-0 ${
            isMobileFiltersOpen ? 'block' : 'hidden md:block'
          }`}
        >
          {/* Browse by Section */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 text-white border-b border-white/30 pb-3">
              Browse by
            </h3>
            {categoriesLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                <p className="text-white/60 text-sm mt-2">Loading categories...</p>
              </div>
            ) : (
              <div className="space-y-1">
                {categories.map((category) => {
                  const isActive = selectedCategory === category.slug;
                  const isExpanded = expandedCategories.has(category.id);
                  const hasChildren = category.children.length > 0;
                  
                  return (
                    <div key={category.id}>
                      {/* Parent Category */}
                      <div className="flex items-center gap-1">
                        {hasChildren && (
                          <button
                            onClick={() => {
                              const newExpanded = new Set(expandedCategories);
                              if (isExpanded) {
                                newExpanded.delete(category.id);
                              } else {
                                newExpanded.add(category.id);
                              }
                              setExpandedCategories(newExpanded);
                            }}
                            className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                          >
                            <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            handleCategoryChange(category.slug);
                          }}
                          className={`flex-1 text-left py-2 px-3 rounded transition-colors ${
                            isActive
                              ? 'bg-botanical text-white font-medium'
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                          } ${!hasChildren ? 'ml-5' : ''}`}
                        >
                          <span className="flex items-center justify-between">
                            <span>{category.displayName}</span>
                            {category.productCount > 0 && (
                              <span className="text-xs text-white/50">({category.productCount})</span>
                            )}
                          </span>
                        </button>
                      </div>
                      
                      {/* Child Categories */}
                      {hasChildren && isExpanded && (
                        <div className="ml-6 mt-1 space-y-1">
                          {category.children.map((child) => {
                            const isChildActive = selectedCategory === child.slug;
                            return (
                              <button
                                key={child.id}
                                onClick={() => {
                                  handleCategoryChange(child.slug);
                                }}
                                className={`block w-full text-left py-2 px-3 rounded text-sm transition-colors ${
                                  isChildActive
                                    ? 'bg-botanical/80 text-white font-medium'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                              >
                                {child.displayName}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Filter by Section */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white border-b border-white/30 pb-3">
              Filter by
            </h3>
            
            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="text-white mb-4 font-medium">Price</h4>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="6000"
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between mt-3 text-sm text-white/70">
                  <span>R{priceRange[0]}</span>
                  <span>R{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative md:ml-4 min-w-0">
          {/* Content with overlay */}
          <div className="relative z-10 px-4 md:px-6 py-4 min-h-screen">

            {/* Collage Style Product Grid - Mobile Optimized */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 w-full">
              {isLoading ? (
                // Ghost/Skeleton Loaders
                Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 animate-pulse">
                    {/* Image skeleton */}
                    <div className="aspect-square bg-white/10"></div>
                    
                    {/* Content skeleton */}
                    <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                      {/* Title */}
                      <div className="h-4 md:h-5 bg-white/10 rounded w-3/4"></div>
                      {/* Subtitle */}
                      <div className="h-3 md:h-4 bg-white/10 rounded w-1/2"></div>
                      
                      {/* Price and buttons */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="h-5 md:h-6 bg-white/10 rounded w-16 md:w-20"></div>
                        <div className="h-8 md:h-9 bg-white/10 rounded w-20 md:w-24"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                filteredVariants.map((variant) => (
                <ProductTile
                    key={`${variant.product.id}-${variant.id}`}
                    product={variant as any}
                  onAddToCart={handleAddToCart}
                />
                ))
              )}
            </div>

            {!isLoading && filteredVariants.length === 0 && (
              <div className="text-center py-12 sm:py-20 bg-terracotta/70 backdrop-blur-sm rounded-lg mx-auto max-w-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 px-4">
                  No products found
                </h3>
                <p className="text-white/80 px-4 text-sm sm:text-base">
                  Try adjusting your filters or browse a different category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Package Customization Modal */}
      <Dialog open={showCustomizationModal} onOpenChange={setShowCustomizationModal}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] w-[95vw] sm:w-[98vw] p-0 overflow-hidden"
          style={{ maxHeight: '90vh', top: '50%', transform: 'translate(-50%, -50%)', overflow: 'hidden' }}
        >
          <div className="flex flex-col h-full" style={{ maxHeight: '90vh', overflow: 'hidden' }}>
            <DialogHeader className="flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                Customize Your {selectedProduct?.name}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {selectedProduct?.id === PACKAGE_PRODUCT_IDS.ONBOARDING_PACKAGE_1 
                  ? "Choose your laptop bag color and add optional embossing to personalize your package."
                  : selectedProduct?.id === PACKAGE_PRODUCT_IDS.ONBOARDING_PACKAGE_2
                  ? "Choose your bag and sleeve colors, plus add optional embossing to personalize your package."
                  : selectedProduct?.colors && selectedProduct.colors.length > 0
                  ? "Choose your color and add optional embossing to personalize your product."
                  : "Add optional embossing to personalize your product."
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Left Column: Options */}
                <div className="space-y-6">
                  {/* Package 1 Color Selection */}
                  {selectedProduct?.id === PACKAGE_PRODUCT_IDS.ONBOARDING_PACKAGE_1 && (
                    <div>
                      <Label className="text-base font-semibold text-gray-900 mb-3 block">
                        Laptop Bag Color
                      </Label>
                      <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tan" id="tan" />
                          <Label htmlFor="tan" className="text-gray-700 cursor-pointer">
                            Tan Leather
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="navy" id="navy" />
                          <Label htmlFor="navy" className="text-gray-700 cursor-pointer">
                            Navy Leather
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Package 2 Color Selections */}
                  {selectedProduct?.id === PACKAGE_PRODUCT_IDS.ONBOARDING_PACKAGE_2 && (
                    <>
                      <div>
                        <Label className="text-base font-semibold text-gray-900 mb-3 block">
                          Retro Bag Color
                        </Label>
                        <RadioGroup value={selectedBagColor} onValueChange={setSelectedBagColor}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="navy" id="bag-navy" />
                            <Label htmlFor="bag-navy" className="text-gray-700 cursor-pointer">
                              Navy Blue
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="olive" id="bag-olive" />
                            <Label htmlFor="bag-olive" className="text-gray-700 cursor-pointer">
                              Olive Green
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label className="text-base font-semibold text-gray-900 mb-3 block">
                          Laptop Sleeve Color
                        </Label>
                        <RadioGroup value={selectedSleeveColor} onValueChange={setSelectedSleeveColor}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="tan" id="sleeve-tan" />
                            <Label htmlFor="sleeve-tan" className="text-gray-700 cursor-pointer">
                              Tan Leather
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="navy" id="sleeve-navy" />
                            <Label htmlFor="sleeve-navy" className="text-gray-700 cursor-pointer">
                              Navy Leather
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </>
                  )}

                  {/* Individual Product Color Selection */}
                  {selectedProduct?.colors && selectedProduct.colors.length > 0 && selectedProduct.id !== 13 && selectedProduct.id !== 14 && (
                    <div>
                      <Label className="text-base font-semibold text-gray-900 mb-3 block">
                        Color Options
                      </Label>
                      <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
                        {selectedProduct.colors.map((color: string) => (
                          <div key={color} className="flex items-center space-x-2">
                            <RadioGroupItem value={color} id={`color-${color}`} />
                            <Label htmlFor={`color-${color}`} className="text-gray-700 cursor-pointer">
                              {color.charAt(0).toUpperCase() + color.slice(1)}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* Embossing Option */}
                  <div>
              <Label className="text-base font-semibold text-gray-900 mb-3 block">
                Additional Options
              </Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="embossing" 
                  checked={includeEmbossing}
                  onCheckedChange={(checked) => {
                    setIncludeEmbossing(!!checked);
                    if (!checked) {
                      setEmbossingText("");
                      setSelectedEmbossingOptionId(null);
                    }
                  }}
                />
                <Label htmlFor="embossing" className="text-gray-700 cursor-pointer">
                  Add Custom Embossing
                  {selectedEmbossingOptionId && embossingOptions.find(opt => opt.id === selectedEmbossingOptionId) && (
                    <span> (+R{embossingOptions.find(opt => opt.id === selectedEmbossingOptionId)?.price})</span>
                  )}
                </Label>
              </div>
              <p className="text-sm text-gray-500 mt-1 ml-6">
                Personalize your package with custom embossing on the leather goods
              </p>
              
                    {includeEmbossing && (
                      <div className="mt-3 ml-6 space-y-3">
                        {/* Embossing Option Dropdown */}
                        <div>
                          <Label htmlFor="embossing-option" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Font Style *
                          </Label>
                          <select
                            id="embossing-option"
                            value={selectedEmbossingOptionId || ''}
                            onChange={(e) => {
                              const optionId = e.target.value ? parseInt(e.target.value) : null;
                              setSelectedEmbossingOptionId(optionId);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required={includeEmbossing}
                          >
                            <option value="">Select a font style...</option>
                            {embossingOptions.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name} (R{option.price})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Show images from selected embossing option */}
                        {selectedEmbossingOptionId && embossingOptions.find(opt => opt.id === selectedEmbossingOptionId) && (
                          <div className="space-y-3">
                            {(() => {
                              const selectedOption = embossingOptions.find(opt => opt.id === selectedEmbossingOptionId);
                              const images = selectedOption?.images || [];
                              return images.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    {images.map((image: string, idx: number) => (
                                      <div key={idx} className="relative">
                                                                                 <img 
                                           src={getImagePath(image)}
                                           alt={`${selectedOption.name} preview ${idx + 1}`}
                                           className="w-full rounded-lg border border-gray-200 object-contain max-h-48"
                                         />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                        
                        <div>
                          <Label htmlFor="embossing-text" className="block text-sm font-medium text-gray-700 mb-2">
                            Embossing Text (max 20 characters) *
                          </Label>
                          <input
                            type="text"
                            id="embossing-text"
                            value={embossingText}
                            onChange={(e) => setEmbossingText(e.target.value.slice(0, 20))}
                            placeholder="Enter text to emboss"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            data-testid="input-embossing-text"
                            required={includeEmbossing}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {embossingText.length}/20 characters
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Right Column: Summary */}
                <div className="space-y-6">
                  {/* Price Summary */}
                  <div className="border rounded-lg p-4 md:p-6 bg-gray-50 sticky top-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-base">
                        <span className="text-gray-700">
                          {selectedProduct?.isPackage ? 'Package Price:' : 'Product Price:'}
                        </span>
                        <span className="text-gray-900 font-medium">R{selectedProduct?.price?.toLocaleString()}</span>
                      </div>
                                               {includeEmbossing && selectedEmbossingOptionId && embossingOptions.find(opt => opt.id === selectedEmbossingOptionId) && (
                           <div className="flex justify-between text-sm text-gray-600">
                             <span>Embossing ({embossingOptions.find(opt => opt.id === selectedEmbossingOptionId)?.name}):</span>
                             <span>+R{embossingOptions.find(opt => opt.id === selectedEmbossingOptionId)?.price}</span>
                           </div>
                         )}
                      <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-gray-300">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-gray-900 text-xl">
                          R{((selectedProduct?.price || 0) + (includeEmbossing && selectedEmbossingOptionId ? (embossingOptions.find(opt => opt.id === selectedEmbossingOptionId)?.price || 0) : 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 border-t pt-4 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCustomizationModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCustomizedAddToCart}
                  className="flex-1 bg-botanical hover:bg-botanical/90 text-white"
                  data-testid="button-add-customized-package"
                  disabled={includeEmbossing && (!selectedEmbossingOptionId || !embossingText.trim())}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}