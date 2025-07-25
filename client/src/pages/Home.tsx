import Hero from "@/components/home/Hero";
import ProductTabs from "@/components/home/ProductTabs";
import { useEffect } from "react";

const Home = () => {
  // Set page title
  useEffect(() => {
    document.title = "LIGREMO | Premium Leather Bags Made in South Africa";
  }, []);

  return (
    <div className="bg-white">
      <Hero />
      <ProductTabs />
    </div>
  );
};

export default Home;
