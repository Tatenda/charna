import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Products Table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  rating: integer("rating").notNull().default(5), // For simplicity, storing as an integer * 10 (e.g., 4.5 => 45)
  reviewCount: integer("review_count").notNull().default(0),
  inStock: boolean("in_stock").notNull().default(true),
  badge: text("badge"),
  category: text("category").notNull(),
  colors: jsonb("colors").notNull().$type<string[]>(),
  features: jsonb("features").notNull().$type<string[]>(),
  images: jsonb("images").notNull().$type<string[]>(),
  materials: text("materials").notNull(),
  dimensions: text("dimensions").notNull(),
  careInstructions: text("care_instructions").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerInfo: jsonb("customer_info").notNull(),
  items: jsonb("items").notNull().$type<OrderItem[]>(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Contact Form Submissions
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema Types
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

// Order Item Type for the order items jsonb field
export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

// Insert Schemas
export const insertProductSchema = createInsertSchema(products);
export const insertOrderSchema = createInsertSchema(orders);
export const insertContactSchema = createInsertSchema(contacts);
