import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { useCart } from "@/hooks/useCart";
import Seo from "@/components/layout/Seo";
import indoorGreeneryBackdrop from "@assets/Indoor Greenery Harmony_1757361807254.png";
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
    id: 2,
    name: "Cream Crossbody",
    price: 799,
    image: creamCrossbody,
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
    id: 10,
    name: "Company Leather Bag Tag",
    price: 250,
    image: "/placeholder-company-tags.jpg",
    category: "onboarding",
    description: "Onboarding welcome message embossed on Luggage tag"
  },
  {
    id: 12,
    name: "Laptop Sleeves",
    price: 999,
    image: "/placeholder-onboarding-accessories.jpg",
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
    id: 13,
    name: "The Perfect Onboarding Package",
    price: 3499,
    image: "/placeholder-full-package.jpg",
    category: "onboarding"
  },
  {
    id: 14,
    name: "The Perfect Onboarding Package 2",
    price: 4399,
    image: "/placeholder-full-package-2.jpg",
    category: "onboarding"
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
    id: 17,
    name: "Laptop Sleeve - Tan",
    price: 999,
    image: "/placeholder-laptop-sleeve-tan.jpg",
    category: "accessories"
  },
  {
    id: 18,
    name: "Laptop Sleeve - Navy",
    price: 999,
    image: "/placeholder-laptop-sleeve-navy.jpg",
    category: "accessories"
  },
  {
    id: 19,
    name: "Laptop Sleeve - Olive",
    price: 999,
    image: "/placeholder-laptop-sleeve-olive.jpg",
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
    id: 23,
    name: "Leather Luggage Tags",
    price: 150,
    image: "/placeholder-luggage-tags.jpg",
    category: "accessories"
  }
];

const categoryTabs = [
  { id: 'work', label: 'Work' },
  { id: 'leisure', label: 'Leisure' },
  { id: 'sport', label: 'Sport' },
  { id: 'travel', label: 'Travel' },
  { id: 'accessories', label: 'Accessories' },
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
  'gifting': 'onboarding' // Map gifting to onboarding products for now
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
    // Convert collage product to proper Product schema format
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
      images: [product.image], // Convert single image to array
      materials: "Premium Italian leather",
      dimensions: "40cm x 30cm x 15cm",
      careInstructions: "Clean with leather conditioner, avoid water",
      featured: true,
      createdAt: new Date()
    };
    addToCart(fullProduct, 1);
  };

  const seoContent = getSEOContent();

  return (
    <div className="min-h-screen bg-terracotta text-white pt-16 md:pt-20 overflow-x-hidden">
      <Seo 
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        url={`/browse${location.includes('?') ? '?' + location.split('?')[1] : ''}`}
        image={indoorGreeneryBackdrop}
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
          {/* Background Image for All Products Section */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
              style={{
                backgroundImage: `url(${indoorGreeneryBackdrop})`
              }}
            ></div>
            <div className="absolute inset-0 bg-black/25 pointer-events-none"></div>
          </div>
          
          {/* Content with overlay */}
          <div className="relative z-10 px-4 md:px-6 py-4 min-h-screen">

            {/* Collage Style Product Grid - Mobile Optimized */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 w-full">
              {filteredCollageProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 w-full"
                >
                  <div className="aspect-square overflow-hidden relative w-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className={`w-full h-full ${product.name === "Navy Tennis Bag" ? "object-contain" : "object-cover"} group-hover:scale-110 transition-transform duration-500`}
                      style={{
                        imageRendering: 'auto'
                      }}
                      sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                  
                  <div className="p-3 sm:p-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
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
    </div>
  );
}