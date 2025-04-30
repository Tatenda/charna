import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Product } from "@shared/schema";
import ProductGallery from "@/components/products/ProductGallery";
import ProductDetails from "@/components/products/ProductDetails";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/products/ProductCard";
import WhatsAppBanner from "@/components/home/WhatsAppBanner";

const ProductDetail = () => {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  
  // Fetch product details
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  // Fetch related products
  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    select: (products) => 
      products
        .filter(p => p.id !== Number(id))
        .slice(0, 3),
    enabled: !!product,
  });

  // Set page title
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | LIVING GREEN MOVEMENT`;
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FontAwesomeIcon icon="exclamation-circle" className="text-5xl text-red-500 mb-4" />
        <h2 className="font-heading text-2xl font-semibold mb-4">Product Not Found</h2>
        <p className="text-neutral-light mb-6">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <button 
          onClick={() => setLocation('/products')}
          className="btn-secondary"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-secondary-light">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center text-sm">
          <button onClick={() => setLocation('/')} className="text-neutral-light hover:text-primary">
            Home
          </button>
          <FontAwesomeIcon icon="chevron-right" className="mx-2 text-xs text-neutral-light" />
          <button onClick={() => setLocation('/products')} className="text-neutral-light hover:text-primary">
            Products
          </button>
          <FontAwesomeIcon icon="chevron-right" className="mx-2 text-xs text-neutral-light" />
          <span className="text-primary font-medium">{product.name}</span>
        </div>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <ProductGallery images={product.images} name={product.name} />
          <ProductDetails product={product} />
        </div>
        
        {/* Description and Details Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="font-heading text-2xl font-semibold mb-6">Product Details</h2>
          <Separator className="mb-6" />
          
          <div className="space-y-6">
            <div>
              <h3 className="font-accent uppercase tracking-wider text-sm font-semibold mb-3">Description</h3>
              <p className="text-neutral leading-relaxed">{product.longDescription}</p>
            </div>
            
            <div>
              <h3 className="font-accent uppercase tracking-wider text-sm font-semibold mb-3">Materials</h3>
              <p className="text-neutral leading-relaxed">{product.materials}</p>
            </div>
            
            <div>
              <h3 className="font-accent uppercase tracking-wider text-sm font-semibold mb-3">Dimensions</h3>
              <p className="text-neutral leading-relaxed">{product.dimensions}</p>
            </div>
            
            <div>
              <h3 className="font-accent uppercase tracking-wider text-sm font-semibold mb-3">Care Instructions</h3>
              <p className="text-neutral leading-relaxed">{product.careInstructions}</p>
            </div>
          </div>
        </div>
        
        {/* Maker's Story */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="font-heading text-2xl font-semibold mb-6">The Maker's Story</h2>
          <Separator className="mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Leather craftsman" 
                  className="w-full aspect-square object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-heading text-xl font-semibold mb-3">Crafted by Local Artisans</h3>
              <p className="text-neutral leading-relaxed mb-4">
                Each {product.name} is meticulously handcrafted by our team of skilled artisans in our workshop in Cape Town. 
                With years of experience in traditional leatherwork, our craftspeople pour their passion into every stitch.
              </p>
              <p className="text-neutral leading-relaxed mb-4">
                The design of this bag was inspired by the vibrant energy and natural beauty of South Africa, 
                combining practical functionality with elegant aesthetics.
              </p>
              <p className="text-neutral leading-relaxed">
                By purchasing this bag, you're directly supporting local craftsmanship and helping to preserve 
                traditional skills that have been passed down through generations.
              </p>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="font-heading text-2xl font-semibold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
        
        <WhatsAppBanner />
      </div>
    </div>
  );
};

export default ProductDetail;
