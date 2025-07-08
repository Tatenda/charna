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
      name: "LIGREMO Tennis Tote",
      description: "An exquisite cognac leather tennis bag that embodies sophistication and functionality. Crafted with meticulous attention to detail for the discerning athlete.",
      longDescription: "The LIGREMO Tennis Tote represents the pinnacle of luxury sporting accessories. Each bag is meticulously handcrafted from the finest Italian full-grain leather, showcasing our commitment to uncompromising quality and timeless design. The rich cognac finish develops a beautiful patina over time, making each piece uniquely yours.\n\nDesigned for the sophisticated athlete who appreciates craftsmanship, this tote seamlessly transitions from court to club. The thoughtfully designed interior accommodates all your tennis essentials while maintaining an elegant silhouette that speaks to your refined taste.",
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
      materials: "Handcrafted from premium Italian full-grain leather, made in South Africa. Signature brass hardware with antique finish. Interior lined with luxurious suede.",
      dimensions: "L 52cm x W 22cm x H 36cm. Handle drop: 26cm.",
      careInstructions: "Clean with premium leather care products only. Store in provided dust bag. Professional conditioning recommended every 6 months.",
      featured: true,
      createdAt: new Date("2024-01-15T00:00:00Z")
    });

    // Executive Business Tote - Ivory (with lifestyle shots)
    this.products.set(2, {
      id: 2,
      name: "LIGREMO Executive Tote - Ivory",
      description: "An elegant compact leather tote in pristine ivory, designed for the sophisticated professional. Perfect for daily essentials with refined Italian craftsmanship.",
      longDescription: "The LIGREMO Executive Tote in Ivory represents understated luxury at its finest. Crafted from the most exquisite Italian full-grain leather, this compact yet functional tote is designed for the discerning professional who values both style and substance.\n\nThe pristine ivory finish exudes sophistication while the structured silhouette maintains its elegant form throughout daily use. Each piece is meticulously handcrafted with attention to every detail, from the precise stitching to the signature brass hardware that bears the LIGREMO mark of excellence.\n\nThis versatile tote seamlessly transitions from boardroom to social events, making it an essential accessory for the modern executive who appreciates timeless design and uncompromising quality.",
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
        "Signature LIGREMO hardware"
      ],
      images: [
        "/images/concetto-brand-logo.jpg",
        "/images/green-backpack-lifestyle.jpg"
      ],
      materials: "Crafted from finest Italian full-grain leather, handmade in South Africa. Signature brass hardware with gold finish. Lined with premium cotton canvas.",
      dimensions: "L 38cm x W 12cm x H 28cm. Handle drop: 22cm.",
      careInstructions: "Handle with care due to light color. Use specialized ivory leather cleaner. Store in provided dust bag. Professional cleaning recommended.",
      featured: true,
      createdAt: new Date("2024-02-01T00:00:00Z")
    });

    // Compact Executive Backpack - Ivory
    this.products.set(3, {
      id: 3,
      name: "LIGREMO Compact Backpack - Ivory",
      description: "An exquisite compact backpack in pristine ivory leather. Perfect for the sophisticated professional who values both elegance and functionality in a refined silhouette.",
      longDescription: "The LIGREMO Compact Backpack in Ivory represents the pinnacle of understated luxury. This beautifully proportioned piece is crafted from the finest Italian leather in a timeless ivory finish that exudes sophistication and grace.\n\nDesigned for the discerning individual who appreciates refined aesthetics, this compact backpack offers the perfect balance of form and function. The clean lines and minimalist design speak to contemporary sensibilities while the premium craftsmanship honors traditional Italian leather artistry.\n\nEvery detail has been meticulously considered, from the precision stitching to the carefully selected hardware. This is more than a backpack – it's a statement of refined taste and appreciation for the finer things in life.",
      price: 3299,
      originalPrice: 3799,
      rating: 49, // 4.9
      reviewCount: 24,
      inStock: true,
      badge: "Signature",
      category: "business",
      colors: ["ivory"],
      features: [
        "Premium Italian ivory leather",
        "Compact sophisticated design",
        "Laptop compartment (13\")",
        "Refined minimalist aesthetic",
        "Premium leather straps",
        "Interior organization pockets",
        "Signature brass hardware"
      ],
      images: [
        "/images/ivory-backpack-studio.jpg",
        "/images/concetto-brand-logo.jpg"
      ],
      materials: "Handcrafted from finest Italian full-grain leather, made in South Africa. Premium brass hardware with polished finish. Interior lined with luxurious cotton canvas.",
      dimensions: "L 28cm x W 14cm x H 38cm. Adjustable straps: 65-80cm.",
      careInstructions: "Handle with care due to light color. Use specialized ivory leather cleaner. Store in provided dust bag. Professional conditioning recommended every 6 months.",
      featured: true,
      createdAt: new Date("2024-02-15T00:00:00Z")
    });

    // Tanned Leather Work Tote
    this.products.set(4, {
      id: 4,
      name: "LIGREMO Tanned Leather Work Tote",
      description: "A sophisticated tanned leather backpack designed for the modern professional. Features premium hardware and versatile design for work or travel.",
      longDescription: "The LIGREMO Tanned Leather Work Tote represents the perfect fusion of professional functionality and timeless elegance. Crafted from richly tanned Italian leather, this backpack develops a beautiful patina over time, making each piece uniquely yours.\n\nDesigned for the contemporary professional who values both style and substance, this versatile tote features multiple compartments for optimal organization. The rich tanned leather finish exudes warmth and sophistication, while the premium hardware adds refined details that speak to exceptional craftsmanship.\n\nWhether you're heading to the office or embarking on a business trip, this work tote seamlessly combines Italian design heritage with practical functionality for today's demanding lifestyle.",
      price: 3599,
      originalPrice: 4199,
      rating: 50, // 5.0
      reviewCount: 18,
      inStock: true,
      badge: "Professional",
      category: "business",
      colors: ["tan"],
      features: [
        "Premium Italian tanned leather",
        "Professional work design",
        "Multiple organization compartments",
        "Laptop compartment (15\")",
        "Convertible carry options",
        "Premium metal hardware",
        "Signature LIGREMO craftsmanship"
      ],
      images: [
        "/attached_assets/IMG_1420_1751996515357.PNG",
        "/attached_assets/IMG_1421_1751996519606.PNG"
      ],
      materials: "Crafted from finest Italian tanned leather, handmade in Johannesburg. Premium metal hardware with antique brass finish. Interior lined with durable cotton canvas.",
      dimensions: "L 32cm x W 16cm x H 42cm. Adjustable straps: 70-85cm.",
      careInstructions: "Clean with premium leather care products. The tanned leather will develop a beautiful patina over time. Store in provided dust bag. Professional conditioning recommended every 6 months.",
      featured: true,
      createdAt: new Date("2025-01-08T00:00:00Z")
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
