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
    // Tennis Bag (White)
    this.products.set(1, {
      id: 1,
      name: "Leather Tennis Bag Tote",
      description: "Our elegant white leather tennis bag combines style and functionality. Featuring premium South African leather with striking red accents, this spacious tote comfortably holds your racket, gear, and personal items.",
      longDescription: "Designed for the stylish athlete who values quality craftsmanship, our Leather Tennis Bag Tote is the perfect companion for your sporting lifestyle. Made from premium South African leather, each bag is meticulously crafted by our skilled artisans to ensure exceptional quality and durability. The distinctive red accent straps not only add a pop of color but also provide sturdy support for carrying your gear.\n\nThe spacious interior easily accommodates a standard tennis racket, tennis balls, shoes, and other essentials, while the inner pocket keeps your valuables safe and organized. Whether you're heading to the court or meeting friends after a match, this versatile tote transitions effortlessly from sport to social settings.",
      price: 1850,
      originalPrice: 2200,
      rating: 49, // 4.9
      reviewCount: 28,
      inStock: true,
      badge: "Bestseller",
      category: "tennis",
      colors: ["white"],
      features: [
        "Premium South African leather",
        "Handcrafted by local artisans",
        "Spacious interior compartment",
        "Distinctive red accent straps",
        "Fits standard tennis rackets",
        "Durable metal hardware"
      ],
      images: [
        "/images/tennis-bag-lifestyle.jpg",
        "/images/tennis-bag-action.jpg",
        "/images/tennis-bag-court.jpg"
      ],
      materials: "Made from 100% genuine leather sourced from responsible South African suppliers. Metal hardware with antique finish. Interior lined with durable canvas.",
      dimensions: "L 50cm x W 20cm x H 35cm. Handle drop: 25cm.",
      careInstructions: "Spot clean with a damp cloth. Avoid prolonged exposure to direct sunlight. Apply leather conditioner every 3-6 months to maintain suppleness.",
      featured: true,
      createdAt: new Date("2023-01-15T00:00:00Z")
    });

    // Work Backpack (Black)
    this.products.set(2, {
      id: 2,
      name: "Leather Work Backpack",
      description: "Our premium black leather work backpack is the perfect blend of professionalism and practicality. Handcrafted from luxurious South African leather, this sleek backpack features a minimalist design with thoughtful organization.",
      longDescription: "Elevate your professional style with our sophisticated Leather Work Backpack. Meticulously handcrafted from premium South African leather, this backpack combines timeless elegance with modern functionality. The sleek, minimalist design makes it suitable for any professional setting while providing ample space for your work essentials.\n\nThoughtfully designed with the modern professional in mind, the backpack features a padded laptop compartment that safely holds devices up to 15 inches, multiple interior pockets for organization, and a convenient front zip pocket for quick access to your most-used items. The water-resistant lining adds an extra layer of protection for your valuable electronics and documents.\n\nThe adjustable shoulder straps are padded for comfort during your daily commute, while the top carrying handle offers an alternative carrying option. This versatile backpack effortlessly transitions from the office to business travel, maintaining its sophisticated look throughout your professional journey.",
      price: 2450,
      originalPrice: null,
      rating: 47, // 4.7
      reviewCount: 19,
      inStock: true,
      badge: "New Arrival",
      category: "work",
      colors: ["black"],
      features: [
        "Premium black leather",
        "Laptop compartment (up to 15\")",
        "Front zippered pocket",
        "Adjustable shoulder straps",
        "Water-resistant lining",
        "Top carrying handle"
      ],
      images: [
        "/images/work-backpack-studio.jpg",
        "/images/work-backpack-urban.jpg"
      ],
      materials: "Crafted from 100% genuine South African leather. Metal zippers and hardware with matte black finish. Interior lined with water-resistant nylon.",
      dimensions: "L 30cm x W 15cm x H 40cm. Laptop compartment: 15\" max. Shoulder strap drop: adjustable up to 40cm.",
      careInstructions: "Wipe clean with a soft, dry cloth. For stains, use a leather cleaner specifically designed for black leather. Condition every 3-6 months to maintain leather quality.",
      featured: true,
      createdAt: new Date("2023-03-10T00:00:00Z")
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
