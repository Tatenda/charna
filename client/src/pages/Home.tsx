import Hero from "@/components/home/Hero";
import ProductTabs from "@/components/home/ProductTabs";
import NewArrivals from "@/components/home/NewArrivals";
import { useEffect } from "react";

const Home = () => {
  // Set page title
  useEffect(() => {
    document.title = "LIGREMO | Premium Leather Bags Made in South Africa";
  }, []);

  return (
    <div>
      <Hero />
      <NewArrivals />
      <ProductTabs />
    </div>
  );
};

export default Home;
