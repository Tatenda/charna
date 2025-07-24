import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("featured");
  
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const getFeaturedProducts = () => products.slice(0, 8);
  const getBestsellingProducts = () => products.slice(2, 10);
  const getNewProducts = () => products.slice(1, 9);

  const getProductsByTab = () => {
    switch (activeTab) {
      case "bestselling":
        return getBestsellingProducts();
      case "new":
        return getNewProducts();
      default:
        return getFeaturedProducts();
    }
  };

  const tabProducts = getProductsByTab();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Free Shipping Banner */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            <em>Free</em> Shipping & Return
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Pellentesque posuere orci lobortis scelerisque blandit. Donec id tellus lacinia an, 
            tincidunt risus ac, consequat viverra auctor blanditos. Nullam aliquet vestibulum augue non varius.
          </p>
          <Link href="/shipping-returns" className="text-accent font-semibold hover:underline">
            READ MORE
          </Link>
        </div>

        {/* Product Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === "featured"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab("bestselling")}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === "bestselling"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              Bestselling
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === "new"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {tabProducts.map((product) => (
            <div key={product.id} className="group">
              <Link href={`/products/${product.id}`}>
                <div className="relative overflow-hidden rounded-lg mb-4">
                  {product.originalPrice && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
                      On Sale
                    </span>
                  )}
                  {product.featured && (
                    <span className="absolute top-2 right-2 bg-olive-600 text-white text-xs px-2 py-1 rounded z-10">
                      Featured
                    </span>
                  )}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  
                  {/* Quick Actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col gap-2">
                      <button className="bg-white text-primary px-4 py-2 text-sm font-semibold hover:bg-accent hover:text-white transition-colors">
                        Quick view
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
              
              <div className="text-center">
                <h3 className="font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <div className="flex justify-center items-center gap-2">
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      R{product.originalPrice}
                    </span>
                  )}
                  <span className="text-lg font-semibold text-primary">
                    R{product.price}
                  </span>
                </div>
                
                {/* Color Swatches */}
                {product.colors && product.colors.length > 0 && (
                  <div className="flex justify-center gap-1 mt-2">
                    {product.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;