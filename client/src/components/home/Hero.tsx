import { Link } from "wouter";

const Hero = () => {
  return (
    <div className="relative">
      {/* Plant Store Inspired Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-stone-600 flex items-center overflow-hidden" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}>
        {/* Dark overlay for depth */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Left Plant */}
        <div className="absolute left-0 top-0 h-full w-1/6 z-10">
          <div className="h-full w-full bg-gradient-to-r from-green-900/80 to-transparent relative">
            {/* Plant silhouette SVG */}
            <svg className="absolute bottom-0 left-4 w-32 h-96 text-green-800/60" viewBox="0 0 100 300" fill="currentColor">
              <path d="M20 300 Q25 250 35 200 Q45 150 40 100 Q35 80 30 60 Q25 40 35 20 Q45 10 50 0 M50 0 Q55 10 65 20 Q75 40 70 60 Q65 80 60 100 Q55 150 65 200 Q75 250 80 300" />
              <ellipse cx="35" cy="80" rx="15" ry="25" transform="rotate(-20 35 80)" />
              <ellipse cx="45" cy="120" rx="12" ry="20" transform="rotate(15 45 120)" />
              <ellipse cx="25" cy="160" rx="18" ry="30" transform="rotate(-30 25 160)" />
              <ellipse cx="55" cy="200" rx="14" ry="25" transform="rotate(25 55 200)" />
            </svg>
          </div>
        </div>
        
        {/* Right Plant */}
        <div className="absolute right-0 top-0 h-full w-1/6 z-10">
          <div className="h-full w-full bg-gradient-to-l from-green-900/80 to-transparent relative">
            {/* Plant silhouette SVG */}
            <svg className="absolute bottom-0 right-4 w-40 h-full text-green-800/50" viewBox="0 0 120 400" fill="currentColor">
              <path d="M60 400 Q55 350 45 300 Q35 250 40 200 Q45 180 50 160 Q55 140 45 120 Q35 110 30 100 M30 100 Q35 110 45 120 Q55 140 50 160 Q45 180 40 200 Q35 250 45 300 Q55 350 60 400" />
              <ellipse cx="50" cy="180" rx="20" ry="35" transform="rotate(20 50 180)" />
              <ellipse cx="40" cy="220" rx="16" ry="28" transform="rotate(-15 40 220)" />
              <ellipse cx="70" cy="260" rx="22" ry="40" transform="rotate(30 70 260)" />
              <ellipse cx="35" cy="300" rx="18" ry="32" transform="rotate(-25 35 300)" />
              <ellipse cx="65" cy="340" rx="20" ry="35" transform="rotate(20 65 340)" />
            </svg>
          </div>
        </div>
        
        {/* Navigation Bar */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
          <nav className="bg-stone-900/80 backdrop-blur-sm rounded-full px-8 py-4 border border-stone-600/50">
            <div className="flex space-x-8 text-sm font-medium">
              <Link href="/products?category=work" className="text-stone-200 hover:text-white transition-colors duration-200 px-4 py-2 rounded-full hover:bg-white/10">
                Work
              </Link>
              <Link href="/products?category=leisure" className="text-stone-200 hover:text-white transition-colors duration-200 px-4 py-2 rounded-full hover:bg-white/10">
                Leisure
              </Link>
              <Link href="/products?category=sport" className="text-stone-200 hover:text-white transition-colors duration-200 px-4 py-2 rounded-full hover:bg-white/10">
                Sport
              </Link>
              <Link href="/products?category=customised" className="text-stone-200 hover:text-white transition-colors duration-200 px-4 py-2 rounded-full hover:bg-white/10">
                Customised
              </Link>
              <Link href="/care" className="text-stone-200 hover:text-white transition-colors duration-200 px-4 py-2 rounded-full hover:bg-white/10">
                Care
              </Link>
            </div>
          </nav>
        </div>
        
        {/* Central Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-6xl lg:text-8xl font-bold text-white leading-tight tracking-wide">
              Is There Such a Thing as<br />
              <span className="text-stone-300">Too Many Bags?</span>
            </h1>
            <p className="text-xl lg:text-2xl text-stone-200 leading-relaxed max-w-2xl mx-auto">
              Discover the latest addition to your growing leather collection
            </p>
            <button className="inline-block bg-stone-700/80 backdrop-blur-sm border-2 border-stone-500 text-white px-10 py-4 text-lg font-semibold rounded-full hover:bg-stone-600/80 hover:border-stone-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Shop Bags
            </button>
          </div>
        </div>
        
        {/* Floating man with bag - positioned to not interfere with plants */}
        <div className="absolute bottom-16 right-1/4 transform translate-x-1/2 z-10">
          <div className="relative">
            <img 
              src="/images/backpack-olive.jpg"
              alt="Premium leather bag"
              className="w-80 h-80 object-cover rounded-2xl shadow-2xl opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Our Ranges Section */}
      <section className="py-20 bg-stone-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Our Ranges</h2>
            <button className="bg-orange-600 text-white px-6 py-2 font-semibold hover:bg-orange-700 transition-colors">
              Shop All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img 
                  src="/images/green-backpack.jpg"
                  alt="Professional Backpack"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-sage text-white px-3 py-1 text-sm font-semibold rounded-full">
                    New Range
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100">
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Professional Backpack</h3>
              <p className="text-gray-600 text-sm mb-2">Premium leather work bag</p>
              <p className="font-bold text-gray-800">Price R899.99</p>
            </div>
            
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img 
                  src="/images/crossbody-cream.jpg"
                  alt="Cream Crossbody"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-sage text-white px-3 py-1 text-sm font-semibold rounded-full">
                    New Range
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100">
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Cream Crossbody</h3>
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
                <div className="absolute top-4 left-4">
                  <span className="bg-sage text-white px-3 py-1 text-sm font-semibold rounded-full">
                    New Range
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100">
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Tennis Sports Bag</h3>
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
                <div className="absolute top-4 left-4">
                  <span className="bg-sage text-white px-3 py-1 text-sm font-semibold rounded-full">
                    New Range
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-white text-gray-800 py-2 px-4 font-semibold rounded-lg hover:bg-gray-100">
                    Add to Cart
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Brown Travel Backpack</h3>
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
      <section className="py-20 bg-gradient-to-r from-orange-400 to-orange-500">
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
            <div className="space-y-8 text-white">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Subscribe & Customise
              </h2>
              <p className="text-xl leading-relaxed">
                and look forward to a new bag every month
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Custom Bags</h3>
                    <p className="text-white/80">Personalise your perfect bag</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H10a2 2 0 00-2-2V6m8 0h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Corporate Gifting</h3>
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
      <section className="py-20 bg-gradient-to-br from-sage to-eucalyptus">
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