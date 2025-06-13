import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const instagramPosts = [
  {
    id: 1,
    image: "/images/tennis-bag-action.jpg",
    likes: 287,
    caption: "Court ready with premium leather craftsmanship",
    url: "https://instagram.com"
  },
  {
    id: 2,
    image: "/images/work-backpack-urban.jpg",
    likes: 156,
    caption: "Urban elegance meets professional functionality",
    url: "https://instagram.com"
  },
  {
    id: 3,
    image: "/images/tennis-bag-lifestyle.jpg",
    likes: 203,
    caption: "Handcrafted leather bags for authentic living",
    url: "https://instagram.com"
  },
  {
    id: 4,
    image: "/images/work-backpack-studio.jpg",
    likes: 134,
    caption: "Made in South Africa, crafted with purpose",
    url: "https://instagram.com"
  },
  {
    id: 5,
    image: "/images/tennis-bag-court.jpg",
    likes: 219,
    caption: "Luxury meets performance in every stitch",
    url: "https://instagram.com"
  },
  {
    id: 6,
    image: "/images/work-backpack-urban.jpg",
    likes: 176,
    caption: "Professional style, artisan quality",
    url: "https://instagram.com"
  }
];

const InstagramFeed = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-secondary-light to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
              Social Gallery
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
            Crafted for Real Life
          </h2>
          <p className="text-xl text-neutral-light max-w-3xl mx-auto leading-relaxed">
            See our handcrafted bags in action with real customers living authentic lives
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {instagramPosts.map((post, index) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block relative rounded-2xl overflow-hidden group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="relative">
                <img 
                  src={post.image} 
                  alt="Instagram post" 
                  className="w-full aspect-square object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                
                <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex justify-end">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <FontAwesomeIcon icon={["fab", "instagram"]} className="text-white text-lg" />
                    </div>
                  </div>
                  
                  <div className="text-white">
                    <p className="text-sm mb-2 line-clamp-2">{post.caption}</p>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon="heart" className="text-red-400" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-primary">
                  {post.likes}
                </div>
              </div>
            </a>
          ))}
        </div>
        
        <div className="text-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group btn-primary inline-flex items-center gap-3 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <FontAwesomeIcon icon={["fab", "instagram"]} className="text-lg" />
            <span>Follow Our Journey</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <p className="mt-4 text-neutral-light text-sm">
            @livinggreenmovement • Handcrafted in South Africa
          </p>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
