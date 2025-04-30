import { useEffect } from "react";
import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import WhatsAppBanner from "@/components/home/WhatsAppBanner";
import { getImagePath } from "@/lib/imageUtils";

const Story = () => {
  // Set page title
  useEffect(() => {
    document.title = "Our Story | LIVING GREEN MOVEMENT";
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
            Handcrafted with purpose, rooted in South African craftsmanship and community.
          </p>
        </div>
      </div>
      
      {/* Origin Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-semibold text-primary mb-6">Our Beginning</h2>
              <div className="divider mb-6"></div>
              <p className="text-neutral mb-4 leading-relaxed">
                Living Green Movement was founded in 2018 in a small workshop in Cape Town by a third-generation leather artisan with a vision 
                to create beautiful, functional bags that celebrate South African craftsmanship while providing sustainable livelihoods for local artisans.
              </p>
              <p className="text-neutral mb-4 leading-relaxed">
                What began as a small passion project quickly grew into a thriving business as people resonated with our commitment to quality, 
                authenticity, and social responsibility.
              </p>
              <p className="text-neutral leading-relaxed">
                Today, we continue to handcraft each bag with the same dedication to quality and community, combining timeless techniques with
                modern designs that complement the lives of our customers around the world.
              </p>
            </div>
            <div>
              <img 
                src={getImagePath("/attached_assets/CreatorKit-AI (1).jpg")} 
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
              "Our mission is to preserve traditional craftsmanship while creating products that stand the test of time — in quality, design, and purpose."
            </blockquote>
            <p className="mt-4 font-accent font-semibold">— Founder, Living Green Movement</p>
          </div>
        </div>
      </section>
      
      {/* Craftspeople */}
      <section id="craftspeople" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-semibold text-primary mb-6">Meet Our Craftspeople</h2>
          <div className="divider mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src={getImagePath("/attached_assets/CreatorKit-AI (3).jpg")} 
                    alt="Master craftsman" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="font-heading text-xl font-semibold mb-2">David Ndlovu</h3>
                  <p className="text-accent font-accent text-sm uppercase tracking-wider mb-4">Master Craftsman</p>
                  <p className="text-neutral mb-4">
                    With over 25 years of experience in leatherwork, David leads our production team and oversees quality control. 
                    His expertise in traditional techniques ensures the exceptional quality of each Living Green bag.
                  </p>
                  <p className="text-neutral">
                    "I love seeing our designs come to life and knowing that each piece will become part of someone's daily journey."
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src={getImagePath("/attached_assets/CreatorKit-AI (4).jpg")} 
                    alt="Apprentice craftsperson" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="font-heading text-xl font-semibold mb-2">Thandi Dlamini</h3>
                  <p className="text-accent font-accent text-sm uppercase tracking-wider mb-4">Design Lead</p>
                  <p className="text-neutral mb-4">
                    Thandi brings a contemporary perspective to our traditional techniques. A graduate of the Cape Town Design Academy, 
                    she blends modern aesthetics with functional designs.
                  </p>
                  <p className="text-neutral">
                    "I draw inspiration from South Africa's diverse landscapes and cultures to create bags that tell a story."
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-12">
            <h3 className="font-heading text-2xl font-semibold mb-4">Our Team</h3>
            <p className="text-neutral max-w-3xl mx-auto">
              Our workshop employs 12 skilled artisans from local communities, many of whom have trained through our apprenticeship program. 
              Each team member brings their unique perspective and skill to create products we're all proud of.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <img 
              src={getImagePath("/attached_assets/CreatorKit-AI (1).jpg")} 
              alt="Workshop activity" 
              className="rounded-lg shadow-md"
            />
            <img 
              src={getImagePath("/attached_assets/CreatorKit-AI (6).jpg")} 
              alt="Leather crafting" 
              className="rounded-lg shadow-md"
            />
            <img 
              src={getImagePath("/attached_assets/CreatorKit-AI (7).jpg")} 
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
                src={getImagePath("/attached_assets/CreatorKit-AI (3).jpg")} 
                alt="Sustainable leather production" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="font-heading text-3xl font-semibold text-primary mb-6">Our Commitment to Sustainability</h2>
              <div className="divider mb-6"></div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-secondary rounded-full p-2 mr-4 mt-1">
                    <FontAwesomeIcon icon="recycle" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-accent text-lg font-semibold mb-1">Minimizing Waste</h3>
                    <p className="text-neutral">
                      We carefully plan our cutting patterns to minimize leather waste. Any scraps are repurposed into smaller products or donated to local craft initiatives.
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
                      We source our leather from suppliers who adhere to strict environmental standards and responsible water management practices.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-secondary rounded-full p-2 mr-4 mt-1">
                    <FontAwesomeIcon icon="box" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-accent text-lg font-semibold mb-1">Eco-Friendly Packaging</h3>
                    <p className="text-neutral">
                      All our products are packaged in recyclable or biodegradable materials, avoiding single-use plastics.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-secondary rounded-full p-2 mr-4 mt-1">
                    <FontAwesomeIcon icon="seedling" className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-accent text-lg font-semibold mb-1">Community Initiatives</h3>
                    <p className="text-neutral">
                      We participate in local tree-planting initiatives and support conservation efforts in the Western Cape region.
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
