// Basic types for the application
// These will be replaced with Prisma-generated types once the database is set up

export interface Product {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  badge?: string;
  category: string;
  colors: string[];
  features: string[];
  images: string[];
  materials: string;
  dimensions: string;
  careInstructions: string;
  featured: boolean;
  createdAt: Date;
  isPackage?: boolean;
  packageItems?: Array<{
    id: number;
    variantId: number;
    quantity: number;
    size?: string;
    displayOrder: number;
    variant: {
      id: number;
      name: string;
      sku: string;
      price: number;
      originalPrice?: number;
      inStock: boolean;
      images: string[];
      isDefault: boolean;
      attributes: Array<{
        attributeType: string;
        attributeValue: string;
      }>;
    };
  }>;
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
    displayName: string;
    isPrimary: boolean;
  }>;
  variants?: Array<{
    id: number;
    name: string;
    sku: string;
    price: number;
    originalPrice?: number;
    inStock: boolean;
    images: string[];
    isDefault: boolean;
    attributes: Array<{
      attributeType: string;
      attributeValue: string;
    }>;
  }>;
}

export interface Order {
  id: number;
  customerInfo: any; // Will be typed properly with Prisma
  items: OrderItem[];
  totalAmount: number;
  paymentId?: string;
  status: string;
  createdAt: Date;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: Date;
}

// Order Item interface for JSON field
export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  customizations?: {
    embossing: boolean;
    embossingPrice: number;
  };
}

// Extended Order type with typed items
export interface OrderWithItems extends Omit<Order, 'items'> {
  items: OrderItem[];
}

// Customer info interface for JSON field
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
  sameAsBilling: boolean;
  acceptTerms: boolean;
}

// Extended Order type with typed customer info
export interface OrderWithCustomerInfo extends Omit<Order, 'customerInfo'> {
  customerInfo: CustomerInfo;
}