import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Seo from "@/components/layout/Seo";
import johannesburgSkyline from "@assets/ChatGPT Image Sep 18, 2025, 10_43_30 PM_1758254550927.png";
import welcomeTag from "@assets/Welcome message - Christopher_1758261765918.png";
import navyTennisBag from "@assets/ChatGPT Image Sep 9, 2025, 06_28_09 AM_1757403283994.png";
import creamCrossbody from "@assets/ChatGPT Image Sep 9, 2025, 06_31_47 AM_1757403283997.png";
import whiteBackpack from "@assets/Copy of ChatGPT Image Jul 25, 2025, 05_27_55 PM_1757403283999.png";
import navyRoseGoldBackpack from "@assets/Copy of Classic range - Rose Gold_1757403284000.png";
import tanBackpack from "@assets/LGM_Classic_me (1)_1757403284001.png";
import brownBackpack from "@assets/LGM_Grounded (1)_1757403284002.png";
import navyModernBackpack from "@assets/Retro Range - Navy Blue_1757403284003.png";
import oliveBackpack from "@assets/Retro Range - Olive_1757403284004.png";
import whiteTennisBag from "@assets/Tennis bag - White - neutral background_1757403947038.png";
import newNavyTennisBag from "@assets/Navy sports back - neutral background_1758112268197.png";
import tanLaptopSleeve from "@assets/DF6D3DFE-6CBA-45BD-8742-1ABE450C1F7E_1758343502287.png";
import navyLaptopSleeve from "@assets/855ABA3F-D6BD-42E0-BBA5-488FEFF9EE7E_1758348677472.png";
import groundedGoldZip from "@assets/ChatGPT Image Sep 17, 2025, 03_09_28 PM_1758392791511.png";
import timelessWhiteRoseGold from "@assets/Timeless Range - Rose Gold zip_1758117345340.png";
import navySideBag from "@assets/Navy side bag - neutral background_1758388433671.png";
import tanLaptopSleeve2 from "@assets/Laptop sleeve - Tan_1758299564397.png";
import tanLaptopSleeve3 from "@assets/Laptop sleeve - Tan_1758299666358.png";
import navyLaptopSleeve2 from "@assets/Laptop sleeve - Navy_1758299564401.png";
import navyLaptopSleeve3 from "@assets/Laptop sleeve - Navy_1758299666356.png";
import wineBagWithBottles from "@assets/Wine bag - wine bottles_1758387116266.png";

// Product data for collage display
const collageProducts = [
  {
    id: 1,
    name: "Navy Tennis Bag",
    price: 3299,
    image: newNavyTennisBag,
    category: "tennis"
  },
  {
    id: 6,
    name: "Grounded Tan Backpack",
    price: 1999,
    image: brownBackpack,
    category: "business"
  },
  {
    id: 31,
    name: "Grounded Tan Backpack - Gold Zip",
    price: 1999,
    image: groundedGoldZip,
    category: "business"
  },
  {
    id: 32,
    name: "Timeless White BackPack - Rosegold Zip",
    price: 1899,
    image: timelessWhiteRoseGold,
    category: "business"
  },
  {
    id: 2,
    name: "Cream Crossbody",
    price: 1100,
    image: creamCrossbody,
    category: "leisure"
  },
  {
    id: 33,
    name: "Navy Crossbody",
    price: 1100,
    image: navySideBag,
    category: "leisure"
  },
  {
    id: 4,
    name: "Classic Travel Bag - Navy",
    price: 2499,
    image: navyRoseGoldBackpack,
    category: "travel"
  },
  {
    id: 5,
    name: "Classic Travel Bag - Tan",
    price: 2499,
    image: tanBackpack,
    category: "travel"
  },
  {
    id: 3,
    name: "Timeless White Backpack",
    price: 1899,
    image: whiteBackpack,
    category: "business"
  },
  {
    id: 7,
    name: "Retro Navy Backpack",
    price: 2399,
    image: navyModernBackpack,
    category: "business"
  },
  {
    id: 8,
    name: "Retro Olive Backpack",
    price: 2399,
    image: oliveBackpack,
    category: "business"
  },
  {
    id: 9,
    name: "White Tennis Bag",
    price: 3299,
    image: whiteTennisBag,
    category: "tennis"
  },
  {
    id: 27,
    name: "Grounded Tan Backpack",
    price: 1999,
    image: brownBackpack,
    category: "onboarding"
  },
  {
    id: 28,
    name: "Retro Navy Backpack",
    price: 2399,
    image: navyModernBackpack,
    category: "onboarding"
  },
  {
    id: 29,
    name: "Retro Olive Backpack",
    price: 2399,
    image: oliveBackpack,
    category: "onboarding"
  },
  {
    id: 30,
    name: "Timeless White Backpack",
    price: 1899,
    image: whiteBackpack,
    category: "onboarding"
  },
  {
    id: 12,
    name: "Laptop Sleeve - Tan",
    price: 1100,
    image: tanLaptopSleeve,
    images: [tanLaptopSleeve, tanLaptopSleeve2, tanLaptopSleeve3],
    category: "onboarding"
  },
  {
    id: 38,
    name: "Laptop Sleeve - Navy",
    price: 1100,
    image: navyLaptopSleeve,
    images: [navyLaptopSleeve, navyLaptopSleeve2, navyLaptopSleeve3],
    category: "onboarding"
  },
  {
    id: 15,
    name: "Desk Mats",
    price: 899,
    image: "/placeholder-desk-mats.jpg",
    category: "onboarding"
  },
  {
    id: 10,
    name: "Company Leather Bag Tag",
    price: 250,
    image: welcomeTag,
    category: "onboarding",
    description: "Onboarding welcome message embossed on Luggage tag"
  },
  {
    id: 13,
    name: "The Perfect Onboarding Package",
    price: 3180,
    image: brownBackpack,
    category: "onboarding",
    isPackage: true,
    packageItems: [
      {
        name: "Grounded Tan Backpack",
        image: brownBackpack,
        size: "large"
      },
      {
        name: "Laptop Sleeve",
        images: [tanLaptopSleeve, tanLaptopSleeve2, tanLaptopSleeve3],
        size: "small"
      },
      {
        name: "Company Leather Bag Tag",
        image: welcomeTag,
        size: "small"
      }
    ]
  },
  {
    id: 14,
    name: "The Perfect Onboarding Package 2",
    price: 4399,
    image: navyModernBackpack,
    category: "onboarding",
    isPackage: true,
    packageItems: [
      {
        name: "Retro Range Bag",
        image: navyModernBackpack,
        size: "medium"
      },
      {
        name: "Laptop Sleeve",
        images: [tanLaptopSleeve, tanLaptopSleeve2, tanLaptopSleeve3],
        size: "medium"
      },
      {
        name: "Desk Mat",
        image: "/placeholder-desk-mat.jpg",
        size: "medium"
      },
      {
        name: "Company Leather Bag Tag",
        image: welcomeTag,
        size: "medium"
      }
    ]
  },
  {
    id: 17,
    name: "Laptop Sleeve - Tan",
    price: 1100,
    image: tanLaptopSleeve,
    images: [tanLaptopSleeve, tanLaptopSleeve2, tanLaptopSleeve3],
    category: "accessories"
  },
  {
    id: 18,
    name: "Laptop Sleeve - Navy",
    price: 1100,
    image: navyLaptopSleeve,
    images: [navyLaptopSleeve, navyLaptopSleeve2, navyLaptopSleeve3],
    category: "accessories"
  },
  {
    id: 20,
    name: "Desk Mat - Tan",
    price: 899,
    image: "/placeholder-desk-mat-tan.jpg",
    category: "accessories"
  },
  {
    id: 21,
    name: "Desk Mat - Olive",
    price: 899,
    image: "/placeholder-desk-mat-olive.jpg",
    category: "accessories"
  },
  {
    id: 22,
    name: "Desk Mat - Navy",
    price: 899,
    image: "/placeholder-desk-mat-navy.jpg",
    category: "accessories"
  },
  {
    id: 24,
    name: "Wine Bottle Bag",
    price: 900,
    image: wineBagWithBottles,
    category: "gifting"
  },
  {
    id: 23,
    name: "Leather Luggage Tags",
    price: 150,
    image: welcomeTag,
    category: "accessories"
  },
  // Gifting category products (duplicates from other categories)
  // Laptop bags for gifting
  {
    id: 1006,
    name: "Grounded Tan Backpack",
    price: 1999,
    image: brownBackpack,
    category: "gifting",
    colors: ["tan"]
  },
  {
    id: 1031,
    name: "Grounded Tan Backpack - Gold Zip",
    price: 1999,
    image: groundedGoldZip,
    category: "gifting",
    colors: ["tan"]
  },
  {
    id: 1032,
    name: "Timeless White BackPack - Rosegold Zip",
    price: 1899,
    image: timelessWhiteRoseGold,
    category: "gifting",
    colors: ["white"]
  },
  {
    id: 1003,
    name: "Timeless White Backpack",
    price: 1899,
    image: whiteBackpack,
    category: "gifting",
    colors: ["white"]
  },
  {
    id: 1007,
    name: "Retro Navy Backpack",
    price: 2399,
    image: navyModernBackpack,
    category: "gifting",
    colors: ["navy"]
  },
  {
    id: 1008,
    name: "Retro Olive Backpack",
    price: 2399,
    image: oliveBackpack,
    category: "gifting",
    colors: ["olive"]
  },
  // Travel bags for gifting
  {
    id: 1004,
    name: "Classic Travel Bag - Navy",
    price: 2499,
    image: navyRoseGoldBackpack,
    category: "gifting",
    colors: ["navy"]
  },
  {
    id: 1005,
    name: "Classic Travel Bag - Tan",
    price: 2499,
    image: tanBackpack,
    category: "gifting",
    colors: ["tan"]
  },
  // Laptop sleeves for gifting
  {
    id: 1017,
    name: "Laptop Sleeve - Tan",
    price: 1100,
    image: tanLaptopSleeve,
    images: [tanLaptopSleeve, tanLaptopSleeve2, tanLaptopSleeve3],
    category: "gifting",
    colors: ["tan"]
  },
  {
    id: 1018,
    name: "Laptop Sleeve - Navy",
    price: 1100,
    image: navyLaptopSleeve,
    images: [navyLaptopSleeve, navyLaptopSleeve2, navyLaptopSleeve3],
    category: "gifting",
    colors: ["navy"]
  },
  // Crossover bags for gifting
  {
    id: 1002,
    name: "Cream Crossbody",
    price: 1100,
    image: creamCrossbody,
    category: "gifting",
    colors: ["cream"]
  },
  {
    id: 1033,
    name: "Navy Crossbody",
    price: 1100,
    image: navySideBag,
    category: "gifting",
    colors: ["navy"]
  },
  // Desk mats for gifting
  {
    id: 1020,
    name: "Desk Mat - Tan",
    price: 899,
    image: "/placeholder-desk-mat-tan.jpg",
    category: "gifting",
    colors: ["tan"]
  },
  {
    id: 1021,
    name: "Desk Mat - Olive",
    price: 899,
    image: "/placeholder-desk-mat-olive.jpg",
    category: "gifting",
    colors: ["olive"]
  },
  {
    id: 1022,
    name: "Desk Mat - Navy",
    price: 899,
    image: "/placeholder-desk-mat-navy.jpg",
    category: "gifting",
    colors: ["navy"]
  },
  // Leather luggage tags for gifting
  {
    id: 1023,
    name: "Leather Luggage Tags",
    price: 150,
    image: welcomeTag,
    category: "gifting"
  },
  // Company leather bag tag (named picture option) for gifting
  {
    id: 1010,
    name: "Company Leather Bag Tag",
    price: 250,
    image: welcomeTag,
    category: "gifting",
    description: "Onboarding welcome message embossed on Luggage tag"
  }
];

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
  const [location, setLocation] = useLocation();
  const [priceRange, setPriceRange] = useState([0, 6000]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // State that tracks current category from URL
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('category') || 'work';
  });

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
      const searchParams = new URLSearchParams(window.location.search);
      const category = searchParams.get('category') || 'work';
      setSelectedCategory(category);
    };

    // Update immediately
    updateCategoryFromURL();

    // Listen for browser back/forward navigation
    const handleLocationChange = () => {
      updateCategoryFromURL();
    };

    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [location]);

  // Generate dynamic SEO content based on category
  // Package Item Component for cycling images within package
  const PackageItem = ({ item, isPackage2 = false }: { item: any, isPackage2?: boolean }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const timerRef = useRef<number | null>(null);
    
    const hasImages = Array.isArray(item.images) && item.images.length > 1;
    const currentImage = hasImages ? item.images[currentImageIndex] : item.image;
    
    const startCycling = () => {
      if (!hasImages) return;
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = window.setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
      }, 900);
    };
    
    const stopCycling = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    
    const handleImageClick = (e: React.MouseEvent | React.TouchEvent) => {
      if (hasImages) {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
      }
    };
    
    useEffect(() => {
      return () => {
        stopCycling();
      };
    }, []);
    
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
            {item.images.map((_: any, index: number) => (
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
  const ProductTile = ({ product, onAddToCart }: { product: any, onAddToCart: (product: any) => void }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const timerRef = useRef<number | null>(null);
    
    const hasGallery = Array.isArray(product.images) && product.images.length > 1;
    const currentImage = hasGallery ? product.images[currentImageIndex] : product.image;
    
    const startCycling = () => {
      if (!hasGallery) return;
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = window.setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 900);
    };
    
    const stopCycling = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    
    const handleImageClick = (e: React.MouseEvent | React.TouchEvent) => {
      if (hasGallery) {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }
    };
    
    useEffect(() => {
      return () => {
        stopCycling();
      };
    }, []);
    
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
              {product.images.map((_: any, index: number) => (
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
  }, [location]);

  const { addToCart } = useCart();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', selectedCategory],
    enabled: !!selectedCategory,
  });

  // Filter products based on category and price
  const filteredCollageProducts = collageProducts.filter((product) => {
    // Use URL category as single source of truth
    const targetCategory = categoryMapping[selectedCategory] || selectedCategory;
    
    const matchesCategory = product.category === targetCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });


  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setLocation(`/browse?category=${categoryId}`);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setPriceRange([priceRange[0], value]);
  };

  const handleAddToCart = (product: any) => {
    // Check if this is a package that needs customization
    if (product.isPackage && (product.id === 13 || product.id === 14)) {
      setSelectedProduct(product);
      
      // Reset customization state based on package
      if (product.id === 13) {
        // Package 1: laptop bag color choice
        setSelectedColor('tan');
        setIncludeEmbossing(false);
        setEmbossingText("");
      } else if (product.id === 14) {
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

    // Convert collage product to proper Product schema format (this code now unreachable)
    const fullProduct: Product = {
      id: product.id,
      name: product.name,
      description: product.description || `Premium handcrafted ${product.category} bag from Johannesburg`,
      longDescription: `Meticulously crafted in our Johannesburg workshop, this ${product.name.toLowerCase()} represents the perfect blend of South African craftsmanship and modern design.`,
      price: product.price,
      originalPrice: null,
      rating: 5,
      reviewCount: 12,
      inStock: true,
      badge: "Signature",
      category: product.category,
      colors: ["natural", "cognac"],
      features: ["Premium leather", "Handcrafted", "Made in Johannesburg"],
      images: product.images ?? [product.image], // Use images array if available, fallback to single image
      materials: "Premium Italian leather",
      dimensions: "40cm x 30cm x 15cm",
      careInstructions: "Clean with leather conditioner, avoid water",
      featured: true,
      createdAt: new Date()
    };
    addToCart(fullProduct, 1);
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
      originalPrice: null,
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-20 pointer-events-none mix-blend-multiply"
          style={{
            backgroundImage: `url(${johannesburgSkyline})`
          }}
        ></div>
      </div>
      <Seo 
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        url={`/browse${location.includes('?') ? '?' + location.split('?')[1] : ''}`}
        image=""
      />
      {/* Breadcrumb Navigation */}
      <div className="px-4 md:px-6 py-4 text-sm text-white/70 max-w-full">
        <div className="flex items-center flex-wrap">
          <Link href="/" className="hover:text-white flex-shrink-0">Home</Link>
          <span className="mx-2 flex-shrink-0">&gt;</span>
          <span className="text-white capitalize truncate">{selectedCategory}</span>
        </div>
      </div>

      {/* Top Category Navigation Tabs - Mobile Friendly */}
      <div className="px-4 md:px-6 mb-8">
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
              {filteredCollageProducts.map((product) => (
                <ProductTile
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {filteredCollageProducts.length === 0 && (
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
              {selectedProduct?.id === 13 
                ? "Choose your laptop bag color and add optional embossing to personalize your package."
                : selectedProduct?.id === 14
                ? "Choose your bag and sleeve colors, plus add optional embossing to personalize your package."
                : selectedProduct?.colors && selectedProduct.colors.length > 0
                ? "Choose your color and add optional embossing to personalize your product."
                : "Add optional embossing to personalize your product."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Package 1 Color Selection */}
            {selectedProduct?.id === 13 && (
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
            {selectedProduct?.id === 14 && (
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