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

const categoryTabs = [
  { id: 'work', label: 'Work' },
  { id: 'leisure', label: 'Leisure' },
  { id: 'sport', label: 'Sport' },
  { id: 'travel', label: 'Travel' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'gifting', label: 'Gifting' },
  { id: 'onboarding', label: 'Onboarding' }
];

const browseCategories = [
  'Work',
  'Leisure',
  'Sport',
  'Travel',
  'Accessories',
  'Onboarding',
  'Gifting'
];

// Map hero categories to actual product categories
const categoryMapping: Record<string, string> = {
  'work': 'business',
  'sport': 'tennis', 
  'leisure': 'leisure',
  'travel': 'travel',
  'accessories': 'accessories',
  'onboarding': 'onboarding',
  'gifting': 'gifting'
};

export default function Browse() {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([0, 6000]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // State that tracks current category from URL
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return (router.query.category as string) || 'work';
  });
  
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
  
  // Package 2 specific customization state
  const [selectedBagColor, setSelectedBagColor] = useState('navy'); // navy or olive
  const [selectedSleeveColor, setSelectedSleeveColor] = useState('tan'); // tan or navy
  
  const { toast } = useToast();

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
          src={currentImage}
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
              {product.name}
            </h3>
            
            {product.description && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
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
            src={currentImage}
            alt={product.name}
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
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products and then extract their variants
  const filteredVariants = useMemo(() => {
    if (!products.length) return [];
    
    const urlCategory = router.query.category as string || selectedCategory;
    const targetCategory = categoryMapping[urlCategory] || urlCategory;
    
    // First filter products by category and price
    const filteredProducts = products.filter((product) => {
      // Check both primary category and categories array
      const matchesCategory = product.category === targetCategory || 
        (product.categories && product.categories.some((cat: { slug: string }) => cat.slug === targetCategory));
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
    return matchesCategory && matchesPrice;
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
  }, [products, router.query.category, selectedCategory, priceRange]);


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
      } else if (product.id === PACKAGE_PRODUCT_IDS.ONBOARDING_PACKAGE_2) {
        // Package 2: bag color and sleeve color choices
        setSelectedBagColor('navy');
        setSelectedSleeveColor('tan');
        setIncludeEmbossing(false);
        setEmbossingText("");
      }
      
      setShowCustomizationModal(true);
      return;
    }
    
    // Check if this is an individual product that supports embossing
    if (product.id === 24) { // Wine Bottle Bag
      setSelectedProduct(product);
      setIncludeEmbossing(false);
      setEmbossingText("");
      setShowCustomizationModal(true);
      return;
    }
    
    // Check if this product has color variations
    if (product.colors && product.colors.length > 0) {
      setSelectedProduct(product);
      setSelectedColor(product.colors[0]); // Default to first color
      setIncludeEmbossing(false);
      setEmbossingText("");
      setShowCustomizationModal(true);
      return;
    }

    // All other products - show customization modal for embossing
    setSelectedProduct(product);
    setIncludeEmbossing(false);
    setEmbossingText("");
    setShowCustomizationModal(true);
    return;

  };

  // Handle customized package add to cart
  const handleCustomizedAddToCart = () => {
    if (!selectedProduct) return;

    const embossingPrice = includeEmbossing ? 80 : 0;
    let customizations;
    let productName;

    if (selectedProduct.id === 13) {
      // Package 1 customizations
      customizations = {
        color: selectedColor,
        embossing: includeEmbossing,
        embossingText: includeEmbossing ? embossingText.trim() : undefined,
        embossingPrice: embossingPrice
      };
      productName = `${selectedProduct.name} - ${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}${includeEmbossing ? ' + Embossing' : ''}`;
    } else if (selectedProduct.id === 14) {
      // Package 2 customizations
      customizations = {
        bagColor: selectedBagColor,
        sleeveColor: selectedSleeveColor,
        embossing: includeEmbossing,
        embossingText: includeEmbossing ? embossingText.trim() : undefined,
        embossingPrice: embossingPrice
      };
      productName = `${selectedProduct.name} - ${selectedBagColor.charAt(0).toUpperCase() + selectedBagColor.slice(1)} Bag / ${selectedSleeveColor.charAt(0).toUpperCase() + selectedSleeveColor.slice(1)} Sleeve${includeEmbossing ? ' + Embossing' : ''}`;
    } else if (selectedProduct.id === 24) {
      // Wine Bottle Bag (individual product with embossing)
      customizations = {
        embossing: includeEmbossing,
        embossingText: includeEmbossing ? embossingText.trim() : undefined,
        embossingPrice: embossingPrice
      };
      productName = `${selectedProduct.name}${includeEmbossing ? ' + Embossing' : ''}`;
    } else if (selectedProduct.colors && selectedProduct.colors.length > 0) {
      // Individual product with color variations
      customizations = {
        color: selectedColor,
        embossing: includeEmbossing,
        embossingText: includeEmbossing ? embossingText.trim() : undefined,
        embossingPrice: embossingPrice
      };
      productName = `${selectedProduct.name}${selectedColor ? ' - ' + selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1) : ''}${includeEmbossing ? ' + Embossing' : ''}`;
    } else {
      // Default case for all other products (includes embossing)
      customizations = {
        embossing: includeEmbossing,
        embossingText: includeEmbossing ? embossingText.trim() : undefined,
        embossingPrice: embossingPrice
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
          <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`text-xs sm:text-sm font-medium transition-colors duration-200 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap min-h-[40px] sm:min-h-[44px] flex-shrink-0 ${
                  selectedCategory === tab.id
                    ? 'bg-botanical/60 text-white'
                    : 'text-stone-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
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
            <div className="space-y-3">
              {browseCategories.map((category) => {
                const categoryId = category.toLowerCase();
                const isActive = selectedCategory === categoryId;
                
                return (
                  <button
                    key={category}
                    onClick={() => {
                      handleCategoryChange(categoryId);
                    }}
                    className={`block w-full text-left py-2 px-3 rounded transition-colors ${
                      isActive
                        ? 'bg-botanical text-white font-medium'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
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
                <div className="col-span-full text-center py-8">
                  <p className="text-white">Loading products...</p>
                </div>
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
        <DialogContent className="sm:max-w-md bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
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
          
          <div className="space-y-6 py-4">
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
                    if (!checked) setEmbossingText("");
                  }}
                />
                <Label htmlFor="embossing" className="text-gray-700 cursor-pointer">
                  Add Custom Embossing (+R80.00)
                </Label>
              </div>
              <p className="text-sm text-gray-500 mt-1 ml-6">
                Personalize your package with custom embossing on the leather goods
              </p>
              
              {includeEmbossing && (
                <div className="mt-3 ml-6 space-y-3">
                  <div>
                    <Label htmlFor="embossing-text" className="block text-sm font-medium text-gray-700 mb-2">
                      Embossing Text (max 10 characters)
                    </Label>
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
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
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

            {/* Price Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-base">
                <span className="text-gray-700">
                  {selectedProduct?.isPackage ? 'Package Price:' : 'Product Price:'}
                </span>
                <span className="text-gray-900">R{selectedProduct?.price?.toLocaleString()}</span>
              </div>
              {includeEmbossing && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Embossing:</span>
                  <span>+R80</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold mt-2 border-t pt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">
                  R{((selectedProduct?.price || 0) + (includeEmbossing ? 80 : 0)).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCustomizationModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCustomizedAddToCart}
                className="flex-1 bg-[#8B4513] hover:bg-[#7A3A0F] text-white"
                data-testid="button-add-customized-package"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}