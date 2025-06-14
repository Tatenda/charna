import { products, type Product, type InsertProduct } from "@shared/schema";
import { orders, type Order, type InsertOrder } from "@shared/schema";
import { contacts, type Contact, type InsertContact } from "@shared/schema";

// Storage Interface
export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
}

// Memory Storage Implementation
export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private contacts: Map<number, Contact>;
  private nextProductId: number;
  private nextOrderId: number;
  private nextContactId: number;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.contacts = new Map();
    this.nextProductId = 1;
    this.nextOrderId = 1;
    this.nextContactId = 1;
    
    // Initialize with sample products
    this.initializeProducts();
  }

  // Initialize sample products
  private initializeProducts() {
    // Tennis Bag Tote
    this.products.set(1, {
      id: 1,
      name: "Concetto Tennis Tote",
      description: "An exquisite cognac leather tennis bag that embodies sophistication and functionality. Crafted with meticulous attention to detail for the discerning athlete.",
      longDescription: "The Concetto Tennis Tote represents the pinnacle of luxury sporting accessories. Each bag is meticulously handcrafted from the finest Italian full-grain leather, showcasing our commitment to uncompromising quality and timeless design. The rich cognac finish develops a beautiful patina over time, making each piece uniquely yours.\n\nDesigned for the sophisticated athlete who appreciates craftsmanship, this tote seamlessly transitions from court to club. The thoughtfully designed interior accommodates all your tennis essentials while maintaining an elegant silhouette that speaks to your refined taste.",
      price: 3299,
      originalPrice: 3899,
      rating: 50, // 5.0
      reviewCount: 42,
      inStock: true,
      badge: "Signature",
      category: "tennis",
      colors: ["cognac"],
      features: [
        "Premium Italian full-grain leather",
        "Hand-stitched construction",
        "Signature brass hardware",
        "Multiple interior compartments",
        "Racket-specific organization",
        "Luxurious suede lining"
      ],
      images: [
        "/images/tennis-bag-lifestyle.jpg",
        "/images/tennis-bag-action.jpg",
        "/images/tennis-bag-court.jpg"
      ],
      materials: "Handcrafted from premium Italian full-grain leather in cognac. Signature brass hardware with antique finish. Interior lined with luxurious suede.",
      dimensions: "L 52cm x W 22cm x H 36cm. Handle drop: 26cm.",
      careInstructions: "Clean with premium leather care products only. Store in provided dust bag. Professional conditioning recommended every 6 months.",
      featured: true,
      createdAt: new Date("2024-01-15T00:00:00Z")
    });

    // Executive Business Tote - Ivory
    this.products.set(2, {
      id: 2,
      name: "Concetto Executive Tote - Ivory",
      description: "An elegant compact leather tote in pristine ivory, designed for the sophisticated professional. Perfect for daily essentials with refined Italian craftsmanship.",
      longDescription: "The Concetto Executive Tote in Ivory represents understated luxury at its finest. Crafted from the most exquisite Italian full-grain leather, this compact yet functional tote is designed for the discerning professional who values both style and substance.\n\nThe pristine ivory finish exudes sophistication while the structured silhouette maintains its elegant form throughout daily use. Each piece is meticulously handcrafted with attention to every detail, from the precise stitching to the signature brass hardware that bears the Concetto mark of excellence.\n\nThis versatile tote seamlessly transitions from boardroom to social events, making it an essential accessory for the modern executive who appreciates timeless design and uncompromising quality.",
      price: 2799,
      originalPrice: 3299,
      rating: 48, // 4.8
      reviewCount: 31,
      inStock: true,
      badge: "Limited Edition",
      category: "business",
      colors: ["ivory"],
      features: [
        "Premium Italian ivory leather",
        "Compact professional design",
        "Interior laptop sleeve (13\")",
        "Structured top handles",
        "Magnetic closure",
        "Multiple organization pockets",
        "Signature Concetto hardware"
      ],
      images: [
        "/images/concetto-brand-logo.jpg",
        "/images/work-backpack-studio.jpg"
      ],
      materials: "Crafted from finest Italian full-grain leather in ivory. Signature brass hardware with gold finish. Lined with premium cotton canvas.",
      dimensions: "L 38cm x W 12cm x H 28cm. Handle drop: 22cm.",
      careInstructions: "Handle with care due to light color. Use specialized ivory leather cleaner. Store in provided dust bag. Professional cleaning recommended.",
      featured: true,
      createdAt: new Date("2024-02-01T00:00:00Z")
    });

    // Executive Business Backpack - Forest
    this.products.set(3, {
      id: 3,
      name: "Concetto Executive Backpack - Forest",
      description: "A statement piece in luxurious forest green leather. This sophisticated backpack merges contemporary design with timeless elegance for the modern professional.",
      longDescription: "The Concetto Executive Backpack in Forest Green is a bold statement of contemporary luxury. This exceptional piece showcases our mastery of leather craftsmanship through its rich, deep forest green hue that develops character with each use.\n\nDesigned for the modern professional who dares to stand out, this backpack combines cutting-edge functionality with classic Italian leather craftsmanship. The sophisticated forest green leather is complemented by premium brass hardware, creating a striking contrast that speaks to refined taste.\n\nEvery aspect of this backpack has been thoughtfully considered, from the ergonomic strap design to the organized interior compartments. It's not just a bag – it's a testament to your commitment to excellence and appreciation for the finer things in life.",
      price: 3899,
      originalPrice: 4499,
      rating: 50, // 5.0
      reviewCount: 18,
      inStock: true,
      badge: "Exclusive",
      category: "business",
      colors: ["forest green"],
      features: [
        "Luxurious forest green Italian leather",
        "Contemporary backpack design",
        "Laptop compartment (15\")",
        "Premium padded leather straps",
        "Front zippered compartment",
        "Interior organizational system",
        "Signature Concetto branding"
      ],
      images: [
        "/images/green-backpack-lifestyle.jpg",
        "/images/concetto-brand-logo.jpg"
      ],
      materials: "Handcrafted from exclusive forest green Italian leather. Premium brass hardware with brushed finish. Interior lined with signature Concetto fabric.",
      dimensions: "L 32cm x W 16cm x H 42cm. Adjustable straps: 70-85cm.",
      careInstructions: "Maintain with premium leather conditioner. Avoid prolonged sun exposure. Store upright in dust bag when not in use.",
      featured: true,
      createdAt: new Date("2024-02-10T00:00:00Z")
    });
  }

  // Product Methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  // Order Methods
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.nextOrderId++;
    const newOrder: Order = {
      ...order,
      id,
      createdAt: new Date(),
      status: order.status || "pending"
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  // Contact Methods
  async createContact(contact: InsertContact): Promise<Contact> {
    const id = this.nextContactId++;
    const newContact = {
      ...contact,
      id,
      createdAt: new Date()
    };
    this.contacts.set(id, newContact);
    return newContact;
  }
}

// Export a singleton instance
export const storage = new MemStorage();
