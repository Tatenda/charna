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
  rangeIds?: number[];
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
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  promoCodeId?: number;
  promoCodeUsed?: string;
  paymentId?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
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
    embossingText?: string;
    embossingPrice: number;
    embossingOptionId?: number;
    color?: string;
    bagColor?: string;
    sleeveColor?: string;
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
  // Shipping address
  address: string;
  city: string;
  province: string;
  postalCode: string;
  // Billing address (when different from shipping)
  billingAddress?: string;
  billingCity?: string;
  billingProvince?: string;
  billingPostalCode?: string;
  notes?: string;
  sameAsBilling: boolean;
  acceptTerms: boolean;
}

// Extended Order type with typed customer info
export interface OrderWithCustomerInfo extends Omit<Order, 'customerInfo'> {
  customerInfo: CustomerInfo;
}

// Promo Code interfaces
export interface PromoCode {
  id: number;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  usedCount: number;
  maxUsesPerUser?: number;
  validFrom: Date;
  validUntil?: Date;
  minimumOrderValue?: number;
  isActive: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromoCodeUsage {
  id: number;
  promoCodeId: number;
  orderId?: number;
  customerEmail: string;
  discountApplied: number;
  createdAt: Date;
}

export interface PromoCodeValidationRequest {
  code: string;
  orderTotal: number;
  customerEmail?: string;
}

export interface PromoCodeValidationResponse {
  valid: boolean;
  discount: number;
  message: string;
  promoCode?: PromoCode;
  discountedTotal?: number;
}