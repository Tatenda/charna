import { Link } from "wouter";
import botanicalBg from '@assets/Man with bag and botanical background_1757072953822.png';
import newHeroBg from '@assets/website landing page _1757090692575.png';

const Hero = () => {
  return (
    <div className="relative">
      {/* Clean Hero Section with Background Image */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${newHeroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}></div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/15"></div>
        
        {/* Navigation Bar */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
          <nav className="bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
            <div className="flex space-x-8 text-sm font-medium">
              <Link href="/products?category=work" className="text-white hover:text-stone-200 transition-colors duration-200 px-4 py-2 rounded-full hover:bg-white/10">
                Work
              </Link>
              <Link href="/products?category=leisure" className="text-white hover:text-stone-200 transition-colors duration-200 px-4 py-2 rounded-full hover:bg-white/10">
                Leisure
              </Link>
              <Link href="/products?category=sport" className="text-white hover:text-stone-200 transition-colors duration-200 px-4 py-2 rounded-full hover:bg-white/10">
                Sport
              </Link>
              <Link href="/products?category=customised" className="text-white hover:text-stone-200 transition-colors duration-200 px-4 py-2 rounded-full hover:bg-white/10">
                Customised
              </Link>
              <Link href="/care" className="text-white hover:text-stone-200 transition-colors duration-200 px-4 py-2 rounded-full hover:bg-white/10">
                Care
              </Link>
            </div>
          </nav>
        </div>
        
        
        {/* Central Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-6xl lg:text-8xl font-bold text-white leading-tight tracking-wide">
              Living Green Motion
            </h1>
            <p className="text-xl lg:text-2xl text-stone-200 leading-relaxed max-w-2xl mx-auto">
              LGM bags offers hand crafted, beautiful and affordable bags
            </p>
            <button className="inline-block bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 text-lg font-semibold rounded-md hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Shop Bags
            </button>
          </div>
        </div>
        
      </section>

      {/* Our Ranges Section */}
      <section className="py-20" style={{backgroundColor: '#F5F1E8'}}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-botanical mb-4">Our Ranges</h2>
            <button className="bg-botanical text-white px-8 py-3 font-semibold hover:bg-botanical/90 transition-colors rounded-lg">
              Shop All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden bg-white rounded-lg mb-4 shadow-sm">
                <img 
                  src="/images/green-backpack.jpg"
                  alt="Professional Backpack"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100">
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">Retro Range</h3>
              <p className="font-bold text-gray-800">R899.99</p>
              <div className="flex items-center mt-1">
                <div className="flex text-orange-400 text-sm">
                  ★★★★☆
                </div>
                <span className="text-gray-500 text-sm ml-2">(15)</span>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img 
                  src="/images/crossbody-cream.jpg"
                  alt="Cream Crossbody"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100">
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Stylish Leisure Range</h3>
              <p className="text-gray-600 text-sm mb-2">Elegant everyday bag</p>
              <p className="font-bold text-gray-800">Price R649.99</p>
            </div>
            
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img 
                  src="/images/white-tennis-bag.jpg"
                  alt="Tennis Sports Bag"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100">
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Sports Range</h3>
              <p className="text-gray-600 text-sm mb-2">Athletic gear carrier</p>
              <p className="font-bold text-gray-800">Price R749.99</p>
            </div>
            
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img 
                  src="/images/backpack-brown.jpg"
                  alt="Brown Travel Backpack"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100">
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Classic Range</h3>
              <p className="text-gray-600 text-sm mb-2">Adventure companion</p>
              <p className="font-bold text-gray-800">Price R999.99</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category - Full Collage Gallery */}
      <section className="relative overflow-hidden" style={{backgroundColor: '#7A8471'}}>
        {/* Header overlay */}
        <div className="relative z-10 text-center py-16">
          <h2 className="text-5xl font-bold text-white mb-4">Discover your Movement</h2>
          <p className="text-xl text-white/80">Shop by Category</p>
        </div>
        
        {/* Full-width 4-Image Collage */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[70vh] w-full px-0">
          {/* Large left image - Business Collection */}
          <Link href="/products?category=business" className="col-span-2 row-span-2 group relative overflow-hidden shadow-xl">
            <img 
              src="/images/green-backpack.jpg"
              alt="Business Collection"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-4xl font-bold mb-3 text-white">Business</h3>
              <p className="text-lg opacity-90 text-white">Professional Excellence</p>
            </div>
          </Link>
          
          {/* Top right - Sports */}
          <Link href="/products?category=sport" className="col-span-1 row-span-1 group relative overflow-hidden shadow-xl">
            <img 
              src="/images/white-tennis-bag.jpg"
              alt="Sports Collection"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2 text-white">Sports</h3>
              <p className="text-base opacity-90 text-white">Athletic Performance</p>
            </div>
          </Link>
          
          {/* New - Styled Leisure */}
          <Link href="/products?category=leisure" className="col-span-1 row-span-1 group relative overflow-hidden shadow-xl">
            <img 
              src="/images/crossbody-cream.jpg"
              alt="Styled Leisure Collection"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2 text-white">Styled Leisure</h3>
              <p className="text-base opacity-90 text-white">Elegant Comfort</p>
            </div>
          </Link>
          
          {/* Bottom right - Travel */}
          <Link href="/products?category=travel" className="col-span-2 row-span-1 group relative overflow-hidden shadow-xl">
            <img 
              src="/images/exploring-backpack.jpg"
              alt="Travel Collection"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2 text-white">Travel</h3>
              <p className="text-base opacity-90 text-white">Adventure Awaits</p>
            </div>
          </Link>
        </div>
        
        <div className="py-16"></div>
      </section>

      {/* Subscribe & Customise Section */}
      <section className="relative py-20 overflow-hidden" style={{
        backgroundImage: `url(${botanicalBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/15"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Centered text */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold leading-tight text-white mb-6">
              Customise your Bag
            </h2>
            <p className="text-xl leading-relaxed text-white">
              and look forward to a new bag every month
            </p>
          </div>
          
          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Custom Bags</h3>
                <p className="text-white/80">Personalise your perfect bag</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Corporate Gifting</h3>
                <p className="text-white/80">Business gifting solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bag Capsule Section */}
      <section className="py-20" style={{backgroundColor: '#D2B48C'}}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Bag Capsule</h2>
          </div>
        </div>
      </section>



      {/* Instagram Gallery */}
      <section className="py-20" style={{backgroundColor: '#7A8471'}}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">LGM on the #Gram</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1">
            <div className="aspect-square overflow-hidden">
              <img src="/images/green-backpack.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/crossbody-cream.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/white-tennis-bag.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/backpack-brown.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/white-backpack.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/exploring-backpack.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/green-backpack.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/crossbody-cream.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/white-tennis-bag.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src="/images/backpack-brown.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-black text-white px-8 py-3 font-semibold hover:bg-botanical transition-colors duration-300">
              Follow @LIGREMO
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;