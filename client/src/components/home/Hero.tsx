import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";
import newHeroBg from '@assets/image_1757230274214.png';
import groundedBag from '@assets/LGM_Grounded (1)_1757318142201.png';
import styledLaptopBag from '@assets/LGM_Styled_1757318531199.png';
import navyTennisBag from '@assets/Navy Tennis bag_1757319259444.png';
import navyRetroBag from '@assets/Retro Range - Navy Blue_1757319569359.png';
import whiteTennisBag from '@assets/Tennis Bag on Clay Court_1757320190792.png';
import whiteTennisBagBrowse from '@assets/Tennis bag - White - neutral background_1757403947038.png';
import creamCrossbodyBrowse from '@assets/ChatGPT Image Sep 9, 2025, 06_31_47 AM_1757403283997.png';
import tanBackpackBrowse from '@assets/LGM_Classic_me (1)_1757403284001.png';
import classicBackpack from '@assets/LGM_Classic_me_1757337982042.png';
import navyRoseGoldBackpack from '@assets/Classic range - Rose Gold_1757338766199.png';
import tanBusinessBag from '@assets/LGM_Grounded (1) (1)_1757354457354.png';
import navyBusinessBag from '@assets/ChatGPT Image Sep 5, 2025, 05_34_17 PM_1757354728267.png';
import whiteBusinessBag from '@assets/ChatGPT Image Jul 25, 2025, 05_27_55 PM_1757354752545.png';
import navyTennisBagNew from '@assets/Navy Tennis bag_1757355605958.png';
import navyTravelBackpack from '@assets/Classic range - Rose Gold_1757356095029.png';
import tanTravelBackpack from '@assets/LGM_Classic_me_1757356445165.png';
import creamHipBag from '@assets/LGM_hip_1757356807770.png';
import hipBagSolo from '@assets/LGM_hip_1757357579607.png';
import hipBagLifestyle from '@assets/ChatGPT Image Jul 25, 2025, 06_02_21 PM_1757357619873.png';
import newWhiteTennisBag from '@assets/Tennis bag - White - neutral background_1758110253206.png';
import newNavyTennisBag from '@assets/Navy sports back - neutral background_1758112268197.png';
import newClassicNavyBag from '@assets/Copy of Classic range - Rose Gold_1758112410766.png';
import newClassicTanBag from '@assets/LGM_Classic_me (1)_1758112410768.png';
import navyGoldZipBag from '@assets/Retro range - Navy with gold zip_1758113011142.png';
import newGroundedBag from '@assets/ChatGPT Image Sep 17, 2025, 03_24_36 PM_1758115521218.png';
import timelessRoseGoldBag from '@assets/Timeless Range - Rose Gold zip_1758117345340.png';

const Hero = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [retroImageIndex, setRetroImageIndex] = useState(0);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const [isGroundedHovered, setIsGroundedHovered] = useState(false);
  const [isTimelessHovered, setIsTimelessHovered] = useState(false);

  const retroImages = [
    { src: "/images/green-backpack.jpg", alt: "Retro Backpack - Olive" },
    { src: navyRetroBag, alt: "Retro Backpack - Navy" },
    { src: navyGoldZipBag, alt: "Retro Backpack - Navy with Gold Zip" }
  ];

  const handleRetroHover = () => {
    if (hoverTimer) clearInterval(hoverTimer);
    
    const timer = setInterval(() => {
      setRetroImageIndex((prev) => (prev + 1) % retroImages.length);
    }, 800); // Switch every 800ms
    
    setHoverTimer(timer);
  };

  const handleRetroLeave = () => {
    if (hoverTimer) {
      clearInterval(hoverTimer);
      setHoverTimer(null);
    }
    setRetroImageIndex(0); // Reset to first image
  };
  
  const [currentBusinessBag, setCurrentBusinessBag] = useState(0);
  const [currentSportsBag, setCurrentSportsBag] = useState(0);
  const [currentTravelBag, setCurrentTravelBag] = useState(0);
  const [currentLeisureBag, setCurrentLeisureBag] = useState(0);
  const [currentLeisureRange, setCurrentLeisureRange] = useState(0);
  const [isBusinessHovered, setIsBusinessHovered] = useState(false);
  const [isSportsHovered, setIsSportsHovered] = useState(false);
  const [isTravelHovered, setIsTravelHovered] = useState(false);
  const [isLeisureHovered, setIsLeisureHovered] = useState(false);
  const [isLeisureRangeHovered, setIsLeisureRangeHovered] = useState(false);

  // Helper function to create Product objects that match the schema
  const createProduct = (id: number, name: string, price: number, image: string, category: string): Product => ({
    id,
    name,
    description: `Premium handcrafted ${category} bag from Johannesburg`,
    longDescription: `Meticulously crafted in our Johannesburg workshop, this ${name.toLowerCase()} represents the perfect blend of South African craftsmanship and modern design. Each piece is made with premium materials and attention to detail.`,
    price,
    originalPrice: null,
    rating: 5,
    reviewCount: 12,
    inStock: true,
    badge: "Signature",
    category,
    colors: ["natural", "cognac"],
    features: ["Premium leather", "Handcrafted", "Made in Johannesburg"],
    images: [image],
    materials: "Premium Italian leather",
    dimensions: "40cm x 30cm x 15cm",
    careInstructions: "Clean with leather conditioner, avoid water",
    featured: true,
    createdAt: new Date()
  });

  // Handle Add to Cart with toast notification
  const handleAddToCart = (productName: string, price: number, image: string, category: string, productId: number = Date.now()) => {
    const product = createProduct(productId, productName, price, image, category);
    addToCart(product, 1);
    toast({
      title: "Added to Cart",
      description: `${productName} has been added to your cart.`,
    });
  };
  
  const businessBags = [
    { src: "/images/green-backpack.jpg", alt: "Business Collection - Olive" },
    { src: tanBusinessBag, alt: "Business Collection - Tan" },
    { src: navyBusinessBag, alt: "Business Collection - Navy" },
    { src: whiteBusinessBag, alt: "Business Collection - White" }
  ];

  const sportsBags = [
    { src: whiteTennisBag, alt: "Sports Collection - White" },
    { src: newNavyTennisBag, alt: "Sports Collection - Navy" }
  ];

  const travelBags = [
    { src: tanTravelBackpack, alt: "Travel Collection - Tan" },
    { src: navyTravelBackpack, alt: "Travel Collection - Navy" }
  ];

  const leisureBags = [
    { src: "/images/crossbody-cream.jpg", alt: "Leisure Collection - Crossbody" },
    { src: creamHipBag, alt: "Leisure Collection - Hip Bag" }
  ];

  const leisureRangeBags = [
    { src: hipBagSolo, alt: "Leisure Range - Hip Bag Solo" },
    { src: hipBagLifestyle, alt: "Leisure Range - Hip Bag Lifestyle" }
  ];

  useEffect(() => {
    let businessInterval: NodeJS.Timeout | null = null;
    
    if (isBusinessHovered) {
      businessInterval = setInterval(() => {
        setCurrentBusinessBag((prev) => (prev + 1) % businessBags.length);
      }, 1500);
    } else {
      setCurrentBusinessBag(0); // Reset to first image when not hovering
    }

    return () => {
      if (businessInterval) clearInterval(businessInterval);
    };
  }, [isBusinessHovered, businessBags.length]);

  useEffect(() => {
    let sportsInterval: NodeJS.Timeout | null = null;
    
    if (isSportsHovered) {
      sportsInterval = setInterval(() => {
        setCurrentSportsBag((prev) => (prev + 1) % sportsBags.length);
      }, 1500);
    } else {
      setCurrentSportsBag(0); // Reset to first image when not hovering
    }

    return () => {
      if (sportsInterval) clearInterval(sportsInterval);
    };
  }, [isSportsHovered, sportsBags.length]);

  useEffect(() => {
    let travelInterval: NodeJS.Timeout | null = null;
    
    if (isTravelHovered) {
      travelInterval = setInterval(() => {
        setCurrentTravelBag((prev) => (prev + 1) % travelBags.length);
      }, 1500);
    } else {
      setCurrentTravelBag(0); // Reset to first image when not hovering
    }

    return () => {
      if (travelInterval) clearInterval(travelInterval);
    };
  }, [isTravelHovered, travelBags.length]);

  useEffect(() => {
    let leisureInterval: NodeJS.Timeout | null = null;
    
    if (isLeisureHovered) {
      leisureInterval = setInterval(() => {
        setCurrentLeisureBag((prev) => (prev + 1) % leisureBags.length);
      }, 1500);
    } else {
      setCurrentLeisureBag(0); // Reset to first image when not hovering
    }

    return () => {
      if (leisureInterval) clearInterval(leisureInterval);
    };
  }, [isLeisureHovered, leisureBags.length]);

  useEffect(() => {
    let leisureRangeInterval: NodeJS.Timeout | null = null;
    
    if (isLeisureRangeHovered) {
      leisureRangeInterval = setInterval(() => {
        setCurrentLeisureRange((prev) => (prev + 1) % leisureRangeBags.length);
      }, 1500);
    } else {
      setCurrentLeisureRange(0); // Reset to first image when not hovering
    }

    return () => {
      if (leisureRangeInterval) clearInterval(leisureRangeInterval);
    };
  }, [isLeisureRangeHovered, leisureRangeBags.length]);

  return (
    <div className="relative">
      {/* Clean Hero Section with Background Image */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] md:h-[85vh] flex items-center overflow-hidden pt-16 md:pt-0">
        {/* Background Image */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${newHeroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}></div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/15"></div>
        
        {/* Navigation Bar - Mobile Responsive */}
        <div className="absolute top-4 md:top-20 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-xs sm:max-w-none px-4 sm:px-0">
          <nav className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-full px-4 sm:px-8 py-3 md:py-4 border border-white/20">
            <div className="flex flex-wrap sm:flex-nowrap justify-center gap-2 sm:gap-4 md:gap-8 text-xs sm:text-sm font-medium">
              <Link href="/browse?category=work" className="text-white hover:text-stone-200 transition-colors duration-200 px-2 sm:px-4 py-2 rounded-full hover:bg-white/10 whitespace-nowrap">
                Work
              </Link>
              <Link href="/browse?category=leisure" className="text-white hover:text-stone-200 transition-colors duration-200 px-2 sm:px-4 py-2 rounded-full hover:bg-white/10 whitespace-nowrap">
                Leisure
              </Link>
              <Link href="/browse?category=sport" className="text-white hover:text-stone-200 transition-colors duration-200 px-2 sm:px-4 py-2 rounded-full hover:bg-white/10 whitespace-nowrap">
                Sport
              </Link>
              <Link href="/browse?category=travel" className="text-white hover:text-stone-200 transition-colors duration-200 px-2 sm:px-4 py-2 rounded-full hover:bg-white/10 whitespace-nowrap">
                Travel
              </Link>
              <Link href="/browse?category=accessories" className="text-white hover:text-stone-200 transition-colors duration-200 px-2 sm:px-4 py-2 rounded-full hover:bg-white/10 whitespace-nowrap">
                Access
              </Link>
            </div>
          </nav>
        </div>
        
        
        {/* Central Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-xs sm:max-w-xl md:max-w-4xl mx-auto space-y-6 md:space-y-8 mt-16 sm:mt-20 md:mt-0">
            <p className="text-lg sm:text-xl lg:text-2xl text-stone-200 leading-relaxed max-w-xl md:max-w-2xl mx-auto">
              Handcrafted, beautiful and affordable bags
            </p>
            <Link href="/browse?category=work" className="inline-block bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white px-6 sm:px-10 py-3 md:py-4 text-base md:text-lg font-semibold rounded-md hover:bg-white/15 hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[44px] flex items-center">
              Shop Bags
            </Link>
          </div>
        </div>
        
      </section>

      {/* Our Ranges Section */}
      <section className="py-12" style={{backgroundColor: '#F5F1E8'}}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-georgia-bold text-botanical mb-4">Our Ranges</h2>
            <Link href="/browse?category=work" className="bg-botanical text-white px-8 py-3 font-semibold hover:bg-botanical/90 transition-colors rounded-lg">
              Shop All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <Link 
              href="/browse?category=work" 
              className="group cursor-pointer block"
              onMouseEnter={handleRetroHover}
              onMouseLeave={handleRetroLeave}
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                {retroImages.map((image, index) => (
                  <img 
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    className={`w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 ${
                      index === retroImageIndex ? 'opacity-100' : 'opacity-0'
                    } ${index === 0 ? 'relative' : 'absolute inset-0'}`}
                    style={{ imageRendering: 'auto' }}
                  />
                ))}

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart("Retro Backpack", 2399, retroImages[retroImageIndex].src, "business", 201);
                    }}
                    data-testid="button-add-to-cart-retro-backpack"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="text-lg text-botanical mb-2">Retro Range</h3>
              <p className="text-gray-600 text-sm mb-2">Bring the retro style to your laptop bag</p>
              <p className="font-bold text-black">R2399</p>
            </Link>
            
            <Link 
              href="/browse?category=leisure"
              className="group cursor-pointer block"
              onMouseEnter={() => setIsLeisureRangeHovered(true)}
              onMouseLeave={() => setIsLeisureRangeHovered(false)}
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                {leisureRangeBags.map((bag, index) => (
                  <img 
                    key={index}
                    src={bag.src}
                    alt={bag.alt}
                    className={`w-full h-80 object-cover transition-opacity duration-500 ${
                      index === currentLeisureRange ? 'opacity-100' : 'opacity-0 absolute inset-0'
                    }`}
                    style={{ imageRendering: 'auto' }}
                  />
                ))}

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart("Hip Bag", 799, hipBagSolo, "leisure", 202);
                    }}
                    data-testid="button-add-to-cart-hip-bag"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="text-lg text-botanical mb-2">Leisure Range</h3>
              <p className="text-gray-600 text-sm mb-2">Elegant everyday bag</p>
              <p className="font-bold text-black">Price R799</p>
            </Link>
            
            <Link href="/browse?category=sport" className="group cursor-pointer block">
              <div className="relative overflow-hidden rounded-xl mb-4">
                {/* Navy color (default) */}
                <img 
                  src={newNavyTennisBag}
                  alt="Tennis Sports Bag - Navy"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 group-hover:opacity-0"
                  style={{ imageRendering: 'auto' }}
                />
                
                {/* White color (on hover) */}
                <img 
                  src={newWhiteTennisBag}
                  alt="Tennis Sports Bag - White"
                  className="absolute inset-0 w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 opacity-0 group-hover:opacity-100"
                  style={{ imageRendering: 'auto' }}
                />

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="text-lg text-botanical mb-2">Sports Range</h3>
              <p className="text-gray-600 text-sm mb-2">Athletic gear carrier</p>
              <p className="font-bold text-black">Price R3299</p>
            </Link>
            
            <Link href="/browse?category=travel" className="group cursor-pointer block">
              <div className="relative overflow-hidden rounded-xl mb-4">
                {/* Navy color (default) */}
                <img 
                  src={newClassicNavyBag}
                  alt="Classic Backpack - Navy"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 group-hover:opacity-0"
                  style={{ imageRendering: 'auto' }}
                />
                
                {/* Tan color (on hover) */}
                <img 
                  src={newClassicTanBag}
                  alt="Classic Backpack - Tan"
                  className="absolute inset-0 w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 opacity-0 group-hover:opacity-100"
                  style={{ imageRendering: 'auto' }}
                />

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart("Classic Backpack", 2499, newClassicNavyBag, "travel", 204);
                    }}
                    data-testid="button-add-to-cart-classic-backpack"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="text-lg text-botanical mb-2">Classic Range</h3>
              <p className="text-gray-600 text-sm mb-2">Adventure companion</p>
              <p className="font-bold text-black">Price R2499</p>
            </Link>
            
            <Link 
              href="/browse?category=work" 
              className="group cursor-pointer block"
              onMouseEnter={() => setIsGroundedHovered(true)}
              onMouseLeave={() => setIsGroundedHovered(false)}
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                {/* Original Grounded bag (default) */}
                <img 
                  src={groundedBag}
                  alt="Grounded Backpack - Original"
                  className={`w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 ${isGroundedHovered ? 'opacity-0' : 'opacity-100'}`}
                  style={{
                    imageRendering: 'auto'
                  }}
                />
                
                {/* New Grounded bag with neutral background (on hover) */}
                <img 
                  src={newGroundedBag}
                  alt="Grounded Backpack - Enhanced"
                  className={`absolute inset-0 w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 ${isGroundedHovered ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    imageRendering: 'auto'
                  }}
                />

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="text-lg text-botanical mb-2">Grounded Range</h3>
              <p className="text-gray-600 text-sm mb-2">Practical everyday essentials</p>
              <p className="font-bold text-black">Price R1999</p>
            </Link>
            
            <Link 
              href="/browse?category=work" 
              className="group cursor-pointer block"
              onMouseEnter={() => setIsTimelessHovered(true)}
              onMouseLeave={() => setIsTimelessHovered(false)}
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                {/* Original Timeless bag (default) */}
                <img 
                  src={styledLaptopBag}
                  alt="Timeless Backpack - Original"
                  className={`w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 ${isTimelessHovered ? 'opacity-0' : 'opacity-100'}`}
                  style={{ imageRendering: 'auto' }}
                />
                
                {/* Rose Gold Zip bag (on hover) */}
                <img 
                  src={timelessRoseGoldBag}
                  alt="Timeless Backpack - Rose Gold Zip"
                  className={`absolute inset-0 w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 ${isTimelessHovered ? 'opacity-100' : 'opacity-0'}`}
                  style={{ imageRendering: 'auto' }}
                />

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart("Timeless Backpack", 1899, isTimelessHovered ? timelessRoseGoldBag : styledLaptopBag, "work", 205);
                    }}
                    data-testid="button-add-to-cart-timeless-backpack"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="text-lg text-botanical mb-2">Timeless Range</h3>
              <p className="text-gray-600 text-sm mb-2">Timeless style meets smart organisation, perfect for work, travel, or everyday use</p>
              <p className="font-bold text-black">Price R1899</p>
            </Link>
            
            <Link href="/browse?category=accessories" className="group cursor-pointer block">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📱</div>
                    <p className="text-sm">Sleeved Range</p>
                    <p className="text-xs">Image coming soon</p>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="text-lg text-botanical mb-2">Sleeved Range</h3>
              <p className="text-gray-600 text-sm mb-2">Switch up your laptop sleeves with these different options</p>
              <p className="font-bold text-black">Price R999</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category - Full Collage Gallery */}
      <section className="relative overflow-hidden" style={{backgroundColor: '#7A8471'}}>
        {/* Header overlay */}
        <div className="relative z-10 text-center py-16">
          <h2 className="text-4xl font-georgia-bold text-white mb-4">Discover your Movement</h2>
          <p className="text-xl text-white/80">Shop by Category</p>
        </div>
        
        {/* Mobile-Responsive Collage */}
        <div className="hidden md:grid md:grid-cols-6 md:grid-rows-2 gap-2 h-[70vh] w-full px-0">
          {/* Large left image - Business Collection */}
          <Link 
            href="/browse?category=work" 
            className="col-span-2 row-span-2 group relative overflow-hidden shadow-xl"
            onMouseEnter={() => setIsBusinessHovered(true)}
            onMouseLeave={() => setIsBusinessHovered(false)}
          >
            {businessBags.map((bag, index) => (
              <img 
                key={index}
                src={bag.src}
                alt={bag.alt}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentBusinessBag ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-lg text-white mb-2">Business</h3>
              <p className="text-lg opacity-90 text-white">Professional Excellence</p>
            </div>
          </Link>
          
          {/* Top middle - Sports (larger) */}
          <Link 
            href="/browse?category=sport" 
            className="col-span-2 row-span-1 group relative overflow-hidden shadow-xl"
            onMouseEnter={() => setIsSportsHovered(true)}
            onMouseLeave={() => setIsSportsHovered(false)}
          >
            {sportsBags.map((bag, index) => (
              <img 
                key={index}
                src={bag.src}
                alt={bag.alt}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentSportsBag ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-lg text-white mb-2">Sports</h3>
              <p className="text-base opacity-90 text-white">Athletic Performance</p>
            </div>
          </Link>
          
          {/* Top right - Leisure */}
          <Link 
            href="/browse?category=leisure" 
            className="col-span-1 row-span-1 group relative overflow-hidden shadow-xl"
            onMouseEnter={() => setIsLeisureHovered(true)}
            onMouseLeave={() => setIsLeisureHovered(false)}
          >
            {leisureBags.map((bag, index) => (
              <img 
                key={index}
                src={bag.src}
                alt={bag.alt}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentLeisureBag ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-lg text-white mb-2">Leisure</h3>
              <p className="text-base opacity-90 text-white">Elegant Comfort</p>
            </div>
          </Link>
          
          {/* Top right - Travel */}
          <Link 
            href="/browse?category=travel" 
            className="col-span-1 row-span-1 group relative overflow-hidden shadow-xl"
            onMouseEnter={() => setIsTravelHovered(true)}
            onMouseLeave={() => setIsTravelHovered(false)}
          >
            {travelBags.map((bag, index) => (
              <img 
                key={index}
                src={bag.src}
                alt={bag.alt}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentTravelBag ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-lg text-white mb-2">Travel</h3>
              <p className="text-base opacity-90 text-white">Adventure Awaits</p>
            </div>
          </Link>
          
          {/* Bottom - Bag Accessories */}
          <Link href="/browse?category=accessories" className="col-span-1 row-span-1 group relative overflow-hidden shadow-xl">
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">👜</div>
                <p className="text-sm">Accessories</p>
                <p className="text-xs opacity-70">Image coming soon</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-lg text-white mb-2">Accessories</h3>
              <p className="text-base opacity-90 text-white">Complete Your Look</p>
            </div>
          </Link>
          
          {/* Bottom - Onboarding */}
          <Link href="/browse?category=onboarding" className="col-span-1 row-span-1 group relative overflow-hidden shadow-xl">
            <div className="w-full h-full bg-gray-600 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🎨</div>
                <p className="text-sm">Onboarding</p>
                <p className="text-xs opacity-70">Image coming soon</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-lg text-white mb-2">Onboarding</h3>
              <p className="text-base opacity-90 text-white">Create a 1st class employee experience</p>
            </div>
          </Link>
          
          {/* Bottom right - Home */}
          <Link href="/" className="col-span-2 row-span-1 group relative overflow-hidden shadow-xl">
            <div className="w-full h-full bg-gray-500 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🏠</div>
                <p className="text-sm">Home</p>
                <p className="text-xs opacity-70">Image coming soon</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-lg text-white mb-2">Home</h3>
              <p className="text-base opacity-90 text-white">Essential Living</p>
            </div>
          </Link>
        </div>
        
        {/* Mobile Alternative Layout */}
        <div className="md:hidden grid grid-cols-2 gap-2 px-4">
          <Link href="/browse?category=work" className="aspect-square group relative overflow-hidden shadow-xl rounded-lg">
            <img src="/images/green-backpack.jpg" alt="Business Collection" className="w-full h-full object-cover" style={{ imageRendering: 'auto' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-sm font-semibold">Business</h3>
              <p className="text-xs opacity-90">Professional</p>
            </div>
          </Link>
          <Link href="/browse?category=sport" className="aspect-square group relative overflow-hidden shadow-xl rounded-lg">
            <img src="/images/navy-tennis-bag.jpg" alt="Sports Collection" className="w-full h-full object-cover" style={{ imageRendering: 'auto' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-sm font-semibold">Sports</h3>
              <p className="text-xs opacity-90">Athletic</p>
            </div>
          </Link>
          <Link href="/browse?category=leisure" className="aspect-square group relative overflow-hidden shadow-xl rounded-lg">
            <img src="/images/cream-crossbody.jpg" alt="Leisure Collection" className="w-full h-full object-cover" style={{ imageRendering: 'auto' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-sm font-semibold">Leisure</h3>
              <p className="text-xs opacity-90">Everyday</p>
            </div>
          </Link>
          <Link href="/browse?category=travel" className="aspect-square group relative overflow-hidden shadow-xl rounded-lg">
            <img src="/images/backpack-brown.jpg" alt="Travel Collection" className="w-full h-full object-cover" style={{ imageRendering: 'auto' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-sm font-semibold">Travel</h3>
              <p className="text-xs opacity-90">Adventure</p>
            </div>
          </Link>
        </div>
        
        <div className="py-16"></div>
      </section>


      {/* Bag Capsule Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${navyRoseGoldBackpack})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}></div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/15"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-georgia-bold text-white mb-4">Bag Capsule</h2>
          </div>
          
          {/* Button Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Gifting Capsule */}
            <Link href="/browse?category=gifting" className="flex items-center justify-center space-x-4 p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 group-hover:bg-white/30 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg text-white mb-2">Gifting Capsule</h3>
                <p className="text-white/80 text-sm mb-2">Sustainable and timeless gifts</p>
              </div>
            </Link>
            
            {/* Onboarding Capsule */}
            <Link href="/browse?category=onboarding" className="flex items-center justify-center space-x-4 p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 group-hover:bg-white/30 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg text-white mb-2">Onboarding Capsule</h3>
                <p className="text-white/80 text-sm mb-2">Create an unforgettable onboarding experience for your employees</p>
              </div>
            </Link>
          </div>
        </div>
      </section>



      {/* Instagram Gallery */}
      <section className="py-20" style={{backgroundColor: '#7A8471'}}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-georgia-bold text-white mb-4">Charna on the #Gram</h2>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1 md:gap-2">
            <div className="aspect-square overflow-hidden">
              <img src="/images/green-backpack.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" style={{ imageRendering: 'auto' }} />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src={creamCrossbodyBrowse} alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" style={{ imageRendering: 'auto' }} />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src={navyTennisBag} alt="Instagram post" className="w-full h-full object-contain hover:scale-110 transition-transform duration-300" style={{ imageRendering: 'auto' }} />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src={navyRetroBag} alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" style={{ imageRendering: 'auto' }} />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/white-backpack.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" style={{ imageRendering: 'auto' }} />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src={navyTravelBackpack} alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" style={{ imageRendering: 'auto' }} />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src={groundedBag} alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" style={{ imageRendering: 'auto' }} />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src={tanBackpackBrowse} alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" style={{ imageRendering: 'auto' }} />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src={whiteTennisBagBrowse} alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" style={{ imageRendering: 'auto' }} />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src={navyBusinessBag} alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" style={{ imageRendering: 'auto' }} />
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="https://www.instagram.com/charna.co?igsh=MXBscWkyNjQybWI2Mw%3D%3D&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-black text-white px-8 py-3 font-semibold hover:bg-botanical transition-colors duration-300"
            >
              Follow @charna.co
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;