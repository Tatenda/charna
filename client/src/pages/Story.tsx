import { useEffect } from "react";
import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import WhatsAppBanner from "@/components/home/WhatsAppBanner";
import { getImagePath } from "@/lib/imageUtils";

const Story = () => {
  // Set page title
  useEffect(() => {
    document.title = "Our Story | LIGREMO";
  }, []);

  return (
    <div className="bg-secondary-light">
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
                LIGREMO was founded with a simple vision: to create exceptional leather goods that showcase the incredible skill and artistry 
                of South African craftspeople. Our workshop in Johannesburg is where passion meets precision.
              </p>
              <p className="text-neutral mb-4 leading-relaxed">
                Every LIGREMO piece is handcrafted by skilled local artisans who bring years of experience and deep pride in their work. 
                We believe in the power of traditional craftsmanship combined with contemporary design sensibilities.
              </p>
              <p className="text-neutral leading-relaxed">
                Our leather goods represent the best of South African manufacturing – where attention to detail, quality materials, 
                and expert craftsmanship come together to create timeless pieces built to last.
              </p>
            </div>
            <div>
              <img 
                src="/images/tennis-bag-lifestyle.jpg" 
                alt="Leather craftsman at work" 
                className="rounded-lg shadow-lg w-full"
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
              "Every LIGREMO piece represents the incredible skill and dedication of our South African artisans — we're proud to showcase the exceptional craftsmanship that our country has to offer."
            </blockquote>
            <p className="mt-4 font-accent font-semibold">— Founder, LIGREMO</p>
          </div>
        </div>
      </section>
      
      {/* Craftspeople */}
      <section id="craftspeople" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-semibold text-primary mb-6">Meet Our South African Artisans</h2>
          <div className="divider mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src="/images/concetto-brand-logo.jpg" 
                    alt="Master leather craftsman" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="font-heading text-xl font-semibold mb-2">David Ndlovu</h3>
                  <p className="text-accent font-accent text-sm uppercase tracking-wider mb-4">Master Craftsman</p>
                  <p className="text-neutral mb-4">
                    With over 25 years of leatherwork experience in Johannesburg, David leads our production team with exceptional skill and dedication. 
                    His expertise ensures every piece meets our exacting standards for quality and craftsmanship.
                  </p>
                  <p className="text-neutral">
                    "Every bag represents the skill and pride of South African craftsmanship — it's an honor to create pieces that will last a lifetime."
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src="/images/tennis-bag-action.jpg" 
                    alt="Local craftsperson" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="font-heading text-xl font-semibold mb-2">Thandi Dlamini</h3>
                  <p className="text-accent font-accent text-sm uppercase tracking-wider mb-4">Design Lead</p>
                  <p className="text-neutral mb-4">
                    A University of the Witwatersrand graduate, Thandi brings fresh design perspectives to our traditional leatherwork. 
                    Her innovative approach creates pieces that blend timeless craftsmanship with contemporary South African style.
                  </p>
                  <p className="text-neutral">
                    "We're creating beautiful, functional pieces that showcase the incredible skill and creativity of our local artisans."
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-12">
            <h3 className="font-heading text-2xl font-semibold mb-4">Made in Johannesburg with Pride</h3>
            <p className="text-neutral max-w-3xl mx-auto">
              Our Johannesburg workshop employs skilled local artisans who bring generations of craftsmanship knowledge to every piece. 
              Each craftsperson demonstrates exceptional pride and precision, creating luxury leather goods that represent the finest South African workmanship.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <img 
              src="/images/work-backpack-urban.jpg" 
              alt="Workshop activity" 
              className="rounded-lg shadow-md"
            />
            <img 
              src="/images/tennis-bag-court.jpg" 
              alt="Leather crafting" 
              className="rounded-lg shadow-md"
            />
            <img 
              src="/images/tennis-bag-lifestyle.jpg" 
              alt="Leather workshop" 
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>
      
      {/* Sustainability */}
      <section id="sustainability" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/images/work-backpack-studio.jpg" 
                alt="Sustainable leather production" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="font-heading text-3xl font-semibold text-primary mb-6">Sustainable Luxury</h2>
              <div className="divider mb-6"></div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-secondary rounded-full p-2 mr-4 mt-1">
                    <FontAwesomeIcon icon="recycle" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-accent text-lg font-semibold mb-1">Zero-Waste Philosophy</h3>
                    <p className="text-neutral">
                      Our Italian artisans employ traditional cutting techniques that maximize leather utilization. Every piece is carefully planned to minimize waste while preserving the integrity of each hide.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-secondary rounded-full p-2 mr-4 mt-1">
                    <FontAwesomeIcon icon="water" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-accent text-lg font-semibold mb-1">Responsible Sourcing</h3>
                    <p className="text-neutral">
                      We source premium Italian leather from certified tanneries that follow strict environmental protocols, then craft each piece in our South African workshop using traditional techniques passed down through our family heritage.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-secondary rounded-full p-2 mr-4 mt-1">
                    <FontAwesomeIcon icon="box" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-accent text-lg font-semibold mb-1">Luxury Packaging</h3>
                    <p className="text-neutral">
                      Each Concetto piece arrives in sustainably sourced packaging that reflects our commitment to both luxury presentation and environmental responsibility.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-secondary rounded-full p-2 mr-4 mt-1">
                    <FontAwesomeIcon icon="seedling" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-accent text-lg font-semibold mb-1">Local Community Support</h3>
                    <p className="text-neutral">
                      Made in South Africa, we support local craftspeople and communities while preserving Italian family heritage. Each piece creates meaningful employment and celebrates both traditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-semibold text-primary mb-6">Experience the Living Green Difference</h2>
          <p className="text-neutral max-w-2xl mx-auto mb-8">
            When you purchase a Living Green bag, you're not just buying a product – you're supporting a movement of sustainable, 
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
