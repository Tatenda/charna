import { useState, useEffect } from "react";
import Seo from "@/components/layout/Seo";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Product } from "@shared/types";
import ProductCard from "@/components/products/ProductCard";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Products = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriceRange, setPriceRange] = useState<string>("all");
  const [selectedColor, setColor] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  const searchParams = new URLSearchParams(router.asPath.split('?')[1]);
  const categoryParam = searchParams.get('category');

  // Set initial filter from URL params
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);


  // Fetch all products
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const filterProducts = (products: Product[] | undefined) => {
    if (!products) return [];
    
    return products.filter(product => {
      // Filter by category
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }
      
      // Filter by price range
      if (selectedPriceRange !== "all") {
        const [min, max] = selectedPriceRange.split("-").map(Number);
        if (max && (product.price < min || product.price > max)) {
          return false;
        }
        if (!max && product.price < min) {
          return false;
        }
      }
      
      // Filter by color
      if (selectedColor !== "all" && !product.colors.includes(selectedColor)) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Sort products
      if (sortBy === "price-asc") {
        return a.price - b.price;
      } else if (sortBy === "price-desc") {
        return b.price - a.price;
      } else if (sortBy === "newest") {
        return b.id - a.id;
      } else if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      // Default to featured
      return 0;
    });
  };

  const filteredProducts = filterProducts(products);

  return (
    <div className="soft-pink-gradient pb-16">
      <Seo 
        title="All Products | Charna - Premium Handcrafted Leather Bags"
        description="Browse Charna's complete collection of handcrafted leather bags. From work backpacks to tennis bags, discover premium leather goods made in Johannesburg, South Africa."
        keywords="Charna products, leather bags collection, handcrafted bags, South African leather goods, premium backpacks, tennis bags"
        url="/products"
      />
      <div className="product-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">
              Premium Collection
            </h1>
            <p className="text-white/90 text-xl max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated selection of handcrafted leather goods, each piece designed and made with exceptional attention to detail in Johannesburg.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block bg-white rounded-lg shadow-md p-6">
            <h2 className="font-heading text-xl font-semibold mb-4">Filters</h2>
            <Separator className="mb-4" />
            
            <div className="mb-6">
              <h3 className="font-accent text-sm uppercase tracking-wider font-semibold mb-3">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="category" 
                    value="all" 
                    checked={selectedCategory === "all"} 
                    onChange={() => setSelectedCategory("all")}
                    className="mr-2"
                  />
                  <span>All Categories</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="category" 
                    value="business" 
                    checked={selectedCategory === "business"} 
                    onChange={() => setSelectedCategory("business")}
                    className="mr-2"
                  />
                  <span>Business Bags</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="category" 
                    value="travel" 
                    checked={selectedCategory === "travel"} 
                    onChange={() => setSelectedCategory("travel")}
                    className="mr-2"
                  />
                  <span>Travel Bags</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="category" 
                    value="sport" 
                    checked={selectedCategory === "sport"} 
                    onChange={() => setSelectedCategory("sport")}
                    className="mr-2"
                  />
                  <span>Sport Bags</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="category" 
                    value="leisure" 
                    checked={selectedCategory === "leisure"} 
                    onChange={() => setSelectedCategory("leisure")}
                    className="mr-2"
                  />
                  <span>Leisure Bags</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="category" 
                    value="custom" 
                    checked={selectedCategory === "custom"} 
                    onChange={() => setSelectedCategory("custom")}
                    className="mr-2"
                  />
                  <span>Custom Bags</span>
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-accent text-sm uppercase tracking-wider font-semibold mb-3">Price Range</h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="price" 
                    value="all" 
                    checked={selectedPriceRange === "all"} 
                    onChange={() => setPriceRange("all")}
                    className="mr-2"
                  />
                  <span>All Prices</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="price" 
                    value="0-1000" 
                    checked={selectedPriceRange === "0-1000"} 
                    onChange={() => setPriceRange("0-1000")}
                    className="mr-2"
                  />
                  <span>Under R1,000</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="price" 
                    value="1000-2000" 
                    checked={selectedPriceRange === "1000-2000"} 
                    onChange={() => setPriceRange("1000-2000")}
                    className="mr-2"
                  />
                  <span>R1,000 - R2,000</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="price" 
                    value="2000-3000" 
                    checked={selectedPriceRange === "2000-3000"} 
                    onChange={() => setPriceRange("2000-3000")}
                    className="mr-2"
                  />
                  <span>R2,000 - R3,000</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="price" 
                    value="3000-" 
                    checked={selectedPriceRange === "3000-"} 
                    onChange={() => setPriceRange("3000-")}
                    className="mr-2"
                  />
                  <span>Over R3,000</span>
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-accent text-sm uppercase tracking-wider font-semibold mb-3">Color</h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="color" 
                    value="all" 
                    checked={selectedColor === "all"} 
                    onChange={() => setColor("all")}
                    className="mr-2"
                  />
                  <span>All Colors</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="color" 
                    value="white" 
                    checked={selectedColor === "white"} 
                    onChange={() => setColor("white")}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-white border border-gray-300 rounded-full mr-2"></span>
                    <span>White</span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="color" 
                    value="black" 
                    checked={selectedColor === "black"} 
                    onChange={() => setColor("black")}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-black rounded-full mr-2"></span>
                    <span>Black</span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="color" 
                    value="brown" 
                    checked={selectedColor === "brown"} 
                    onChange={() => setColor("brown")}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-amber-800 rounded-full mr-2"></span>
                    <span>Brown</span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="color" 
                    value="tan" 
                    checked={selectedColor === "tan"} 
                    onChange={() => setColor("tan")}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-amber-600 rounded-full mr-2"></span>
                    <span>Tan</span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="color" 
                    value="mustard" 
                    checked={selectedColor === "mustard"} 
                    onChange={() => setColor("mustard")}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
                    <span>Mustard</span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="color" 
                    value="green" 
                    checked={selectedColor === "green"} 
                    onChange={() => setColor("green")}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-green-600 rounded-full mr-2"></span>
                    <span>Green</span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="color" 
                    value="ivory" 
                    checked={selectedColor === "ivory"} 
                    onChange={() => setColor("ivory")}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-yellow-50 border border-gray-300 rounded-full mr-2"></span>
                    <span>Ivory</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            {/* Mobile Filters and Sort */}
            <div className="lg:hidden mb-6 flex flex-wrap gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="business">Business Bags</SelectItem>
                    <SelectItem value="travel">Travel Bags</SelectItem>
                    <SelectItem value="sport">Sport Bags</SelectItem>
                    <SelectItem value="leisure">Leisure Bags</SelectItem>
                    <SelectItem value="custom">Custom Bags</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Select value={selectedPriceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-1000">Under R1,000</SelectItem>
                    <SelectItem value="1000-2000">R1,000 - R2,000</SelectItem>
                    <SelectItem value="2000-3000">R2,000 - R3,000</SelectItem>
                    <SelectItem value="3000-">Over R3,000</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Select value={selectedColor} onValueChange={setColor}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Colors</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="tan">Tan</SelectItem>
                    <SelectItem value="mustard">Mustard</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="ivory">Ivory</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* Sort Options - All Screens */}
            <div className="flex justify-between items-center mb-6">
              <div>
                {!isLoading && !error && (
                  <p className="text-neutral-light">{filteredProducts.length} products</p>
                )}
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-sm">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="rating">Top Rated</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Products Grid */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <FontAwesomeIcon icon="exclamation-circle" className="text-4xl text-red-500 mb-4" />
                <p className="text-neutral">Sorry, we couldn't load the products. Please try again later.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <FontAwesomeIcon icon="search" className="text-4xl text-neutral-light mb-4" />
                <h3 className="font-heading text-xl font-semibold mb-2">No Products Found</h3>
                <p className="text-neutral-light">Try adjusting your filters to find what you're looking for.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
