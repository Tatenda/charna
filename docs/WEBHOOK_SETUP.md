# Webhook-Based Order Creation Setup

## Overview

This setup ensures orders are created **server-side when payment is confirmed** via Yoco webhooks, not client-side in the success page. This prevents lost orders if users close their browser or if the success page fails to load.

## How It Works

### Current (Improved) Flow:
1. User fills out checkout form
2. **Checkout data is stored** in `pending_checkouts` table
3. User is redirected to Yoco payment
4. User completes payment with Yoco
5. **Yoco webhook fires → Order created server-side** 
6. User returns to success page → Displays already-created order

### Benefits:
✅ Orders are never lost even if success page doesn't load  
✅ Server-side order creation is more secure  
✅ Duplicate orders are prevented  
✅ Automatic email confirmation  
✅ Promo codes are tracked correctly  

## Setup Steps

### 1. Run Database Migration

```bash
npm run prisma:migrate
# or
npx prisma migrate deploy
```

This creates the `pending_checkouts` table.

### 2. Regenerate Prisma Client

```bash
npx prisma generate
```

### 3. Configure Yoco Webhook

**Important:** Yoco webhooks must be registered via API (no dashboard UI available).

#### Get Your Yoco API Keys:
1. Log in to **Yoco App**
2. Go to **Sales** → **Payment Gateway**
3. Copy your **Test secret key** (starts with `sk_test_`)
   - For production: Copy **Live secret key** (starts with `sk_live_`)

#### Register Webhook Using Script:

```bash
# Set your webhook URL (production)
export WEBHOOK_URL=https://www.charna.co.za/api/webhooks/yoco

# Run registration script
npx tsx scripts/register-yoco-webhook.ts

# For local testing with ngrok:
# 1. Start ngrok: ngrok http 3000
# 2. export WEBHOOK_URL=https://abc123.ngrok.io/api/webhooks/yoco
# 3. npx tsx scripts/register-yoco-webhook.ts
```

#### Or Register Manually via API:

```bash
# Using curl
curl -X POST https://payments.yoco.com/api/webhooks \
  -H "Authorization: Bearer sk_test_YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "charna-webhook",
    "url": "https://www.charna.co.za/api/webhooks/yoco"
  }'
```

#### List Existing Webhooks:

```bash
npx tsx scripts/register-yoco-webhook.ts --list
```

### 4. Test the Webhook

#### Option A: Use Yoco's Test Mode
1. Set `YOCO_SECRET_KEY` to test key
2. Make a test payment
3. Check webhook logs in Yoco dashboard

#### Option B: Test Locally with ngrok
```bash
# Terminal 1: Start your dev server
npm run dev

# Terminal 2: Start ngrok
ngrok http 3000

# Use ngrok URL in Yoco webhook settings:
# https://abc123.ngrok.io/api/webhooks/yoco
```

### 5. Verify It's Working

After a successful payment:
1. Check server logs for: `Order {id} created successfully via webhook`
2. Check admin dashboard: Order should appear immediately
3. Check email: Customer should receive confirmation
4. Check database: `orders` table should have the order

## Code Changes Made

### New Files:
- `/pages/api/webhooks/yoco.ts` - Yoco webhook handler
- `/pages/api/checkouts/pending.ts` - Store pending checkout data
- `/prisma/migrations/*/migration.sql` - Pending checkouts table

### Database Schema:
Added `PendingCheckout` model to store checkout data before payment.

### Updated Files (To Do):
- `/pages/checkout.tsx` - Store pending checkout before redirecting to payment
- `/pages/checkout/success.tsx` - Check if order exists instead of creating it

## Fallback Strategy

The system has **multiple fallback layers**:

1. **Best Case**: Webhook creates order → Success page displays it
2. **Fallback 1**: If webhook fails, success page creates order client-side
3. **Fallback 2**: If no checkout data found, webhook creates minimal order for manual review

## Monitoring

### Webhook Logs
Check your server logs for:
- `=== YOCO WEBHOOK RECEIVED ===`
- `Order {id} created successfully via webhook`
- `Payment succeeded: {paymentId}`

### Failed Webhooks
Orders with status `pending_verification` need manual review:
```sql
SELECT * FROM orders WHERE status = 'pending_verification';
```

### Cleanup Old Pending Checkouts
Pending checkouts expire after 1 hour. Consider adding a cron job to clean them up:
```sql
DELETE FROM pending_checkouts WHERE expires_at < NOW();
```

## Security Considerations

### Webhook Signature Verification (Recommended for Production)
Yoco sends a signature header that you should verify:

```typescript
// In webhook handler
const signature = req.headers['x-yoco-signature'];
if (!verifyYocoSignature(signature, req.body, process.env.YOCO_WEBHOOK_SECRET)) {
  return res.status(401).json({ message: 'Invalid signature' });
}
```

Ask Yoco support for your webhook secret key.

### IP Whitelist (Optional)
You can restrict webhook endpoint to only accept requests from Yoco's IP addresses.

## Troubleshooting

### Webhook Not Firing
- ✅ Check Yoco webhook is configured correctly
- ✅ Verify URL is publicly accessible (not localhost)
- ✅ Check Yoco webhook logs in dashboard
- ✅ Ensure SSL certificate is valid

### Orders Not Being Created
- ✅ Check pending checkout was stored: `SELECT * FROM pending_checkouts;`
- ✅ Check webhook logs for errors
- ✅ Verify `checkoutId` matches between pending checkout and webhook

### Duplicate Orders
- ✅ Check for duplicate webhook calls in logs
- ✅ System prevents duplicates by checking `paymentId`

### Email Not Sending
- ✅ Order is still created even if email fails
- ✅ Check email service configuration
- ✅ Check server logs for email errors

## Testing Checklist

- [ ] Test payment succeeds → Order created
- [ ] Test payment fails → No order created
- [ ] Test payment succeeds but success page doesn't load → Order still created
- [ ] Test promo code → Discount tracked correctly
- [ ] Test email confirmation → Customer receives email
- [ ] Test webhook duplicate → Only one order created
- [ ] Test expired pending checkout → Cleaned up properly

## Migration from Old System

If you have existing orders created client-side:
1. Deploy webhook setup
2. Both systems will work in parallel (fallback strategy)
3. Monitor for a week
4. Once confident, remove client-side order creation from success page

## Support

If you encounter issues:
1. Check server logs
2. Check Yoco webhook logs in dashboard
3. Review `pending_checkouts` and `orders` tables
4. Contact Yoco support for webhook-specific issues

