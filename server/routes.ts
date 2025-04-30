import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const featured = req.query.featured === "true";
      const products = featured 
        ? await storage.getFeaturedProducts()
        : await storage.getAllProducts();
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = req.body;
      
      // Basic validation
      if (!orderData.customerInfo || !orderData.items || !orderData.totalAmount) {
        return res.status(400).json({ message: "Missing required order information" });
      }
      
      // Create order
      const order = await storage.createOrder({
        customerInfo: orderData.customerInfo,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        status: "pending",
      });
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate contact form data
      const contactData = insertContactSchema.parse(req.body);
      
      // Store contact submission
      const contact = await storage.createContact(contactData);
      
      res.status(201).json({ 
        success: true, 
        message: "Contact form submitted successfully" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid form data",
          errors: error.errors 
        });
      }
      
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
