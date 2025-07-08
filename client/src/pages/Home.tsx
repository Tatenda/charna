import Hero from "@/components/home/Hero";
import Values from "@/components/home/Values";
import Story from "@/components/home/Story";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";
import InstagramFeed from "@/components/home/InstagramFeed";
import WhatsAppBanner from "@/components/home/WhatsAppBanner";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "@/components/products/ProductCard";
import { Link } from "wouter";
import { useEffect } from "react";

const Home = () => {
  // Fetch featured products
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products?featured=true'],
  });

  // Set page title
  useEffect(() => {
    document.title = "LIGREMO | Made in South Africa, Made with Purpose";
  }, []);

  return (
    <>
      <Hero />
      <Values />
      
      {/* Featured Products */}
      <section id="products" className="py-16 bg-secondary-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary">Our Collection</h2>
            <div className="divider mx-auto"></div>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              Discover our handcrafted bags, designed for style and functionality.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p>Failed to load products. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products" className="btn-secondary inline-block">
              View All Products
            </Link>
          </div>
        </div>
      </section>
      
      <Story />
      <Testimonials />
      <CTABanner />
      <InstagramFeed />
      <WhatsAppBanner />
    </>
  );
};

export default Home;
