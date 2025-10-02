import Hero from "@/components/home/Hero";
import Seo from "@/components/layout/Seo";

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
      <Hero />
    </div>
  );
};

export default Home;
