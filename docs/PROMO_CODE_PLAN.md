# Promo Code System - Complete Implementation Plan

## Overview
A comprehensive promotional code system that allows admins to create, manage, and track discount codes, while customers can apply them during checkout.

---

## 1. Database Schema

### PromoCode Model
```prisma
model PromoCode {
  id              Int       @id @default(autoincrement())
  code            String    @unique // e.g., "SUMMER2025", "WELCOME10"
  description     String?   // Internal note about the promo
  
  // Discount Configuration
  discountType    String    // "percentage" or "fixed" (R50 off vs 10% off)
  discountValue   Int       // 10 for 10% or 5000 for R50.00 (in cents)
  
  // Usage Limits
  maxUses         Int?      // null = unlimited, otherwise max number of uses
  usedCount       Int       @default(0) // Track how many times used
  maxUsesPerUser  Int?      @default(1) // How many times one user can use it
  
  // Validity Period
  validFrom       DateTime  @default(now())
  validUntil      DateTime? // null = no expiry
  
  // Constraints
  minimumOrderValue Int?    // Minimum order value in cents (e.g., 50000 = R500)
  
  // Applicable Products/Categories (future enhancement)
  applicableToAll Boolean   @default(true)
  // productIds      Int[]?    // Specific products (future)
  // categoryIds     Int[]?    // Specific categories (future)
  
  // Status
  isActive        Boolean   @default(true)
  
  // Metadata
  createdBy       String?   // Admin who created it
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  orders          Order[]   @relation("OrderPromoCode")
  usageLogs       PromoCodeUsage[]
  
  @@map("promo_codes")
}

model PromoCodeUsage {
  id            Int       @id @default(autoincrement())
  promoCodeId   Int       @map("promo_code_id")
  orderId       Int?      @map("order_id") // null if validation only
  customerEmail String    @map("customer_email")
  discountApplied Int     @map("discount_applied") // Amount in cents
  createdAt     DateTime  @default(now())
  
  promoCode     PromoCode @relation(fields: [promoCodeId], references: [id], onDelete: Cascade)
  
  @@map("promo_code_usage")
}
```

### Updated Order Model
```prisma
model Order {
  id              Int      @id @default(autoincrement())
  customerInfo    Json     @map("customer_info")
  items           Json     // Array of OrderItem objects
  
  // Pricing Breakdown
  subtotal        Int      @map("subtotal")        // Original price before discount
  discountAmount  Int      @default(0) @map("discount_amount") // Discount in cents
  totalAmount     Int      @map("total_amount")    // Final amount after discount
  
  // Promo Code
  promoCodeId     Int?     @map("promo_code_id")
  promoCode       PromoCode? @relation("OrderPromoCode", fields: [promoCodeId], references: [id])
  promoCodeUsed   String?  @map("promo_code_used") // Store the actual code string
  
  // Payment
  paymentId       String?  @map("payment_id")
  status          String   @default("pending")
  
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("orders")
}
```

---

## 2. Admin Features

### A. Promo Code Management Page (`/admin/promo-codes`)

#### Features:
1. **List View**
   - Display all promo codes in a table/card view
   - Show: Code, Discount, Usage (X/Y), Valid dates, Status
   - Filter by: Active/Inactive, Expired, Usage
   - Search by code
   - Sort by creation date, expiry, usage

2. **Create Promo Code**
   - **Basic Info:**
     - Code (auto-generate option or manual input)
     - Description (internal note)
   
   - **Discount Settings:**
     - Type: Percentage or Fixed Amount
     - Value: Input field
     - Preview: "10% off" or "R50.00 off"
   
   - **Usage Limits:**
     - Max total uses (unlimited option)
     - Max uses per customer (default: 1)
   
   - **Validity Period:**
     - Start date/time
     - End date/time (optional)
     - Quick presets: 1 week, 1 month, 3 months, No expiry
   
   - **Constraints:**
     - Minimum order value (optional)
     - Future: Specific products/categories
   
   - **Bulk Generation:**
     - Generate multiple unique codes with same settings
     - Pattern: PREFIX-XXXX (e.g., WELCOME-A1B2, WELCOME-C3D4)
     - Quantity: How many to generate

3. **Edit Promo Code**
   - All fields editable except code itself
   - Can deactivate/activate
   - View usage history

4. **Analytics Dashboard**
   - Total codes created
   - Active codes
   - Total discounts given
   - Most used codes
   - Revenue impact

---

## 3. API Endpoints Needed

### Admin Endpoints
```
GET    /api/admin/promo-codes           - List all promo codes
POST   /api/admin/promo-codes           - Create new promo code(s)
GET    /api/admin/promo-codes/:id       - Get specific promo code details
PUT    /api/admin/promo-codes/:id       - Update promo code
DELETE /api/admin/promo-codes/:id       - Delete promo code
GET    /api/admin/promo-codes/:id/usage - Get usage logs for a code

POST   /api/admin/promo-codes/bulk      - Bulk generate codes
GET    /api/admin/promo-codes/analytics - Get analytics data
```

### Customer/Checkout Endpoints
```
POST   /api/promo-codes/validate        - Validate a promo code
       Body: { code, orderTotal, customerEmail }
       Returns: { valid, discount, message }

POST   /api/promo-codes/apply           - Apply code to order (creates usage log)
       Body: { code, orderId, customerEmail, orderTotal }
       Returns: { success, discountAmount, newTotal }
```

### Order Endpoints (Updated)
```
POST   /api/orders                      - Create order (include promo code data)
GET    /api/admin/orders                - List all orders (with promo details)
GET    /api/admin/orders/:id            - Get order details
```

---

## 4. Checkout Flow Updates

### Current Checkout → Enhanced Checkout

#### Step 1: Cart Summary
- Show subtotal (before discount)
- **NEW:** Promo code input field
- Apply button
- Show discount if code applied
- Show final total

#### Step 2: Validation Process
```javascript
// Pseudo-code flow
1. User enters promo code
2. Click "Apply Code"
3. Frontend validates format (not empty, etc.)
4. Call POST /api/promo-codes/validate
5. Backend checks:
   - Code exists
   - Code is active
   - Within valid date range
   - Not exceeded max uses
   - Customer hasn't exceeded per-user limit
   - Order meets minimum value
6. Return validation result
7. If valid:
   - Calculate discount
   - Update cart total
   - Show success message
   - Display discount breakdown
8. If invalid:
   - Show error message
   - Don't apply discount
```

#### Step 3: Order Submission
```javascript
// Include in order creation
{
  customerInfo: {...},
  items: [...],
  subtotal: 500000,        // R5000.00
  promoCode: "SUMMER10",   // The code used
  discountAmount: 50000,   // R500.00 off
  totalAmount: 450000,     // R4500.00 final
  // ... other fields
}
```

#### UI Components Needed:
1. **PromoCodeInput Component**
   - Input field
   - Apply/Remove button
   - Loading state
   - Success/Error messages
   - Visual feedback (green checkmark, red X)

2. **Price Breakdown Component**
   ```
   Subtotal:        R5,000.00
   Promo (SUMMER10): -R500.00 (10% off)
   ─────────────────────────
   Total:           R4,500.00
   ```

---

## 5. Admin Order Management

### Orders List Page (`/admin/orders`)

#### Display Columns:
- Order ID
- Date
- Customer Name/Email
- Items Count
- **Subtotal** (original price)
- **Promo Code** (badge if used)
- **Discount** (amount saved)
- **Total** (final amount)
- Status
- Actions

#### Order Details View:
```
Order #12345
Customer: John Doe (john@example.com)
Date: 2025-10-08

Items:
1. Grounded Tan Backpack x1 - R1,999.00
2. Laptop Sleeve x1          - R1,100.00
                              ─────────
Subtotal:                     R3,099.00

Promo Code: WELCOME10
Discount Type: 10% off
Discount Amount:              -R309.90
                              ─────────
Total:                        R2,789.10

Payment: Paid via Yoco (ID: yoco_xyz123)
Status: Completed
```

---

## 6. What You Might Be Missing

### Additional Considerations:

1. **Code Generation Strategy**
   - Random alphanumeric (e.g., A7B9C2D4)
   - Pattern-based (e.g., SUMMER-XXXX)
   - Human-readable (e.g., WELCOME10, SAVE20)
   - Avoid confusing characters (0/O, 1/I/l)

2. **Security**
   - Rate limiting on validation endpoint
   - CAPTCHA for public code validation (prevent brute force)
   - Case-insensitive code matching
   - Trim whitespace from input

3. **User Experience**
   - Show "You saved RX.XX" message
   - Auto-apply codes from URL parameters (?code=WELCOME10)
   - Remember codes in session
   - Email confirmation shows discount

4. **Business Rules**
   - Can codes stack? (Usually no)
   - Rounding rules for percentage discounts
   - What happens if item is removed from cart?
   - Discount on subtotal or including shipping?

5. **Notifications**
   - Email admin when code usage reaches 80%
   - Notify when codes are about to expire
   - Alert for unusual usage patterns (fraud detection)

6. **Reports & Analytics**
   - Revenue with/without promo codes
   - Average discount per order
   - Conversion rate with promo codes
   - Customer acquisition cost per code
   - Export usage data (CSV)

7. **Customer Features**
   - "Invalid code" vs "Expired code" messages
   - Show savings in order history
   - Newsletter signup codes
   - Referral codes (future)

8. **Edge Cases**
   - What if code becomes invalid during checkout?
   - Handle timezone differences
   - Promo code + sale items (allow/disallow)
   - Partial refunds with promo codes

---

## 7. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Database schema migration
- [ ] Basic CRUD API endpoints
- [ ] Admin promo code list page
- [ ] Create single promo code

### Phase 2: Validation & Application (Week 2)
- [ ] Validation API endpoint
- [ ] Checkout promo code input
- [ ] Apply discount logic
- [ ] Order model updates

### Phase 3: Admin Enhancement (Week 3)
- [ ] Bulk code generation
- [ ] Usage tracking
- [ ] Analytics dashboard
- [ ] Order list with promo details

### Phase 4: Polish & Testing (Week 4)
- [ ] Edge case handling
- [ ] Error messages
- [ ] Email notifications
- [ ] Security hardening
- [ ] Performance optimization

---

## 8. Database Migration Plan

```prisma
// Add to schema.prisma
model PromoCode {
  // ... (as defined above)
}

model PromoCodeUsage {
  // ... (as defined above)
}

// Update Order model
// Add fields: subtotal, discountAmount, promoCodeId, promoCodeUsed
```

Then run:
```bash
npx prisma migrate dev --name add_promo_codes
npx prisma generate
```

---

## 9. Sample Promo Code Scenarios

### Example 1: Welcome Discount
- **Code:** WELCOME10
- **Type:** Percentage
- **Value:** 10%
- **Max Uses:** Unlimited
- **Per User:** 1 time only
- **Valid:** Permanent
- **Min Order:** R500

### Example 2: Flash Sale
- **Code:** FLASH50
- **Type:** Fixed
- **Value:** R50
- **Max Uses:** 100
- **Per User:** 1 time
- **Valid:** 24 hours
- **Min Order:** R200

### Example 3: Bulk Welcome Codes
- **Pattern:** WELCOME2025-XXXX
- **Quantity:** 50 codes
- **Type:** Percentage
- **Value:** 15%
- **Max Uses:** 1 per code
- **Valid:** 3 months

---

## 10. Testing Checklist

- [ ] Valid code applies correctly
- [ ] Invalid code shows error
- [ ] Expired code rejected
- [ ] Max uses limit enforced
- [ ] Per-user limit enforced
- [ ] Minimum order value enforced
- [ ] Code removed if cart total drops below minimum
- [ ] Percentage rounds correctly
- [ ] Fixed discount doesn't exceed total
- [ ] Analytics track correctly
- [ ] Order history shows promo details
- [ ] Admin can deactivate codes
- [ ] Bulk generation creates unique codes
- [ ] Email shows discount applied

---

## Next Steps

1. **Review & Approve** this plan
2. **Create database migration** for new models
3. **Build API endpoints** (start with validation)
4. **Create admin UI** for promo management
5. **Update checkout flow** with promo input
6. **Update order management** to show promo details
7. **Test thoroughly** with various scenarios
8. **Deploy** in phases

---

## Questions to Consider

1. Should percentage discounts round up or down?
2. Allow promo codes on already discounted items?
3. Show promo code field to everyone or only logged-in users?
4. Auto-apply codes from marketing emails?
5. Track which marketing channel code came from?
6. Loyalty program integration in future?
7. Gift card codes vs promo codes (separate system)?

