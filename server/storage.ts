import { Product, Order, Contact, OrderWithItems, OrderWithCustomerInfo, CustomerInfo } from '@/shared/types'

// Storage Interface
export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  
  // Orders
  createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  
  // Contacts
  createContact(contactData: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private products: Product[] = [
    {
      id: 1,
      name: "Retro Range - Navy Blue",
      description: "A timeless design that combines vintage aesthetics with modern functionality.",
      longDescription: "The Retro Range Navy Blue bag is crafted from premium materials and features a classic design that never goes out of style. Perfect for both work and leisure, this bag offers ample storage space and comfortable carrying options.",
      price: 2500,
      originalPrice: 3000,
      rating: 5,
      reviewCount: 12,
      inStock: true,
      badge: "Best Seller",
      category: "business",
      colors: ["#1e3a8a", "#3b82f6", "#60a5fa"],
      features: [
        "Premium leather construction",
        "Multiple compartments",
        "Adjustable shoulder strap",
        "Laptop compartment",
        "Water-resistant material"
      ],
      images: [
        "/Retro Range - Navy Blue_1757319569359.png",
        "/Retro Range - Navy Blue_1757319569359.png"
      ],
      materials: "Premium leather and canvas",
      dimensions: "40cm x 30cm x 15cm",
      careInstructions: "Clean with damp cloth, avoid direct sunlight",
      featured: true,
      createdAt: new Date()
    },
    {
      id: 2,
      name: "Retro Range - Rose Gold",
      description: "Elegant rose gold accents make this bag a perfect accessory for any occasion.",
      longDescription: "The Retro Range Rose Gold bag features sophisticated rose gold hardware and premium materials. Its elegant design makes it perfect for both professional and social settings.",
      price: 2800,
      originalPrice: 3200,
      rating: 5,
      reviewCount: 8,
      inStock: true,
      badge: "New",
      category: "business",
      colors: ["#f59e0b", "#fbbf24", "#fcd34d"],
      features: [
        "Rose gold hardware",
        "Premium materials",
        "Multiple compartments",
        "Adjustable straps",
        "Laptop protection"
      ],
      images: [
        "/Retro Range - Rose Gold_1757319569359.png",
        "/Retro Range - Rose Gold_1757319569359.png"
      ],
      materials: "Premium leather with rose gold hardware",
      dimensions: "38cm x 28cm x 12cm",
      careInstructions: "Clean with soft cloth, store in cool dry place",
      featured: true,
      createdAt: new Date()
    },
    {
      id: 3,
      name: "Retro Range - Black",
      description: "Classic black design that never goes out of style.",
      longDescription: "The Retro Range Black bag is a timeless classic that offers both style and functionality. Perfect for any professional setting.",
      price: 2400,
      originalPrice: 2800,
      rating: 5,
      reviewCount: 15,
      inStock: true,
      badge: "Popular",
      category: "business",
      colors: ["#000000", "#374151", "#6b7280"],
      features: [
        "Classic black design",
        "Durable construction",
        "Multiple pockets",
        "Comfortable carrying",
        "Professional look"
      ],
      images: [
        "/Retro Range - Black_1757319569359.png",
        "/Retro Range - Black_1757319569359.png"
      ],
      materials: "Premium black leather",
      dimensions: "42cm x 32cm x 16cm",
      careInstructions: "Clean with leather cleaner, condition monthly",
      featured: true,
      createdAt: new Date()
    },
    {
      id: 4,
      name: "Sports Range - Navy Tennis Bag",
      description: "Perfect for tennis players and sports enthusiasts.",
      longDescription: "The Sports Range Navy Tennis Bag is designed specifically for tennis players. It features specialized compartments for racquets, balls, and other tennis equipment.",
      price: 1800,
      originalPrice: 2200,
      rating: 4,
      reviewCount: 6,
      inStock: true,
      badge: "Sports",
      category: "sports",
      colors: ["#1e3a8a", "#3b82f6"],
      features: [
        "Racquet compartment",
        "Ball pockets",
        "Water bottle holder",
        "Durable material",
        "Comfortable straps"
      ],
      images: [
        "/Sports Range - Navy Tennis Bag_1757319569359.png",
        "/Sports Range - Navy Tennis Bag_1757319569359.png"
      ],
      materials: "Heavy-duty canvas and nylon",
      dimensions: "50cm x 25cm x 20cm",
      careInstructions: "Machine washable, air dry",
      featured: false,
      createdAt: new Date()
    },
    {
      id: 5,
      name: "Leisure Range - Weekend Getaway",
      description: "Perfect for weekend trips and short getaways.",
      longDescription: "The Leisure Range Weekend Getaway bag is designed for short trips and weekend adventures. It offers plenty of space while remaining compact and easy to carry.",
      price: 1600,
      originalPrice: 2000,
      rating: 4,
      reviewCount: 4,
      inStock: true,
      badge: "Travel",
      category: "leisure",
      colors: ["#059669", "#10b981", "#34d399"],
      features: [
        "Weekend capacity",
        "Multiple compartments",
        "Easy access pockets",
        "Lightweight design",
        "Travel-friendly"
      ],
      images: [
        "/Leisure Range - Weekend Getaway_1757319569359.png",
        "/Leisure Range - Weekend Getaway_1757319569359.png"
      ],
      materials: "Lightweight nylon and polyester",
      dimensions: "45cm x 30cm x 18cm",
      careInstructions: "Spot clean, air dry",
      featured: false,
      createdAt: new Date()
    },
    {
      id: 6,
      name: "Business Range - Executive Briefcase",
      description: "Professional briefcase for business executives.",
      longDescription: "The Business Range Executive Briefcase is designed for professionals who need to carry important documents and electronics. It features a sophisticated design and premium materials.",
      price: 3200,
      originalPrice: 3800,
      rating: 5,
      reviewCount: 10,
      inStock: true,
      badge: "Executive",
      category: "business",
      colors: ["#1f2937", "#374151", "#4b5563"],
      features: [
        "Document compartments",
        "Laptop protection",
        "Premium materials",
        "Professional design",
        "Secure closures"
      ],
      images: [
        "/Business Range - Executive Briefcase_1757319569359.png",
        "/Business Range - Executive Briefcase_1757319569359.png"
      ],
      materials: "Premium leather and metal hardware",
      dimensions: "44cm x 34cm x 8cm",
      careInstructions: "Professional leather care, avoid moisture",
      featured: true,
      createdAt: new Date()
    },
    {
      id: 7,
      name: "Onboarding Range - Starter Pack",
      description: "Perfect starter bag for new professionals.",
      longDescription: "The Onboarding Range Starter Pack is designed for new professionals entering the workforce. It offers all the essential features at an affordable price.",
      price: 1200,
      originalPrice: 1500,
      rating: 4,
      reviewCount: 7,
      inStock: true,
      badge: "Starter",
      category: "onboarding",
      colors: ["#7c3aed", "#8b5cf6", "#a78bfa"],
      features: [
        "Essential compartments",
        "Affordable price",
        "Professional look",
        "Durable construction",
        "Easy to use"
      ],
      images: [
        "/Onboarding Range - Starter Pack_1757319569359.png",
        "/Onboarding Range - Starter Pack_1757319569359.png"
      ],
      materials: "Quality synthetic leather",
      dimensions: "38cm x 28cm x 12cm",
      careInstructions: "Clean with damp cloth, avoid harsh chemicals",
      featured: false,
      createdAt: new Date()
    },
    {
      id: 8,
      name: "Accessories Range - Desk Mat",
      description: "Premium desk mat for your workspace.",
      longDescription: "The Accessories Range Desk Mat provides a comfortable and stylish surface for your workspace. Made from premium materials, it protects your desk while adding elegance to your office.",
      price: 800,
      originalPrice: 1000,
      rating: 5,
      reviewCount: 3,
      inStock: true,
      badge: "Accessory",
      category: "accessories",
      colors: ["#92400e", "#d97706", "#f59e0b"],
      features: [
        "Premium materials",
        "Desk protection",
        "Elegant design",
        "Easy to clean",
        "Non-slip base"
      ],
      images: [
        "/Accessories Range - Desk Mat_1757319569359.png",
        "/Accessories Range - Desk Mat_1757319569359.png"
      ],
      materials: "Premium leather and rubber base",
      dimensions: "60cm x 40cm x 0.5cm",
      careInstructions: "Clean with damp cloth, air dry",
      featured: false,
      createdAt: new Date()
    },
    {
      id: 9,
      name: "Test Bag",
      description: "Test product for development and testing purposes.",
      longDescription: "This is a test product used for development and testing. It has a low price to test payment processing and shipping calculations.",
      price: 200, // R2.00 in cents
      originalPrice: 300,
      rating: 5,
      reviewCount: 1,
      inStock: true,
      badge: "Test",
      category: "business",
      colors: ["#ef4444", "#f87171"],
      features: [
        "Test product",
        "Low price",
        "Development use",
        "Payment testing",
        "Shipping testing"
      ],
      images: [
        "/Test Bag_1757319569359.png",
        "/Test Bag_1757319569359.png"
      ],
      materials: "Test materials",
      dimensions: "30cm x 20cm x 10cm",
      careInstructions: "Test care instructions",
      featured: false,
      createdAt: new Date()
    }
  ];

  private orders: Order[] = [];
  private contacts: Contact[] = [];

  // Products
  async getAllProducts(): Promise<Product[]> {
    return [...this.products];
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.products.filter(product => product.featured);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.find(product => product.id === id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(product => product.category === category);
  }

  // Orders
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const newOrder: Order = {
      id: this.orders.length + 1,
      ...orderData,
      createdAt: new Date()
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.find(order => order.id === id);
  }

  async getAllOrders(): Promise<Order[]> {
    return [...this.orders];
  }

  // Contacts
  async createContact(contactData: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact> {
    const newContact: Contact = {
      id: this.contacts.length + 1,
      ...contactData,
      createdAt: new Date()
    };
    this.contacts.push(newContact);
    return newContact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return [...this.contacts];
  }
}

// Export the in-memory storage for now (will be replaced with Prisma)
export const memStorage = new MemStorage();