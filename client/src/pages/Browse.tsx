import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { useCart } from "@/hooks/useCart";
import indoorGreeneryBackdrop from "@assets/Indoor Greenery Harmony_1757361807254.png";

const categoryTabs = [
  { id: 'work', label: 'Work' },
  { id: 'leisure', label: 'Leisure' },
  { id: 'sport', label: 'Sport' },
  { id: 'travel', label: 'Travel' },
  { id: 'accessories', label: 'Accessories' }
];

const browseCategories = [
  'All Products',
  'New Arrivals',
  'Work',
  'Leisure',
  'Sport',
  'Travel',
  'Accessories',
  'Ranges',
  'Onboarding',
  'Gifting',
  'Customised'
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
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedBrowseCategory, setSelectedBrowseCategory] = useState('All Products');

  // Sync sidebar selection with URL parameter
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      const categoryName = urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1);
      if (browseCategories.includes(categoryName)) {
        setSelectedBrowseCategory(categoryName);
      }
    } else {
      setSelectedBrowseCategory('All Products');
    }
  }, [location]); // Re-run when location changes
  const { addToCart } = useCart();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', selectedCategory],
    enabled: !!selectedCategory,
  });

  const filteredProducts = products.filter((product: Product) => {
    // Map the selected category to the actual product category
    const actualCategory = categoryMapping[selectedCategory] || selectedCategory;
    const matchesCategory = selectedCategory === 'all' || product.category === actualCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  const handleCategoryChange = (categoryId: string) => {
    setLocation(`/browse?category=${categoryId}`);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setPriceRange([priceRange[0], value]);
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
            <h3 className="text-xl font-georgia-bold mb-6 text-white border-b border-gray-700 pb-3">
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
            <h3 className="text-xl font-georgia-bold mb-6 text-white border-b border-gray-700 pb-3">
              Filter by
            </h3>
            
            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="text-white mb-4 font-medium">Price</h4>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="2000"
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
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{
              backgroundImage: `url(${indoorGreeneryBackdrop})`,
              filter: 'brightness(1.3) contrast(0.9)'
            }}
          ></div>
          
          {/* Content with overlay */}
          <div className="relative z-10 px-6 py-4">
            {/* All Products Title */}
            <div className="mb-8">
              <h2 className="text-4xl font-georgia-bold text-white mb-2">All Products</h2>
              <p className="text-gray-300">Discover our full range of handcrafted leather goods</p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-700/50 backdrop-blur-sm animate-pulse rounded-lg h-96"></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product: Product) => (
                  <div
                    key={product.id}
                    className="group bg-stone-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Sale badge */}
                    {product.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-botanical text-white px-3 py-1 text-xs font-medium rounded">
                          {product.badge}
                        </span>
                      </div>
                    )}
                    
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={product.images?.[0] || '/placeholder-bag.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="p-4 bg-stone-200">
                      <h3 className="font-georgia-bold text-lg text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      
                      <div className="mb-4">
                        {product.originalPrice && product.originalPrice > product.price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 line-through text-sm">
                              R{product.originalPrice}
                            </span>
                            <span className="text-gray-900 font-bold text-lg">
                              R{product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-900 font-bold text-lg">
                            R{product.price}
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product, 1);
                        }}
                        className="w-full bg-gray-800 text-white py-3 px-4 font-medium hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-800/50 backdrop-blur-sm rounded-lg">
                <h3 className="text-2xl font-georgia-bold text-gray-300 mb-4">
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