import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
import travelBackpackLifestyle from '@assets/ChatGPT Image Jul 25, 2025, 05_56_03 PM_1758206025280.png';
import embossInitials from '@assets/Embossing example_1758224006405.png';
import embossCompanyTag from '@assets/Welcome message - Christopher_1758224465167.png';
import whiteWorkBackpack from "@assets/Copy of ChatGPT Image Jul 25, 2025, 05_27_55 PM_1758225069381.png";
import brownWorkBackpack from "@assets/LGM_Grounded (1)_1758225069383.png";
import navyWorkBackpack from "@assets/Retro Range - Navy Blue_1758225069385.png";
import oliveWorkBackpack from "@assets/Retro Range - Olive_1758362124136.png";
import creamHipBag from '@assets/LGM_hip_1757356807770.png';
import hipBagSolo from '@assets/LGM_hip_1757357579607.png';
import hipBagLifestyle from '@assets/ChatGPT Image Jul 25, 2025, 06_02_21 PM_1757357619873.png';
import blueCrossbodyBag from '@assets/913E8FCD-4943-44D3-A3EF-645778762B43_1758357180594.png';
import newWhiteTennisBag from '@assets/Tennis bag - White - neutral background_1758110253206.png';
import newNavyTennisBag from '@assets/Navy sports back - neutral background_1758112268197.png';
import newClassicNavyBag from '@assets/Copy of Classic range - Rose Gold_1758112410766.png';
import newClassicTanBag from '@assets/LGM_Classic_me (1)_1758112410768.png';
import navyGoldZipBag from '@assets/Retro range - Navy with gold zip_1758113011142.png';
import newGroundedBag from '@assets/ChatGPT Image Sep 17, 2025, 03_24_36 PM_1758115521218.png';
import timelessRoseGoldBag from '@assets/Timeless Range - Rose Gold zip_1758117345340.png';
import manCarryingOliveBag from '@assets/ChatGPT Image Sep 17, 2025, 04_11_01 PM_1758118389040.png';
import newNavyBusinessBag from '@assets/ChatGPT Image Sep 17, 2025, 01_42_26 PM_1758118389041.png';
import newNavyTennisBagInstagram from '@assets/ChatGPT Image Sep 9, 2025, 06_28_09 AM_1758226256896.png';
import tanLaptopSleeve from '@assets/DF6D3DFE-6CBA-45BD-8742-1ABE450C1F7E_1758358612678.png';
import tanLaptopSleeveSide from '@assets/1FCA156B-07B9-4EB4-B6CB-90243D3F1240_1758358612678.png';
import navyLaptopSleeveSide from '@assets/73877EA7-4681-4580-9B27-19C20A7D3A10_1758358612678.png';
import navyLaptopSleeveFront from '@assets/855ABA3F-D6BD-42E0-BBA5-488FEFF9EE7E_1758358612678.png';
import ladyWithSideBag from '@assets/Lady with side bag - navy_1758383464073.png';
import gentWithTennisBag from '@assets/Gent wih tennis bag - navy _1758386562325.png';
import whiteTennisBagNew from '@assets/Tennis bag - White - neutral background_1758386577764.png';
import navyTennisBagNew2 from '@assets/Navy Tennis bag_1758386586336.png';
import wineBagWithBottles from '@assets/Wine bag - wine bottles_1758387116266.png';
import wineBagEmpty from '@assets/Wine bag_1758387116268.png';
import laptopSleeveInstagram from '@assets/DF6D3DFE-6CBA-45BD-8742-1ABE450C1F7E_1758388455051.png';

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

  const handleSleevedHover = () => {
    setIsSleevedHovered(true);
  };

  const handleSleevedLeave = () => {
    setIsSleevedHovered(false);
  };
  
  const [currentBusinessBag, setCurrentBusinessBag] = useState(0);
  const [currentSportsBag, setCurrentSportsBag] = useState(0);
  const [currentTravelBag, setCurrentTravelBag] = useState(0);
  const [currentLeisureBag, setCurrentLeisureBag] = useState(0);
  const [currentWorkBag, setCurrentWorkBag] = useState(0);
  const [currentSleevedBag, setCurrentSleevedBag] = useState(0);
  const [currentAccessoriesBag, setCurrentAccessoriesBag] = useState(0);
  const [currentOnboardingBag, setCurrentOnboardingBag] = useState(0);
  const [currentGiftsBag, setCurrentGiftsBag] = useState(0);
  const [isBusinessHovered, setIsBusinessHovered] = useState(false);
  const [isSportsHovered, setIsSportsHovered] = useState(false);
  const [isTravelHovered, setIsTravelHovered] = useState(false);
  const [isLeisureHovered, setIsLeisureHovered] = useState(false);
  const [isWorkHovered, setIsWorkHovered] = useState(false);
  const [isSleevedHovered, setIsSleevedHovered] = useState(false);
  const [isAccessoriesHovered, setIsAccessoriesHovered] = useState(false);
  const [isOnboardingHovered, setIsOnboardingHovered] = useState(false);
  const [isGiftsHovered, setIsGiftsHovered] = useState(false);

  // Color selection modal state
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

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

  // Color options for each range
  const rangeColorOptions = {
    retro: {
      name: "Retro Backpack",
      price: 2399,
      category: "business",
      colors: [
        { name: "Navy", image: navyWorkBackpack, value: "navy" },
        { name: "Olive", image: oliveWorkBackpack, value: "olive" }
      ]
    },
    leisure: {
      name: "Hip Bag",
      price: 799,
      category: "leisure",
      colors: [
        { name: "Cream", image: creamHipBag, value: "cream" },
        { name: "Blue", image: blueCrossbodyBag, value: "blue" }
      ]
    },
    sports: {
      name: "Tennis Bag",
      price: 3299,
      category: "sport",
      colors: [
        { name: "Navy", image: newNavyTennisBag, value: "navy" },
        { name: "White", image: newWhiteTennisBag, value: "white" }
      ]
    },
    classic: {
      name: "Classic Backpack",
      price: 2499,
      category: "travel",
      colors: [
        { name: "Navy", image: newClassicNavyBag, value: "navy" },
        { name: "Tan", image: newClassicTanBag, value: "tan" }
      ]
    },
    grounded: {
      name: "Grounded Backpack",
      price: 1999,
      category: "work",
      colors: [
        { name: "Original", image: groundedBag, value: "original" },
        { name: "Gold Zip", image: newGroundedBag, value: "gold-zip" }
      ]
    },
    timeless: {
      name: "Timeless Backpack",
      price: 1899,
      category: "work",
      colors: [
        { name: "Original", image: styledLaptopBag, value: "original" },
        { name: "Rose Gold Zip", image: timelessRoseGoldBag, value: "rose-gold" }
      ]
    },
    sleeved: {
      name: "Laptop Sleeve",
      price: 999,
      category: "accessories",
      colors: [
        { name: "Tan", image: tanLaptopSleeve, value: "tan" },
        { name: "Navy", image: navyLaptopSleeveFront, value: "navy" }
      ]
    }
  };

  // Handle opening color selection modal
  const handleOpenColorModal = (rangeName: string) => {
    setSelectedRange(rangeName);
    setColorModalOpen(true);
  };

  // Handle color selection and add to cart
  const handleColorSelection = (colorOption: any) => {
    if (!selectedRange) return;
    
    const range = rangeColorOptions[selectedRange as keyof typeof rangeColorOptions];
    const productName = `${range.name} - ${colorOption.name}`;
    const productId = Date.now() + Math.random(); // Ensure unique ID
    
    const product = createProduct(productId, productName, range.price, colorOption.image, range.category);
    addToCart(product, 1);
    
    toast({
      title: "Added to Cart",
      description: `${productName} has been added to your cart.`,
    });
    
    setColorModalOpen(false);
    setSelectedRange(null);
  };

  // Handle Add to Cart with toast notification (legacy function for non-range items)
  const handleAddToCart = (productName: string, price: number, image: string, category: string, productId: number = Date.now()) => {
    const product = createProduct(productId, productName, price, image, category);
    addToCart(product, 1);
    toast({
      title: "Added to Cart",
      description: `${productName} has been added to your cart.`,
    });
  };
  
  const businessBags = [
    { src: manCarryingOliveBag, alt: "Business Collection - Man with Olive Bag" },
    { src: oliveWorkBackpack, alt: "Business Collection - Olive" },
    { src: tanBusinessBag, alt: "Business Collection - Tan" },
    { src: newNavyBusinessBag, alt: "Business Collection - Navy" },
    { src: whiteBusinessBag, alt: "Business Collection - White" }
  ];

  const sportsBags = [
    { src: gentWithTennisBag, alt: "Gentleman with Tennis Bag - Navy" },
    { src: whiteTennisBagNew, alt: "Tennis Bag - White" },
    { src: navyTennisBagNew2, alt: "Tennis Bag - Navy" }
  ];

  const travelBags = [
    { src: travelBackpackLifestyle, alt: "Travel Collection - Lifestyle" },
    { src: tanTravelBackpack, alt: "Travel Collection - Tan" },
    { src: navyTravelBackpack, alt: "Travel Collection - Navy" }
  ];

  const leisureBags = [
    { src: ladyWithSideBag, alt: "Leisure Collection - Lady with Navy Side Bag" },
    { src: creamHipBag, alt: "Leisure Collection - White Hip Bag" },
    { src: blueCrossbodyBag, alt: "Leisure Collection - Blue Crossbody Bag" }
  ];

  const workLaptopBags = [
    { src: navyWorkBackpack, alt: "Retro Navy Backpack" },
    { src: brownWorkBackpack, alt: "Grounded Tan Backpack" },
    { src: whiteWorkBackpack, alt: "Timeless White Backpack" },
    { src: oliveWorkBackpack, alt: "Retro Olive Backpack" }
  ];

  const leisureRangeBags = [
    { src: hipBagSolo, alt: "Leisure Range - Hip Bag Solo" }
  ];

  const sleevedLaptopBags = [
    { src: tanLaptopSleeve, alt: "Laptop Sleeve - Tan Front" },
    { src: tanLaptopSleeveSide, alt: "Laptop Sleeve - Tan Side" },
    { src: navyLaptopSleeveFront, alt: "Laptop Sleeve - Navy Front" },
    { src: navyLaptopSleeveSide, alt: "Laptop Sleeve - Navy Side" }
  ];

  const accessoriesBags = [
    { src: tanLaptopSleeve, alt: "Laptop Sleeve - Tan Front" },
    { src: tanLaptopSleeveSide, alt: "Laptop Sleeve - Tan Side" },
    { src: navyLaptopSleeveFront, alt: "Laptop Sleeve - Navy Front" },
    { src: navyLaptopSleeveSide, alt: "Laptop Sleeve - Navy Side" },
    { src: embossCompanyTag, alt: "Laptop Tag - Welcome Message" },
    { src: embossInitials, alt: "Embossing - Custom Initials" }
  ];

  const onboardingBags = [
    { src: navyWorkBackpack, alt: "Navy Work Laptop Bag" },
    { src: brownWorkBackpack, alt: "Grounded Tan Work Laptop Bag" },
    { src: oliveWorkBackpack, alt: "Olive Work Laptop Bag" }
  ];

  const giftsBags = [
    { src: wineBagWithBottles, alt: "Wine Bag with Bottles" },
    { src: wineBagEmpty, alt: "Wine Bag - Empty" }
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
    let resetTimeout: NodeJS.Timeout | null = null;
    
    if (isLeisureHovered) {
      leisureInterval = setInterval(() => {
        setCurrentLeisureBag((prev) => (prev + 1) % leisureBags.length);
      }, 1500);
    } else {
      // Add small delay to ensure smooth transition completion
      resetTimeout = setTimeout(() => {
        setCurrentLeisureBag(0);
      }, 50);
    }

    return () => {
      if (leisureInterval) clearInterval(leisureInterval);
      if (resetTimeout) clearTimeout(resetTimeout);
    };
  }, [isLeisureHovered, leisureBags.length]);

  useEffect(() => {
    let workInterval: NodeJS.Timeout | null = null;
    
    if (isWorkHovered) {
      workInterval = setInterval(() => {
        setCurrentWorkBag((prev) => (prev + 1) % workLaptopBags.length);
      }, 1500);
    } else {
      setCurrentWorkBag(0); // Reset to first image when not hovering
    }

    return () => {
      if (workInterval) clearInterval(workInterval);
    };
  }, [isWorkHovered, workLaptopBags.length]);

  useEffect(() => {
    let sleevedInterval: NodeJS.Timeout | null = null;
    
    if (isSleevedHovered) {
      sleevedInterval = setInterval(() => {
        setCurrentSleevedBag((prev) => (prev + 1) % sleevedLaptopBags.length);
      }, 1500);
    } else {
      setCurrentSleevedBag(0); // Reset to first image when not hovering
    }

    return () => {
      if (sleevedInterval) clearInterval(sleevedInterval);
    };
  }, [isSleevedHovered, sleevedLaptopBags.length]);

  useEffect(() => {
    let accessoriesInterval: NodeJS.Timeout | null = null;
    
    if (isAccessoriesHovered) {
      accessoriesInterval = setInterval(() => {
        setCurrentAccessoriesBag((prev) => (prev + 1) % accessoriesBags.length);
      }, 1500);
    } else {
      setCurrentAccessoriesBag(0); // Reset to first image when not hovering
    }

    return () => {
      if (accessoriesInterval) clearInterval(accessoriesInterval);
    };
  }, [isAccessoriesHovered, accessoriesBags.length]);

  useEffect(() => {
    let onboardingInterval: NodeJS.Timeout | null = null;
    
    if (isOnboardingHovered) {
      onboardingInterval = setInterval(() => {
        setCurrentOnboardingBag((prev) => (prev + 1) % onboardingBags.length);
      }, 1500);
    } else {
      setCurrentOnboardingBag(0); // Reset to first image when not hovering
    }

    return () => {
      if (onboardingInterval) clearInterval(onboardingInterval);
    };
  }, [isOnboardingHovered, onboardingBags.length]);

  useEffect(() => {
    let giftsInterval: NodeJS.Timeout | null = null;
    
    if (isGiftsHovered) {
      giftsInterval = setInterval(() => {
        setCurrentGiftsBag((prev) => (prev + 1) % giftsBags.length);
      }, 1500);
    } else {
      setCurrentGiftsBag(0); // Reset to first image when not hovering
    }

    return () => {
      if (giftsInterval) clearInterval(giftsInterval);
    };
  }, [isGiftsHovered, giftsBags.length]);

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
                Accessories
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
            <div className="flex justify-center">
              <Link
                href="/browse?category=work"
                className="inline-block bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white px-6 sm:px-10 py-3 md:py-4 text-base md:text-lg font-semibold rounded-md hover:bg-white/15 hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 md:-translate-x-6 min-h-[44px] flex items-center"
                data-testid="button-shop-bags"
              >
                Shop Bags
              </Link>
            </div>
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
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                {/* Navy backpack (default) */}
                <img 
                  src={navyWorkBackpack}
                  alt="Retro Range - Navy Backpack"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 group-hover:opacity-0"
                  style={{ imageRendering: 'auto' }}
                />
                
                {/* Olive backpack (on hover) */}
                <img 
                  src={oliveWorkBackpack}
                  alt="Retro Range - Olive Backpack"
                  className="absolute inset-0 w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 opacity-0 group-hover:opacity-100"
                  style={{ imageRendering: 'auto' }}
                />

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenColorModal("retro");
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
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                {/* White hip bag (default) */}
                <img 
                  src={creamHipBag}
                  alt="Leisure Range - White Hip Bag"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 group-hover:opacity-0"
                  style={{ imageRendering: 'auto' }}
                />
                
                {/* Blue crossbody bag (on hover) */}
                <img 
                  src={blueCrossbodyBag}
                  alt="Leisure Range - Blue Crossbody Bag"
                  className="absolute inset-0 w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 opacity-0 group-hover:opacity-100"
                  style={{ imageRendering: 'auto' }}
                />

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenColorModal("leisure");
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenColorModal("sports");
                    }}
                    data-testid="button-add-to-cart-tennis-bag"
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
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenColorModal("classic");
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
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                {/* Original image (default) */}
                <img 
                  src={groundedBag}
                  alt="Grounded Backpack - Original"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 group-hover:opacity-0"
                  style={{ imageRendering: 'auto' }}
                />
                
                {/* Enhanced image (on hover) */}
                <img 
                  src={newGroundedBag}
                  alt="Grounded Backpack - Enhanced"
                  className="absolute inset-0 w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 opacity-0 group-hover:opacity-100"
                  style={{ imageRendering: 'auto' }}
                />

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenColorModal("grounded");
                    }}
                    data-testid="button-add-to-cart-grounded-backpack"
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
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                {/* Original styled laptop bag (default) */}
                <img 
                  src={styledLaptopBag}
                  alt="Timeless Backpack - Original"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 group-hover:opacity-0"
                  style={{ imageRendering: 'auto' }}
                />
                
                {/* Rose gold zip version (on hover) */}
                <img 
                  src={timelessRoseGoldBag}
                  alt="Timeless Backpack - Rose Gold Zip"
                  className="absolute inset-0 w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 opacity-0 group-hover:opacity-100"
                  style={{ imageRendering: 'auto' }}
                />

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenColorModal("timeless");
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
            
            <Link 
              href="/browse?category=accessories"
              className="group cursor-pointer block"
              onMouseEnter={() => setIsSleevedHovered(true)}
              onMouseLeave={() => setIsSleevedHovered(false)}
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                {/* Cycle through all 4 laptop sleeve images */}
                {sleevedLaptopBags.map((bag, index) => (
                  <img 
                    key={index}
                    src={bag.src}
                    alt={bag.alt}
                    className={`w-full h-80 object-cover group-hover:scale-105 transition-all duration-500 ${
                      index === currentSleevedBag ? 'opacity-100' : 'opacity-0 absolute inset-0'
                    }`}
                    style={{ imageRendering: 'auto' }}
                  />
                ))}

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenColorModal("sleeved");
                    }}
                    data-testid="button-add-to-cart-laptop-sleeve"
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
            <div className="absolute bottom-6 left-6 text-white min-h-[60px] flex flex-col justify-end">
              <h3 className="text-lg font-semibold text-white mb-1 leading-tight">Business</h3>
              <p className="text-sm opacity-90 text-white leading-tight">Professional Excellence</p>
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
            <div className="absolute bottom-6 left-6 text-white min-h-[60px] flex flex-col justify-end">
              <h3 className="text-lg font-semibold text-white mb-1 leading-tight">Sports</h3>
              <p className="text-sm opacity-90 text-white leading-tight">Athletic Performance</p>
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
            <div className="absolute bottom-6 left-6 text-white min-h-[60px] flex flex-col justify-end">
              <h3 className="text-lg font-semibold text-white mb-1 leading-tight">Leisure</h3>
              <p className="text-sm opacity-90 text-white leading-tight">Elegant Comfort</p>
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
            <div className="absolute bottom-6 left-6 text-white min-h-[60px] flex flex-col justify-end">
              <h3 className="text-lg font-semibold text-white mb-1 leading-tight">Travel</h3>
              <p className="text-sm opacity-90 text-white leading-tight">Adventure Awaits</p>
            </div>
          </Link>
          
          {/* Bottom - Bag Accessories */}
          <Link 
            href="/browse?category=accessories" 
            className="col-span-1 row-span-1 group relative overflow-hidden shadow-xl"
            onMouseEnter={() => setIsAccessoriesHovered(true)}
            onMouseLeave={() => setIsAccessoriesHovered(false)}
          >
            {accessoriesBags.map((bag, index) => (
              <img 
                key={index}
                src={bag.src}
                alt={bag.alt}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentAccessoriesBag ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white min-h-[60px] flex flex-col justify-end">
              <h3 className="text-lg font-semibold text-white mb-1 leading-tight">Accessories</h3>
              <p className="text-sm opacity-90 text-white leading-tight">Complete Your Look</p>
            </div>
          </Link>
          
          {/* Bottom - Gifts */}
          <Link 
            href="/browse?category=gifting" 
            className="col-span-1 row-span-1 group relative overflow-hidden shadow-xl"
            onMouseEnter={() => setIsGiftsHovered(true)}
            onMouseLeave={() => setIsGiftsHovered(false)}
          >
            {giftsBags.map((bag, index) => (
              <img 
                key={index}
                src={bag.src}
                alt={bag.alt}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentGiftsBag ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white min-h-[60px] flex flex-col justify-end">
              <h3 className="text-lg font-semibold text-white mb-1 leading-tight">Gifts</h3>
              <p className="text-sm opacity-90 text-white leading-tight">Perfect for Every Occasion</p>
            </div>
          </Link>
          
          {/* Bottom right - Onboarding (5-tile layout) */}
          <Link 
            href="/browse?category=onboarding"
            className="col-span-2 row-span-1 group relative overflow-hidden shadow-xl bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg"
            onMouseEnter={() => setIsOnboardingHovered(true)}
            onMouseLeave={() => setIsOnboardingHovered(false)}
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full p-4">
              {/* Large laptop bag block (left 2x2) */}
              <div className="col-span-2 row-span-2 relative overflow-hidden rounded-lg" data-testid="card-onboard-bags">
                {onboardingBags.map((bag, index) => (
                  <img 
                    key={index}
                    src={bag.src}
                    alt={bag.alt}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      index === currentOnboardingBag ? 'opacity-100' : 'opacity-0 absolute inset-0'
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white min-h-[60px] flex flex-col justify-end">
                  <h3 className="text-lg font-semibold text-white mb-1 leading-tight">Onboarding</h3>
                  <p className="text-sm opacity-90 text-white leading-tight">Work Laptop Bags</p>
                </div>
              </div>
              
              {/* Top right - Laptop Sleeves */}
              <div className="col-span-1 row-span-1 relative overflow-hidden rounded-lg" data-testid="card-sleeves">
                <img 
                  src={tanLaptopSleeve} 
                  alt="Laptop sleeve example" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <p className="text-xs font-medium">Laptop Sleeves</p>
                </div>
              </div>
              
              {/* Middle right - Named */}
              <div className="col-span-1 row-span-1 relative overflow-hidden rounded-lg" data-testid="card-named">
                <img 
                  src={embossInitials} 
                  alt="Named embossing example" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <p className="text-xs font-medium">Named</p>
                </div>
              </div>
              
              {/* Bottom left - Desk Mat */}
              <div className="col-span-2 row-span-1 relative overflow-hidden rounded-lg bg-gradient-to-br from-amber-800 to-amber-900" data-testid="card-deskmat">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-12 bg-amber-700 rounded-sm shadow-lg border-2 border-amber-600"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <p className="text-xs font-medium">Desk Mat</p>
                </div>
              </div>
              
              {/* Bottom right - Welcome Tag */}
              <div className="col-span-1 row-span-1 relative overflow-hidden rounded-lg" data-testid="card-welcome-tag">
                <img 
                  src={embossCompanyTag} 
                  alt="Welcome tag example" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <p className="text-xs font-medium">Welcome Tag</p>
                </div>
              </div>
            </div>
          </Link>
          
        </div>
        
        {/* Mobile Alternative Layout - Complete Category Grid */}
        <div className="md:hidden grid grid-cols-2 gap-3 px-4 pb-8">
          {/* Business Collection */}
          <Link href="/browse?category=work" className="aspect-square group relative overflow-hidden shadow-xl rounded-lg" data-testid="tile-business-mobile">
            <img src={manCarryingOliveBag} alt="Business Collection" className="w-full h-full object-cover" style={{ imageRendering: 'auto' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-sm font-semibold">Business</h3>
              <p className="text-xs opacity-90">Professional</p>
            </div>
          </Link>
          
          {/* Sports Collection */}
          <Link href="/browse?category=sport" className="aspect-square group relative overflow-hidden shadow-xl rounded-lg" data-testid="tile-sports-mobile">
            <img src={whiteTennisBag} alt="Sports Collection" className="w-full h-full object-cover" style={{ imageRendering: 'auto' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-sm font-semibold">Sports</h3>
              <p className="text-xs opacity-90">Athletic</p>
            </div>
          </Link>
          
          {/* Leisure Collection */}
          <Link 
            href="/browse?category=leisure" 
            className="aspect-square group relative overflow-hidden shadow-xl rounded-lg" 
            data-testid="tile-leisure-mobile"
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
                style={{ imageRendering: 'auto' }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-sm font-semibold">Leisure</h3>
              <p className="text-xs opacity-90">Everyday</p>
            </div>
          </Link>
          
          {/* Travel Collection */}
          <Link href="/browse?category=travel" className="aspect-square group relative overflow-hidden shadow-xl rounded-lg" data-testid="tile-travel-mobile">
            <img src={travelBackpackLifestyle} alt="Travel Collection" className="w-full h-full object-cover" style={{ imageRendering: 'auto' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-sm font-semibold">Travel</h3>
              <p className="text-xs opacity-90">Adventure</p>
            </div>
          </Link>
          
          {/* Accessories Collection */}
          <Link 
            href="/browse?category=accessories" 
            className="aspect-square group relative overflow-hidden shadow-xl rounded-lg" 
            data-testid="tile-accessories-mobile"
            onMouseEnter={handleSleevedHover}
            onMouseLeave={handleSleevedLeave}
          >
            {sleevedLaptopBags.map((bag, index) => (
              <img 
                key={index}
                src={bag.src}
                alt={bag.alt}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentSleevedBag ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
                style={{ imageRendering: 'auto' }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-sm font-semibold">Accessories</h3>
              <p className="text-xs opacity-90">Complete Your Look</p>
            </div>
          </Link>
          
          {/* Onboarding Collection */}
          <Link href="/browse?category=onboarding" className="aspect-square group relative overflow-hidden shadow-xl rounded-lg" data-testid="tile-onboarding-mobile">
            <img src={navyWorkBackpack} alt="Onboarding Collection" className="w-full h-full object-cover" style={{ imageRendering: 'auto' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-sm font-semibold">Onboarding</h3>
              <p className="text-xs opacity-90">Work Essentials</p>
            </div>
          </Link>
        </div>
        
        <div className="py-16"></div>
      </section>


      {/* Bag Capsule Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          {/* Section Heading */}
          <div className="text-center mb-6">
            <h2 className="text-4xl font-georgia-bold text-terracotta mb-4">Bag Capsule</h2>
          </div>
          
          {/* Capsule Options */}
          <div className="flex justify-center gap-6 mb-8 max-w-xl mx-auto">
            {/* Gifting Capsule */}
            <Link href="/browse?category=gifting" className="flex items-center space-x-4 group cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center border-2 border-terracotta/20 group-hover:bg-terracotta/20 transition-all duration-300 flex-shrink-0">
                <svg className="w-6 h-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Gifting</h3>
                <p className="text-gray-600 text-sm">Sustainable and timeless gifts</p>
              </div>
            </Link>
            
            {/* Onboarding Capsule */}
            <Link href="/browse?category=onboarding" className="flex items-center space-x-4 group cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center border-2 border-terracotta/20 group-hover:bg-terracotta/20 transition-all duration-300 flex-shrink-0">
                <svg className="w-6 h-6 text-terracotta" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  <circle cx="18" cy="8" r="2"/>
                  <circle cx="6" cy="8" r="2"/>
                  <path d="M18 14c.55 0 1.05.07 1.53.2-.86-.9-2.87-1.2-3.53-1.2v2c.66 0 2 .34 2 2h2c0-1.66-1.34-3-2-3z"/>
                  <path d="M6 14c-.55 0-1.05.07-1.53.2.86-.9 2.87-1.2 3.53-1.2v2c-.66 0-2 .34-2 2H4c0-1.66 1.34-3 2-3z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Onboarding</h3>
                <p className="text-gray-600 text-sm">Unforgettable employee experiences</p>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Full Screen Image */}
        <div className="h-[80vh] w-full overflow-hidden">
            {/* Background Image */}
            <img 
              src="/images/navy-backpack-capsule.png"
              alt="Premium Navy Leather Backpack"
              className="w-full h-full object-cover"
            />
            
            {/* Content Overlay */}
            <div style={{display: 'none'}} className="hidden">
              {/* Button Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-8">
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
              <img src={newNavyTennisBagInstagram} alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" style={{ imageRendering: 'auto' }} />
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
              <img src={laptopSleeveInstagram} alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" style={{ imageRendering: 'auto' }} />
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

      {/* Color Selection Modal */}
      <Dialog open={colorModalOpen} onOpenChange={setColorModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Your Color</DialogTitle>
            <DialogDescription>
              {selectedRange && rangeColorOptions[selectedRange as keyof typeof rangeColorOptions] && 
                `Select a color for your ${rangeColorOptions[selectedRange as keyof typeof rangeColorOptions].name}`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {selectedRange && rangeColorOptions[selectedRange as keyof typeof rangeColorOptions] && 
              rangeColorOptions[selectedRange as keyof typeof rangeColorOptions].colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelection(color)}
                  className="group relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-botanical transition-colors"
                  data-testid={`button-color-${color.value}`}
                >
                  <div className="aspect-square">
                    <img 
                      src={color.image} 
                      alt={color.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center py-2">
                    <p className="text-sm font-medium">{color.name}</p>
                  </div>
                </button>
              ))
            }
          </div>
          
          {selectedRange && rangeColorOptions[selectedRange as keyof typeof rangeColorOptions] && (
            <div className="text-center mt-4 pt-4 border-t">
              <p className="text-lg font-semibold text-botanical">
                R{rangeColorOptions[selectedRange as keyof typeof rangeColorOptions].price}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Hero;