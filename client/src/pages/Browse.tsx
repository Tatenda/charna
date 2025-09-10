import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { useCart } from "@/hooks/useCart";
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

// Product data for collage display
const collageProducts = [
  {
    id: 1,
    name: "Navy Tennis Bag",
    price: 3299,
    image: navyTennisBag,
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
  { id: 'accessories', label: 'Accessories' }
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
  'accessories': 'accessories'
};

export default function Browse() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const selectedCategory = searchParams.get('category') || 'work';
  const [priceRange, setPriceRange] = useState([0, 6000]);
  const [selectedBrowseCategory, setSelectedBrowseCategory] = useState('Work');

  // Sync sidebar selection with URL parameter
  useEffect(() => {
    const currentSearchParams = new URLSearchParams(location.split('?')[1] || '');
    const urlCategory = currentSearchParams.get('category');
    console.log('URL Category:', urlCategory); // Debug log
    if (urlCategory) {
      const categoryName = urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1);
      console.log('Mapped Category Name:', categoryName); // Debug log
      if (browseCategories.includes(categoryName)) {
        setSelectedBrowseCategory(categoryName);
        console.log('Setting category to:', categoryName); // Debug log
      } else {
        setSelectedBrowseCategory('Work');
        console.log('Category not found, defaulting to Work'); // Debug log
      }
    } else {
      setSelectedBrowseCategory('Work');
      console.log('No URL category, defaulting to Work'); // Debug log
    }
  }, [location]); // Re-run when location changes
  const { addToCart } = useCart();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', selectedCategory],
    enabled: !!selectedCategory,
  });

  // Filter products based on category and price
  const filteredCollageProducts = collageProducts.filter((product) => {
    // Use the sidebar category selection for filtering
    let targetCategory;
    if (selectedBrowseCategory === 'Work') {
      targetCategory = 'business';
    } else if (selectedBrowseCategory === 'Leisure') {
      targetCategory = 'leisure';
    } else if (selectedBrowseCategory === 'Sport') {
      targetCategory = 'tennis';
    } else if (selectedBrowseCategory === 'Travel') {
      targetCategory = 'travel';
    } else if (selectedBrowseCategory === 'Accessories') {
      targetCategory = 'accessories';
    } else if (selectedBrowseCategory === 'Onboarding') {
      targetCategory = 'onboarding';
    } else {
      // For URL-based categories from top tabs
      targetCategory = categoryMapping[selectedCategory] || selectedCategory;
    }
    
    console.log('Filtering - selectedBrowseCategory:', selectedBrowseCategory, 'targetCategory:', targetCategory, 'product.category:', product.category); // Debug log
    
    const matchesCategory = product.category === targetCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });
  
  console.log('Filtered products:', filteredCollageProducts.map(p => p.name)); // Debug log

  const handleCategoryChange = (categoryId: string) => {
    setLocation(`/browse?category=${categoryId}`);
    // Also update the sidebar selection to stay in sync
    const categoryName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
    if (browseCategories.includes(categoryName)) {
      setSelectedBrowseCategory(categoryName);
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setPriceRange([priceRange[0], value]);
  };

  const handleAddToCart = (product: any) => {
    // Convert collage product to cart item format
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    };
    addToCart(cartItem as any, 1);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      {/* Breadcrumb Navigation */}
      <div className="px-6 py-4 text-sm text-gray-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-white capitalize">{selectedCategory}</span>
      </div>

      {/* Top Category Navigation Tabs */}
      <div className="px-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20 inline-flex">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleCategoryChange(tab.id)}
              className={`text-sm font-medium transition-colors duration-200 px-4 py-2 rounded-full ${
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

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 px-6 py-4">
          {/* Browse by Section */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 text-white border-b border-gray-700 pb-3">
              Browse by
            </h3>
            <div className="space-y-3">
              {browseCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    if (category === 'All Products') {
                      setLocation('/browse');
                      setSelectedBrowseCategory('All Products');
                    } else {
                      const categoryId = category.toLowerCase();
                      setLocation(`/browse?category=${categoryId}`);
                      setSelectedBrowseCategory(category);
                    }
                  }}
                  className={`block w-full text-left py-2 px-3 rounded transition-colors ${
                    selectedBrowseCategory === category
                      ? 'bg-botanical text-white font-medium'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Filter by Section */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white border-b border-gray-700 pb-3">
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
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between mt-3 text-sm text-gray-400">
                  <span>R{priceRange[0]}</span>
                  <span>R{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative">
          {/* Background Image for All Products Section */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
            style={{
              backgroundImage: `url(${indoorGreeneryBackdrop})`,
              filter: 'brightness(1.7) contrast(1.1)'
            }}
          ></div>
          
          {/* Content with overlay */}
          <div className="relative z-10 px-6 py-4">

            {/* Collage Style Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCollageProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      style={{
                        filter: 'contrast(1.3) saturate(1.2) brightness(1.1) unsharp-mask(amount=120% radius=1px threshold=3)',
                        imageRendering: 'crisp-edges'
                      }}
                    />
                  </div>
                  
                  <div className="p-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="w-full border border-gray-400 text-gray-700 py-2 px-4 text-sm font-medium hover:border-gray-600 hover:text-gray-900 transition-colors duration-200 rounded mb-3"
                    >
                      Add to Cart
                    </button>
                    
                    <h3 className="text-sm text-gray-900 mb-1 font-medium">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-xs text-gray-600 mb-2">{product.description}</p>
                    )}
                    
                    <div>
                      <span className="text-gray-900 font-semibold text-sm">
                        R{product.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCollageProducts.length === 0 && (
              <div className="text-center py-20 bg-gray-800/50 backdrop-blur-sm rounded-lg">
                <h3 className="text-2xl font-bold text-gray-300 mb-4">
                  No products found
                </h3>
                <p className="text-gray-400">
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