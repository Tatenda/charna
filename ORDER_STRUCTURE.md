# Order Data Structure

## Database Schema

### Orders Table (`orders`)

```prisma
model Order {
  id              Int       @id @default(autoincrement())
  customerInfo    Json      @map("customer_info")
  items           Json      // Array of cart items with product details
  subtotal        Int       // Price before discounts (in Rands)
  discountAmount  Int       @default(0) @map("discount_amount") // Promo code discount
  totalAmount     Int       @map("total_amount") // Final amount paid
  promoCodeId     Int?      @map("promo_code_id") // FK to promo code used
  promoCodeUsed   String?   @map("promo_code_used") // Promo code string
  paymentId       String?   @map("payment_id") // Yoco payment ID
  status          String    @default("pending") // Order status
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
}
```

---

## Fields Explained

### Basic Info
- **id**: Auto-incrementing order number
- **status**: Order status (`pending`, `completed`, `cancelled`, etc.)
- **createdAt**: When order was placed
- **updatedAt**: Last modification time

### Customer Information (JSON)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "customer@example.com",
  "phone": "+27123456789",
  "address": "123 Main St",
  "city": "Johannesburg",
  "province": "Gauteng",
  "postalCode": "2000"
}
```

### Items (JSON Array)
```json
[
  {
    "productId": 1,
    "productName": "Laptop Bag - Navy",
    "quantity": 1,
    "price": 1100,
    "customizations": {
      "embossing": true,
      "embossingText": "JD",
      "embossingPrice": 80
    }
  },
  {
    "productId": 2,
    "productName": "Tennis Bag",
    "quantity": 2,
    "price": 850,
    "customizations": null
  }
]
```

### Pricing Fields
- **subtotal**: Total before discount (e.g., 2200 = R2,200)
- **discountAmount**: Promo code discount (e.g., 220 = R220 off)
- **totalAmount**: Final amount paid (e.g., 1980 = R1,980)

**All prices stored as integers (in Rands, not cents)**

### Promo Code Fields
- **promoCodeId**: Database ID of promo code (for joins)
- **promoCodeUsed**: Actual promo code string (e.g., "SUMMER10")

### Payment Info
- **paymentId**: Yoco payment ID (e.g., "p_PLmQeONzzYqUkDAIbMiMKQLm")
  - Used to prevent duplicate orders
  - Links to Yoco transaction

---

## Example Order Record

```json
{
  "id": 1,
  "customerInfo": {
    "firstName": "Tatenda",
    "lastName": "Makunike",
    "email": "tjmakunike@gmail.com",
    "phone": "+27123456789",
    "address": "123 Main Street",
    "city": "Johannesburg",
    "province": "Gauteng",
    "postalCode": "2000"
  },
  "items": [
    {
      "productId": 24,
      "productName": "Navy",
      "quantity": 1,
      "price": 1100,
      "customizations": {
        "embossing": false,
        "embossingPrice": 0
      }
    },
    {
      "productId": 25,
      "productName": "Olive",
      "quantity": 1,
      "price": 1100,
      "customizations": {
        "embossing": false,
        "embossingPrice": 0
      }
    }
  ],
  "subtotal": 2200,
  "discountAmount": 0,
  "totalAmount": 2200,
  "promoCodeId": null,
  "promoCodeUsed": null,
  "paymentId": "p_PLmQeONzzYqUkDAIbMiMKQLm",
  "status": "completed",
  "createdAt": "2025-10-10T13:04:06.702Z",
  "updatedAt": "2025-10-10T13:04:06.702Z"
}
```

---

## Data Sources

Orders can be created from:

### 1. Webhook (Preferred)
- **When**: Payment succeeds (server-side)
- **Data Source**: Webhook metadata
- **Reliability**: ✅ Most reliable
- **Duplicate Prevention**: Checks `paymentId` first

### 2. Success Page (Fallback)
- **When**: User lands on success page
- **Data Source**: localStorage + cart
- **Reliability**: ⚠️ Less reliable (user might close browser)
- **Duplicate Prevention**: Checks if order exists before creating

---

## Duplicate Prevention

Both webhook and success page check for existing orders:

```typescript
// Check if order already exists
const existingOrder = await prisma.order.findFirst({
  where: { paymentId: 'p_xxxxx' }
});

if (existingOrder) {
  return existingOrder; // Don't create duplicate
}
```

---

## Query Orders

### Get All Orders:
```typescript
const orders = await prisma.order.findMany({
  orderBy: { createdAt: 'desc' }
});
```

### Get Order by Payment ID:
```typescript
const order = await prisma.order.findFirst({
  where: { paymentId: 'p_xxxxx' }
});
```

### Get Orders with Promo Codes:
```typescript
const orders = await prisma.order.findMany({
  where: { 
    promoCodeUsed: { not: null }
  }
});
```

### Get Customer's Orders:
```typescript
const orders = await prisma.order.findMany({
  where: {
    customerInfo: {
      path: ['email'],
      equals: 'customer@example.com'
    }
  }
});
```

---

## Admin Dashboard Display

In `/admin/orders`, orders show:
- Order number (#1, #2, etc.)
- Customer name and email
- Total amount
- Discount applied (if any)
- Promo code badge (if used)
- Items count
- Order date/time
- Status

---

**All order data is persisted permanently and never lost!** 🎉

