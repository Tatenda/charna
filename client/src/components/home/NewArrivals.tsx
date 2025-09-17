import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

const NewArrivals = () => {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const newProducts = products.slice(0, 8);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">New Arrivals</h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newProducts.map((product) => (
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
                      New
                    </span>
                  )}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ imageRendering: 'auto' }}
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;