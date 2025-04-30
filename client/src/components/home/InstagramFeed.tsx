import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getImagePath } from "@/lib/imageUtils";

const instagramPosts = [
  {
    id: 1,
    image: "/attached_assets/CreatorKit-AI (1).jpg",
    likes: 124,
    url: "https://instagram.com"
  },
  {
    id: 2,
    image: "/attached_assets/CreatorKit-AI (3).jpg",
    likes: 87,
    url: "https://instagram.com"
  },
  {
    id: 3,
    image: "/attached_assets/CreatorKit-AI (4).jpg",
    likes: 156,
    url: "https://instagram.com"
  },
  {
    id: 4,
    image: "/attached_assets/CreatorKit-AI (6).jpg",
    likes: 98,
    url: "https://instagram.com"
  }
];

const InstagramFeed = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-primary">Follow Our Journey</h2>
          <div className="divider mx-auto mb-6"></div>
          <p className="text-neutral-light max-w-2xl mx-auto">
            <FontAwesomeIcon icon={['fab', 'instagram']} className="text-xl mr-2" /> 
            <span className="font-accent">@livinggreenmovement</span>
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instagramPosts.map((post) => (
            <a 
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative rounded-lg overflow-hidden group"
            >
              <img 
                src={getImagePath(post.image)} 
                alt="Instagram post" 
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <FontAwesomeIcon icon="heart" className="text-white mr-2" />
                <span className="text-white">{post.likes}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
