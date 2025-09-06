import Hero from "@/components/home/Hero";
import { useEffect } from "react";

const Home = () => {
  // Set page title
  useEffect(() => {
    document.title = "LGM | Premium Leather Bags Made in South Africa";
  }, []);

  return (
    <div className="bg-white">
      <Hero />
    </div>
  );
};

export default Home;
