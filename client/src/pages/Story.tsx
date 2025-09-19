import Seo from "@/components/layout/Seo";
import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import WhatsAppBanner from "@/components/home/WhatsAppBanner";
import { getImagePath } from "@/lib/imageUtils";
import aboutImage from "@assets/4FC44507-54B4-425D-9143-2A25663AFB6D_1758283287550.png";

const Story = () => {
  return (
    <div className="bg-secondary-light">
      <Seo 
        title="Our Story | Charna - Made in Johannesburg with Purpose"
        description="Discover the story behind Charna's handcrafted leather bags. Learn about our skilled South African artisans in Johannesburg who create premium leather goods with traditional craftsmanship and sustainable practices."
        keywords="Charna story, South African craftsmanship, Johannesburg leather workshop, artisan bags, sustainable leather goods, handmade bags South Africa"
        image="/images/tennis-bag-lifestyle.jpg"
        url="/story"
      />
      {/* Hero */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-4">
            Our Story
          </h1>
          <p className="text-white/80 text-center max-w-3xl mx-auto text-lg">
            Crafted with pride in Johannesburg. Discover the passion and skill behind our handmade leather goods.
          </p>
        </div>
      </div>
      
      {/* Origin Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-semibold text-primary mb-6">Crafted with Pride in Johannesburg</h2>
              <div className="divider mb-6"></div>
              <p className="text-neutral mb-4 leading-relaxed">
                Charna was founded with a simple vision: to create exceptional leather goods that showcase the incredible skill and artistry 
                of South African craftspeople. Our workshop in Johannesburg is where passion meets precision.
              </p>
              <p className="text-neutral mb-4 leading-relaxed">
                Every Charna piece is handcrafted by skilled local artisans who bring years of experience and deep pride in their work. 
                We believe in the power of traditional craftsmanship combined with contemporary design sensibilities.
              </p>
              <p className="text-neutral leading-relaxed">
                Our leather goods represent the best of South African manufacturing – where attention to detail, quality materials, 
                and expert craftsmanship come together to create timeless pieces built to last.
              </p>
            </div>
            <div>
              <img 
                src={aboutImage} 
                alt="Charna tennis bag with Johannesburg skyline" 
                className="rounded-lg shadow-lg w-full"
                style={{ imageRendering: 'auto' }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Values and Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-semibold text-primary">Our Values</h2>
            <div className="divider mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon="hands" className="text-primary text-2xl" />
              </div>
              <h3 className="font-accent text-xl font-semibold mb-3">Artisan Craftsmanship</h3>
              <p className="text-neutral">
                We honor traditional techniques passed down through generations, ensuring each piece is crafted with precision and care.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon="leaf" className="text-primary text-2xl" />
              </div>
              <h3 className="font-accent text-xl font-semibold mb-3">Environmental Responsibility</h3>
              <p className="text-neutral">
                We prioritize sustainable practices, minimize waste, and source materials ethically to reduce our environmental impact.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon="users" className="text-primary text-2xl" />
              </div>
              <h3 className="font-accent text-xl font-semibold mb-3">Community Empowerment</h3>
              <p className="text-neutral">
                We create fair employment opportunities and invest in skills development to support the livelihoods of local communities.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <blockquote className="text-2xl font-heading text-primary italic max-w-3xl mx-auto">
              "Every Charna piece represents the incredible skill and dedication of our South African artisans — we're proud to showcase the exceptional craftsmanship that our country has to offer."
            </blockquote>
            <p className="mt-4 font-accent font-semibold">— Founder, Charna</p>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-4">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-semibold text-primary mb-6">Experience the Charna. Difference</h2>
          <p className="text-neutral max-w-2xl mx-auto mb-8">
            When you purchase a Charna. bag, you're not just buying a product – you're supporting a movement of sustainable, 
            ethical craftsmanship and becoming part of our story.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/products" className="btn-primary">
              Shop Our Collection
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      
      <WhatsAppBanner />
    </div>
  );
};

export default Story;
