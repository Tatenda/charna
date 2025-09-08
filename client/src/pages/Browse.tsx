import { Link, useLocation } from "wouter";

const categories = [
  {
    id: 'work',
    title: 'Work',
    description: 'Professional bags for the modern workplace',
    image: '/images/green-backpack.jpg',
    link: '/products?category=work'
  },
  {
    id: 'leisure',
    title: 'Leisure',
    description: 'Casual elegance for everyday adventures',
    image: '/images/crossbody-cream.jpg',
    link: '/products?category=leisure'
  },
  {
    id: 'sport',
    title: 'Sport',
    description: 'Athletic performance meets luxury design',
    image: '/images/white-tennis-bag.jpg',
    link: '/products?category=sport'
  },
  {
    id: 'travel',
    title: 'Travel',
    description: 'Adventure-ready companions for every journey',
    image: '/images/brown-backpack.jpg',
    link: '/products?category=travel'
  },
  {
    id: 'accessories',
    title: 'Accessories',
    description: 'Complete your look with premium leather goods',
    image: '/images/leather-wallet.jpg',
    link: '/products?category=accessories'
  },
  {
    id: 'ranges',
    title: 'Ranges',
    description: 'Curated collections of our finest pieces',
    image: '/images/collection-display.jpg',
    link: '/products'
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    description: 'Essential pieces for new professionals',
    image: '/images/professional-setup.jpg',
    link: '/products?collection=onboarding'
  },
  {
    id: 'gifting',
    title: 'Gifting',
    description: 'Perfect presents for those who appreciate quality',
    image: '/images/gift-packaging.jpg',
    link: '/products?collection=gifting'
  },
  {
    id: 'customised',
    title: 'Customised',
    description: 'Personalized pieces crafted just for you',
    image: '/images/custom-monogram.jpg',
    link: '/products?category=customised'
  }
];

export default function Browse() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const selectedCategory = searchParams.get('category') || 'all';

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      {/* Header Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-georgia-bold mb-6">Browse by Category</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our handcrafted leather goods organized by lifestyle and purpose. 
            Each piece is designed in Johannesburg with attention to detail and quality.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.link}
                className="group relative overflow-hidden rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-georgia-bold mb-2 text-white group-hover:text-gray-200 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                    {category.description}
                  </p>
                  
                  <div className="mt-4 inline-flex items-center text-white font-medium">
                    Shop Now
                    <svg 
                      className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-georgia-bold mb-4">Featured Collections</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Explore our most popular and newest collections, carefully curated for the discerning customer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/products?collection=new-arrivals" className="group relative block rounded-lg overflow-hidden">
              <div className="aspect-[3/2]">
                <img
                  src="/images/new-collection.jpg"
                  alt="New Arrivals"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-3xl font-georgia-bold text-white mb-2">New Arrivals</h3>
                  <p className="text-gray-200">Latest handcrafted pieces</p>
                </div>
              </div>
            </Link>
            
            <Link href="/products?collection=bestsellers" className="group relative block rounded-lg overflow-hidden">
              <div className="aspect-[3/2]">
                <img
                  src="/images/bestsellers.jpg"
                  alt="Bestsellers"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-3xl font-georgia-bold text-white mb-2">Bestsellers</h3>
                  <p className="text-gray-200">Customer favorites</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}