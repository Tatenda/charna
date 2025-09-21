import Seo from "@/components/layout/Seo";
import { Suspense, lazy } from "react";

const OptimizedHero = lazy(() => import("@/components/home/OptimizedHero"));

const Home = () => {
  return (
    <div className="bg-white">
      <Seo 
        title="Charna | Handcrafted Leather Bags Made in South Africa"
        description="Discover Charna's premium handcrafted leather bags made in Johannesburg, South Africa. From work backpacks to tennis bags, our artisan-crafted collection combines traditional South African craftsmanship with modern design."
        keywords="handcrafted leather bags, South Africa leather goods, Johannesburg artisan bags, premium leather backpacks, tennis bags, work bags, travel bags, handmade bags"
        image="/images/hero-background.png"
        url="/"
      />
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-botanical border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
            <p className="text-botanical font-medium text-lg">Loading your bags...</p>
          </div>
        </div>
      }>
        <OptimizedHero />
      </Suspense>
    </div>
  );
};

export default Home;
