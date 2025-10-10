# Abandoned & Failed Order Tracking - Enhancement Plan

## Overview

This document outlines enhancements needed to track abandoned checkouts, failed payments, and conversion funnel analytics. Implement these to gain complete visibility into lost revenue opportunities and improve conversion rates.

---

## Current State (What We Have)

### ✅ Implemented
1. **Pending Checkouts Table**
   - Stores checkout data before payment
   - Expires after 1 hour
   - Used by webhook to create orders

2. **Successful Order Flow**
   - Webhook creates orders on `payment.succeeded`
   - Promo code tracking
   - Automated email confirmations

3. **Basic Abandonment Detection**
   - Can query expired `pending_checkouts` to find abandoned carts
   - Simple SQL: `SELECT * FROM pending_checkouts WHERE expires_at < NOW()`

### ❌ Missing
1. Failed payment tracking
2. Payment cancellation tracking  
3. Partial checkout abandonment (form not submitted)
4. Failure reason analysis
5. Recovery/retry mechanisms
6. Analytics dashboard
7. Automated recovery emails

---

## Phase 1: Enhanced Webhook Event Handling

### 1.1 Add Failed Payment Tracking

**New Webhook Events to Handle:**
```typescript
// In /pages/api/webhooks/yoco.ts

// Add handlers for:
- payment.failed
- payment.cancelled
- checkout.expired
- charge.failed
```

**Create Failed Orders Table:**
```sql
CREATE TABLE failed_orders (
  id TEXT PRIMARY KEY,
  payment_id TEXT,
  checkout_id TEXT,
  failure_reason TEXT NOT NULL,
  failure_code TEXT,
  amount INTEGER NOT NULL,
  customer_email TEXT,
  customer_info JSONB,
  items JSONB,
  retry_count INTEGER DEFAULT 0,
  last_retry_at TIMESTAMP,
  can_retry BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_customer_email (customer_email),
  INDEX idx_created_at (created_at),
  INDEX idx_can_retry (can_retry)
);
```

**Prisma Schema Addition:**
```prisma
model FailedOrder {
  id             String    @id @default(cuid())
  paymentId      String?   @map("payment_id")
  checkoutId     String?   @map("checkout_id")
  failureReason  String    @map("failure_reason")
  failureCode    String?   @map("failure_code")
  amount         Int
  customerEmail  String?   @map("customer_email")
  customerInfo   Json?     @map("customer_info")
  items          Json?
  retryCount     Int       @default(0) @map("retry_count")
  lastRetryAt    DateTime? @map("last_retry_at")
  canRetry       Boolean   @default(true) @map("can_retry")
  createdAt      DateTime  @default(now()) @map("created_at")

  @@index([customerEmail])
  @@index([createdAt])
  @@index([canRetry])
  @@map("failed_orders")
}
```

### 1.2 Update Webhook Handler

**File: `/pages/api/webhooks/yoco.ts`**

```typescript
// Add new event handlers:

if (event.type === 'payment.failed') {
  const paymentData = event.payload;
  
  // Find pending checkout
  const pendingCheckout = await prisma.pendingCheckout.findUnique({
    where: { checkoutId: paymentData.checkoutId }
  });
  
  // Create failed order record
  await prisma.failedOrder.create({
    data: {
      paymentId: paymentData.id,
      checkoutId: paymentData.checkoutId,
      failureReason: paymentData.failureReason || 'Unknown',
      failureCode: paymentData.failureCode,
      amount: paymentData.amount,
      customerEmail: pendingCheckout?.customerInfo?.email,
      customerInfo: pendingCheckout?.customerInfo,
      items: pendingCheckout?.items,
      canRetry: determineIfRetryable(paymentData.failureCode)
    }
  });
  
  // Keep pending checkout for potential retry
  // Don't delete it yet
}

if (event.type === 'payment.cancelled') {
  // Similar handling for cancellations
  await prisma.failedOrder.create({
    data: {
      failureReason: 'Customer cancelled',
      // ... other fields
    }
  });
}
```

**Helper Function:**
```typescript
function determineIfRetryable(failureCode: string): boolean {
  const retryableCodes = [
    'insufficient_funds',
    'card_declined',
    'expired_card'
  ];
  
  const nonRetryableCodes = [
    'fraudulent',
    'lost_card',
    'stolen_card'
  ];
  
  if (retryableCodes.includes(failureCode)) return true;
  if (nonRetryableCodes.includes(failureCode)) return false;
  
  return true; // Default to retryable
}
```

---

## Phase 2: Checkout Journey Tracking

### 2.1 Track Checkout Funnel Steps

**Create Checkout Events Table:**
```sql
CREATE TABLE checkout_events (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'cart_viewed', 'checkout_started', 'payment_initiated', 'order_completed'
  customer_email TEXT,
  cart_value INTEGER,
  items_count INTEGER,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_session_id (session_id),
  INDEX idx_event_type (event_type),
  INDEX idx_created_at (created_at)
);
```

**Prisma Schema:**
```prisma
model CheckoutEvent {
  id            Int       @id @default(autoincrement())
  sessionId     String    @map("session_id")
  eventType     String    @map("event_type")
  customerEmail String?   @map("customer_email")
  cartValue     Int?      @map("cart_value")
  itemsCount    Int?      @map("items_count")
  metadata      Json?
  createdAt     DateTime  @default(now()) @map("created_at")

  @@index([sessionId])
  @@index([eventType])
  @@index([createdAt])
  @@map("checkout_events")
}
```

### 2.2 Track Events in Frontend

**File: `/pages/cart.tsx`**
```typescript
useEffect(() => {
  // Track cart view
  trackCheckoutEvent({
    eventType: 'cart_viewed',
    sessionId: getSessionId(),
    cartValue: cartTotal,
    itemsCount: cart.length
  });
}, []);
```

**File: `/pages/checkout.tsx`**
```typescript
useEffect(() => {
  trackCheckoutEvent({
    eventType: 'checkout_started',
    sessionId: getSessionId(),
    customerEmail: form.watch('email'),
    cartValue: totalAmount
  });
}, []);

const handlePaymentInitiated = () => {
  trackCheckoutEvent({
    eventType: 'payment_initiated',
    sessionId: getSessionId(),
    customerEmail: customerInfo.email,
    cartValue: totalAmount
  });
};
```

**File: `/pages/checkout/success.tsx`**
```typescript
useEffect(() => {
  if (orderCreated) {
    trackCheckoutEvent({
      eventType: 'order_completed',
      sessionId: getSessionId(),
      customerEmail: customerInfo.email,
      cartValue: totalAmount
    });
  }
}, [orderCreated]);
```

**Create API Endpoint: `/pages/api/analytics/track-event.ts`**
```typescript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await prisma.checkoutEvent.create({
    data: req.body
  });

  return res.status(200).json({ success: true });
}
```

---

## Phase 3: Analytics & Reporting

### 3.1 Abandoned Checkout Dashboard

**Create Admin Page: `/pages/admin/analytics/abandoned-checkouts.tsx`**

**Features:**
- List of abandoned checkouts (last 30 days)
- Filter by date range, value, customer
- Export to CSV
- Quick actions: Send recovery email, View details

**SQL Queries:**
```sql
-- Get abandoned checkouts
SELECT 
  pc.*,
  EXTRACT(EPOCH FROM (NOW() - pc.created_at))/3600 as hours_ago
FROM pending_checkouts pc
WHERE pc.expires_at < NOW()
  AND NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.payment_id = pc.checkout_id
  )
ORDER BY pc.created_at DESC;

-- Conversion funnel
SELECT 
  event_type,
  COUNT(*) as count,
  COUNT(DISTINCT session_id) as unique_sessions
FROM checkout_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY event_type
ORDER BY 
  CASE event_type
    WHEN 'cart_viewed' THEN 1
    WHEN 'checkout_started' THEN 2
    WHEN 'payment_initiated' THEN 3
    WHEN 'order_completed' THEN 4
  END;
```

### 3.2 Failed Payment Dashboard

**Create Admin Page: `/pages/admin/analytics/failed-payments.tsx`**

**Features:**
- List of failed payments
- Group by failure reason
- Retry success rate
- Revenue recovery potential

**SQL Queries:**
```sql
-- Failed payments summary
SELECT 
  failure_reason,
  COUNT(*) as count,
  SUM(amount) as total_value,
  AVG(retry_count) as avg_retries,
  SUM(CASE WHEN can_retry THEN 1 ELSE 0 END) as retryable_count
FROM failed_orders
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY failure_reason
ORDER BY total_value DESC;

-- Recovery opportunity
SELECT 
  SUM(amount)/100.0 as potential_revenue_zar,
  COUNT(*) as recoverable_orders
FROM failed_orders
WHERE can_retry = true
  AND retry_count < 3
  AND created_at > NOW() - INTERVAL '7 days';
```

### 3.3 Conversion Metrics API

**Create: `/pages/api/admin/analytics/metrics.ts`**

```typescript
export default async function handler(req, res) {
  const { startDate, endDate } = req.query;

  const metrics = {
    // Funnel conversion rates
    cartToCheckout: await getConversionRate('cart_viewed', 'checkout_started'),
    checkoutToPayment: await getConversionRate('checkout_started', 'payment_initiated'),
    paymentToOrder: await getConversionRate('payment_initiated', 'order_completed'),
    
    // Abandonment
    abandonedCarts: await getAbandonedCount('cart_viewed'),
    abandonedCheckouts: await getAbandonedCount('checkout_started'),
    
    // Failed payments
    failedPayments: await getFailedPaymentStats(),
    
    // Recovery potential
    recoveryOpportunity: await getRecoveryOpportunity(),
  };

  return res.json(metrics);
}
```

---

## Phase 4: Recovery & Retry Mechanisms

### 4.1 Abandoned Cart Recovery Emails

**Create Email Templates:**
1. **1 hour after abandonment**: "You left items in your cart"
2. **24 hours after**: "Still interested? Here's 10% off"
3. **3 days after**: "Last chance - Your cart expires soon"

**Create Cron Job: `/pages/api/cron/send-recovery-emails.ts`**

```typescript
// Run every hour
export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Find abandoned checkouts (1 hour old)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const abandoned = await prisma.pendingCheckout.findMany({
    where: {
      createdAt: {
        lte: oneHourAgo,
        gte: new Date(Date.now() - 2 * 60 * 60 * 1000) // Not older than 2 hours
      }
    }
  });

  for (const checkout of abandoned) {
    await sendRecoveryEmail(checkout);
  }

  return res.json({ sent: abandoned.length });
}
```

**Configure in Vercel:**
```bash
# vercel.json
{
  "crons": [{
    "path": "/api/cron/send-recovery-emails",
    "schedule": "0 * * * *"  // Every hour
  }]
}
```

### 4.2 Failed Payment Retry

**Create: `/pages/api/payments/retry.ts`**

```typescript
export default async function handler(req, res) {
  const { failedOrderId } = req.body;

  const failedOrder = await prisma.failedOrder.findUnique({
    where: { id: failedOrderId }
  });

  if (!failedOrder.canRetry) {
    return res.status(400).json({ error: 'Order cannot be retried' });
  }

  // Create new checkout with same data
  const newCheckout = await createCheckout({
    customerInfo: failedOrder.customerInfo,
    items: failedOrder.items,
    amount: failedOrder.amount
  });

  // Update retry count
  await prisma.failedOrder.update({
    where: { id: failedOrderId },
    data: {
      retryCount: { increment: 1 },
      lastRetryAt: new Date()
    }
  });

  return res.json({ checkoutUrl: newCheckout.redirectUrl });
}
```

---

## Phase 5: Advanced Analytics

### 5.1 Cohort Analysis

Track customer behavior over time:
- First-time vs returning customer conversion
- Average time to purchase
- Abandonment patterns by time of day/week

### 5.2 A/B Testing Framework

Test checkout flow variations:
- Different form layouts
- Payment page designs
- Recovery email content

### 5.3 Predictive Analytics

Machine learning to:
- Predict likelihood of abandonment
- Optimal recovery email timing
- Personalized discount amounts

---

## Implementation Priority

### 🔴 High Priority (Implement First)
1. ✅ Failed payment webhook handling
2. ✅ Failed orders table
3. ✅ Basic abandonment report

### 🟡 Medium Priority (Next Quarter)
4. ⏳ Checkout journey tracking
5. ⏳ Analytics dashboard
6. ⏳ Recovery emails

### 🟢 Low Priority (Future)
7. ⏳ Retry mechanisms
8. ⏳ Advanced analytics
9. ⏳ Predictive models

---

## Success Metrics

Track these KPIs after implementation:

1. **Conversion Rate**
   - Target: 3-5% cart → order
   - Measure: Weekly

2. **Recovery Rate**
   - Target: 15-20% of abandoned carts recovered
   - Measure: Monthly

3. **Failed Payment Recovery**
   - Target: 30% of failed payments retry successfully
   - Measure: Monthly

4. **Revenue Recovery**
   - Target: R10,000+ per month from recovery emails
   - Measure: Monthly

---

## Technical Considerations

### Database Cleanup
```sql
-- Run monthly: Delete old abandoned checkouts
DELETE FROM pending_checkouts 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Archive old failed orders
INSERT INTO failed_orders_archive 
SELECT * FROM failed_orders 
WHERE created_at < NOW() - INTERVAL '1 year';

DELETE FROM failed_orders 
WHERE created_at < NOW() - INTERVAL '1 year';
```

### Performance
- Index all date columns
- Partition large tables by month
- Use materialized views for analytics

### Privacy & GDPR
- Allow customers to request data deletion
- Don't store sensitive payment details
- Respect email unsubscribe preferences
- Expire customer data after 2 years

---

## Cost Estimation

### Development Time
- Phase 1: 8-12 hours
- Phase 2: 12-16 hours  
- Phase 3: 16-20 hours
- Phase 4: 12-16 hours
- **Total: 48-64 hours**

### Infrastructure Costs
- Database storage: ~R50/month extra
- Email service (SendGrid/Mailgun): R200-500/month
- Cron jobs: Included in Vercel
- **Total: R250-550/month**

### Expected ROI
- Average cart value: R1,500
- 100 abandoned carts/month
- 15% recovery rate = 15 orders
- **Revenue recovery: R22,500/month**
- **Net benefit: R22,000+/month**

---

## Next Steps

When ready to implement:

1. **Review this document** with team
2. **Prioritize phases** based on business needs
3. **Set up tracking** in project management tool
4. **Create database backup** before schema changes
5. **Implement Phase 1** (failed payments)
6. **Test thoroughly** before production
7. **Monitor metrics** weekly
8. **Iterate based on data**

---

## Resources

- [Yoco Webhook Documentation](https://developer.yoco.com/webhooks)
- [Abandoned Cart Best Practices](https://www.shopify.com/blog/abandoned-cart-email)
- [E-commerce Analytics Guide](https://www.optimizely.com/optimization-glossary/ecommerce-analytics/)
- [GDPR Compliance Checklist](https://gdpr.eu/checklist/)

---

**Document Created:** 2025-10-10  
**Last Updated:** 2025-10-10  
**Status:** 📋 Planning Phase  
**Owner:** Development Team

