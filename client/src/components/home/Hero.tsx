import { Link } from "wouter";
import botanicalBg from '@assets/Man with bag and botanical background_1757072953822.png';

const Hero = () => {
  return (
    <div className="relative">
      {/* Clean Hero Section with Background Image */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${botanicalBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}></div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
        
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
              Living Green in Motion
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
            <h2 className="text-4xl font-bold text-botanical mb-4">Our Ranges</h2>
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
          <h2 className="text-5xl font-bold text-white mb-4">Shop by Category</h2>
          <p className="text-xl text-white/80">Discover LGM</p>
        </div>
        
        {/* Full-width 3-Image Collage */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[70vh] w-full px-0">
          {/* Large left image - Business Collection */}
          <Link href="/products?category=business" className="col-span-2 row-span-2 group relative overflow-hidden shadow-xl rounded-lg">
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
          <Link href="/products?category=sport" className="col-span-2 row-span-1 group relative overflow-hidden shadow-xl rounded-lg">
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
          
          {/* Bottom right - Travel */}
          <Link href="/products?category=travel" className="col-span-2 row-span-1 group relative overflow-hidden shadow-xl rounded-lg">
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
      <section className="py-20" style={{
        backgroundColor: '#6B5B4D',
        backgroundImage: `
          radial-gradient(circle at 30% 20%, rgba(0,0,0,0.15) 1px, transparent 1px),
          radial-gradient(circle at 70% 60%, rgba(0,0,0,0.1) 1px, transparent 1px),
          radial-gradient(circle at 20% 80%, rgba(0,0,0,0.08) 1px, transparent 1px),
          linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.15) 100%)
        `,
        backgroundSize: '120px 120px, 80px 80px, 60px 60px, 100% 100%'
      }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="/images/backpack-brown.jpg"
                alt="Custom leather bags"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent rounded-2xl"></div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-white">
                Subscribe & Customise
              </h2>
              <p className="text-xl leading-relaxed text-white">
                and look forward to a new bag every month
              </p>
              
              <div className="space-y-6">
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
          </div>
        </div>
      </section>

      {/* Bag Methodology Section */}
      <section className="py-16 bg-peach-fuzz">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-heading font-bold text-white mb-4 tracking-wider">Bag Methodology</h2>
            <p className="text-xl text-white/80 mb-8">Know your bag</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-botanical rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Style</h3>
              <p className="text-white/80 leading-relaxed">
                Timeless designs that complement your personal aesthetic. Each bag is crafted to be both fashionable and enduring, 
                ensuring you look sophisticated in any setting while expressing your unique style.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-botanical rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Functionality</h3>
              <p className="text-white/80 leading-relaxed">
                Intelligent compartments and thoughtful organization systems designed for your daily needs. 
                Every pocket, zipper, and strap is positioned to enhance your productivity and convenience.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-botanical rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Quality</h3>
              <p className="text-white/80 leading-relaxed">
                Premium South African leather and meticulous craftsmanship in every stitch. 
                Built to withstand daily use while developing a beautiful patina that tells your unique story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-forest mb-4">Our Blog</h2>
            <p className="text-xl text-gray-600">Your Guide to Leather Care & Style</p>
            <Link href="/blog" className="inline-block mt-6 text-herbal-tonic hover:text-forest font-semibold text-lg">
              Read More
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src="/images/green-backpack.jpg" 
                  alt="How to Care for Leather Bags"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-forest mb-3 hover:text-herbal-tonic cursor-pointer">
                  How to Care for Your Leather Bags
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Essential tips and techniques to maintain your premium leather goods, ensuring they develop 
                  a beautiful patina while lasting for decades to come.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Dec 15, 2024</span>
                  <span>3 min read</span>
                </div>
              </div>
            </article>
            
            <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src="/images/crossbody-cream.jpg" 
                  alt="Choosing the Perfect Bag"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-forest mb-3 hover:text-herbal-tonic cursor-pointer">
                  Choosing the Perfect Bag for Your Lifestyle
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  From business meetings to weekend adventures, discover how to select the ideal 
                  leather companion that matches your daily needs and personal style.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Dec 10, 2024</span>
                  <span>4 min read</span>
                </div>
              </div>
            </article>
            
            <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src="/images/backpack-brown.jpg" 
                  alt="South African Craftsmanship"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-forest mb-3 hover:text-herbal-tonic cursor-pointer">
                  The Art of South African Leather Craftsmanship
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Explore the rich tradition and modern techniques that make Johannesburg 
                  a center of excellence for premium leather goods manufacturing.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Dec 5, 2024</span>
                  <span>5 min read</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to Know About Leather Goods and More
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            No Spam, We Promise.
          </p>
          <p className="text-lg text-gray-400 mb-12">
            Subscribe now and get 15% off your first purchase
          </p>
          
          <div className="max-w-md mx-auto space-y-4">
            <input 
              type="email" 
              placeholder="Enter your email here"
              className="w-full px-6 py-4 text-forest rounded-lg border-0 focus:ring-2 focus:ring-herbal-tonic outline-none"
            />
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <input type="checkbox" className="rounded" />
              <span>Yes, subscribe me to your newsletter.</span>
            </div>
            <button className="w-full bg-botanical text-white px-8 py-4 font-semibold hover:bg-white hover:text-forest transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="py-20" style={{backgroundColor: '#7A8471'}}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">LGM on the #Gram</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/images/green-backpack.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/images/crossbody-cream.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/images/white-tennis-bag.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/images/backpack-brown.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/images/white-backpack.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/images/exploring-backpack.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/images/green-backpack.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/images/crossbody-cream.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/images/white-tennis-bag.jpg" alt="Instagram post" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
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