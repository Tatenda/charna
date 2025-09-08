import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

const categoryTabs = [
  { id: 'work', label: 'Work' },
  { id: 'leisure', label: 'Leisure' },
  { id: 'sport', label: 'Sport' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'customised', label: 'Customised' }
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

export default function Browse() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const selectedCategory = searchParams.get('category') || 'work';
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedBrowseCategory, setSelectedBrowseCategory] = useState('All Products');

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', selectedCategory],
    enabled: !!selectedCategory,
  });

  const filteredProducts = products.filter((product: Product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
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
        <div className="bg-orange-900/20 backdrop-blur-sm rounded-2xl px-2 py-2 inline-flex">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleCategoryChange(tab.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                selectedCategory === tab.id
                  ? 'bg-orange-700 text-white shadow-lg'
                  : 'text-orange-300 hover:text-white hover:bg-orange-800/30'
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
                  onClick={() => setSelectedBrowseCategory(category)}
                  className={`block w-full text-left py-2 px-3 rounded transition-colors ${
                    selectedBrowseCategory === category
                      ? 'bg-orange-700 text-white font-medium'
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
        <div className="flex-1 px-6 py-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 animate-pulse rounded-lg h-80"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product: Product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.images?.[0] || '/placeholder-bag.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-georgia-bold text-lg text-white mb-2 group-hover:text-orange-300 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-400 font-bold text-lg">
                        R{product.price}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-georgia-bold text-gray-400 mb-4">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or browse a different category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}