# Testing Webhooks Locally

## Overview

Since webhooks require a publicly accessible URL, you need to expose your local server to the internet for testing. This guide shows you how to test Yoco webhooks on your local development environment.

---

## Method 1: Using ngrok (Recommended)

### Step 1: Install ngrok

```bash
# Using Homebrew (macOS)
brew install ngrok

# Or download from: https://ngrok.com/download
```

### Step 2: Start Your Dev Server

```bash
# Terminal 1
npm run dev
# Server runs on http://localhost:3000
```

### Step 3: Start ngrok Tunnel

```bash
# Terminal 2
ngrok http 3000

# You'll see output like:
# Forwarding: https://abc123.ngrok.io -> http://localhost:3000
```

**Copy the https URL** (e.g., `https://abc123.ngrok.io`)

### Step 4: Register Webhook with ngrok URL

```bash
# Terminal 3
cd /Users/tatenda/projects/charna

# Register webhook
WEBHOOK_URL=https://abc123.ngrok.io/api/webhooks/yoco \
npx tsx scripts/register-yoco-webhook.ts
```

You'll get output like:
```
✅ Webhook registered successfully!
ID: sub_xxxxx
URL: https://abc123.ngrok.io/api/webhooks/yoco
```

### Step 5: Make a Test Payment

1. Open your site via ngrok URL: `https://abc123.ngrok.io`
2. Add products to cart
3. Go to checkout
4. Use Yoco test card:
   - **Card**: `4242 4242 4242 4242`
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date
5. Complete payment

### Step 6: Watch Webhook Events

```bash
# In Terminal 1 (where dev server is running)
# You should see:
=== YOCO WEBHOOK RECEIVED ===
Payment succeeded: pay_xxxxx
Order {id} created successfully via webhook
```

### Step 7: Verify Order Created

1. Check admin dashboard: `/admin/orders`
2. Order should appear immediately
3. Check promo code usage if you applied one

### Step 8: Cleanup (When Done Testing)

```bash
# Delete the test webhook
npx tsx scripts/delete-yoco-webhook.ts sub_xxxxx

# Stop ngrok (Ctrl+C in Terminal 2)
```

---

## Method 2: Using Vercel Preview Deployment

### Step 1: Deploy to Vercel Preview

```bash
# Create a feature branch
git checkout -b test-webhook

# Make a small change and commit
git commit --allow-empty -m "test: webhook testing"

# Push to trigger preview deployment
git push origin test-webhook
```

### Step 2: Get Preview URL

Vercel will give you a preview URL like:
`https://charna-xyz123.vercel.app`

### Step 3: Register Webhook with Preview URL

```bash
WEBHOOK_URL=https://charna-xyz123.vercel.app/api/webhooks/yoco \
npx tsx scripts/register-yoco-webhook.ts
```

### Step 4: Test on Preview Site

Use the preview URL to test payments and see webhook events in Vercel logs.

---

## Method 3: Using LocalTunnel (Alternative to ngrok)

```bash
# Install
npm install -g localtunnel

# Start dev server
npm run dev

# Create tunnel
lt --port 3000

# Use the URL provided (e.g., https://xyz.loca.lt)
```

---

## Monitoring Webhook Events

### View in Terminal (Real-time):

Your dev server will log webhook events:
```bash
npm run dev

# When webhook fires, you'll see:
[webhook] === YOCO WEBHOOK RECEIVED ===
[webhook] Type: payment.succeeded
[webhook] Payment ID: pay_xxxxx
[webhook] Order created: #123
```

### View in ngrok Dashboard:

1. Open: http://localhost:4040 (while ngrok is running)
2. See all HTTP requests including webhook POSTs
3. Inspect request/response details

### View in Vercel Logs (Preview):

1. Go to Vercel dashboard
2. Find your preview deployment
3. Click "Functions" tab
4. View `/api/webhooks/yoco` logs

---

## Test Scenarios

### Scenario 1: Successful Payment

**Test:**
1. Complete checkout with valid test card
2. Payment succeeds

**Expected:**
- ✅ Webhook receives `payment.succeeded` event
- ✅ Order created in database
- ✅ Promo code usage incremented (if used)
- ✅ Email confirmation sent
- ✅ Order appears in admin dashboard

**Logs to Check:**
```
=== YOCO WEBHOOK RECEIVED ===
Payment succeeded: pay_xxxxx
Order 1 created successfully via webhook
Order confirmation email sent
```

### Scenario 2: User Closes Browser After Payment

**Test:**
1. Complete payment
2. Close browser immediately (don't wait for success page)

**Expected:**
- ✅ Webhook still fires
- ✅ Order still created
- ✅ Email still sent
- ✅ No data lost!

### Scenario 3: Duplicate Webhook Events

**Test:**
1. Complete payment
2. Yoco might send webhook multiple times

**Expected:**
- ✅ First webhook creates order
- ✅ Subsequent webhooks see existing order
- ✅ No duplicate orders created
- ✅ Log: "Order already processed"

### Scenario 4: Payment with Promo Code

**Test:**
1. Apply promo code
2. Complete payment

**Expected:**
- ✅ Webhook receives promo code data
- ✅ Order has discount amount
- ✅ Promo code usage count +1
- ✅ Usage log created with customer email

---

## Debugging Webhooks

### Not Receiving Webhooks?

#### Check 1: Webhook Registration
```bash
# List registered webhooks
npx tsx scripts/register-yoco-webhook.ts --list

# Should show your webhook URL
```

#### Check 2: URL is Publicly Accessible
```bash
# Test from outside
curl https://your-ngrok-url.ngrok.io/api/webhooks/yoco

# Should return: Method not allowed (expected)
# Should NOT return: Connection refused
```

#### Check 3: Server Logs
```bash
# Your dev server should log all incoming requests
# If no logs, webhook isn't reaching your server
```

#### Check 4: ngrok Expired
```bash
# Free ngrok URLs expire after ~2 hours
# Re-run ngrok and update webhook:

# 1. Start new ngrok session
ngrok http 3000

# 2. Delete old webhook
npx tsx scripts/delete-yoco-webhook.ts sub_OLD_ID

# 3. Register new webhook with new URL
WEBHOOK_URL=https://new-url.ngrok.io/api/webhooks/yoco \
npx tsx scripts/register-yoco-webhook.ts
```

### Webhook Receives Event But Order Not Created?

#### Check 1: Pending Checkout Data
```bash
# Check if checkout data was stored
npx tsx -e "import {prisma} from './lib/prisma'; (async()=>{const pc=await prisma.pendingCheckout.findMany();console.log('Pending checkouts:',pc);await prisma.\$disconnect();})();"
```

#### Check 2: Server Error Logs
```bash
# Check your dev server terminal for errors
# Look for stack traces after "=== YOCO WEBHOOK RECEIVED ==="
```

#### Check 3: Database Connection
```bash
# Verify development database is accessible
npx tsx scripts/backup-database.ts
```

---

## Webhook Payload Examples

### payment.succeeded Event:
```json
{
  "type": "payment.succeeded",
  "id": "evt_xxxxx",
  "createdDate": "2025-10-10T12:00:00Z",
  "payload": {
    "id": "pay_xxxxx",
    "checkoutId": "ch_xxxxx",
    "amount": 299900,
    "currency": "ZAR",
    "status": "successful",
    "metadata": {
      "customerEmail": "customer@example.com",
      "customerName": "John Doe"
    }
  }
}
```

### checkout.succeeded Event:
```json
{
  "type": "checkout.succeeded",
  "id": "evt_xxxxx",
  "payload": {
    "id": "ch_xxxxx",
    "status": "complete",
    "amount": 299900,
    "metadata": { ... }
  }
}
```

---

## Tips & Best Practices

### ✅ DO:
- Test on development database first
- Use Yoco test keys for local testing
- Monitor ngrok dashboard for webhook attempts
- Keep ngrok session alive during testing
- Check both terminal logs and ngrok dashboard

### ❌ DON'T:
- Use production database for webhook testing
- Use live Yoco keys in development
- Forget to delete test webhooks after testing
- Leave ngrok tunnels running when not testing
- Test with real payment methods

---

## Quick Testing Commands

```bash
# 1. Start everything
npm run dev                          # Terminal 1
ngrok http 3000                      # Terminal 2

# 2. Register webhook (Terminal 3)
WEBHOOK_URL=https://YOUR_NGROK_URL.ngrok.io/api/webhooks/yoco \
npx tsx scripts/register-yoco-webhook.ts

# 3. Make test payment
# Visit: https://YOUR_NGROK_URL.ngrok.io

# 4. Watch logs in Terminal 1 for webhook events

# 5. Cleanup when done
npx tsx scripts/delete-yoco-webhook.ts sub_WEBHOOK_ID
```

---

## Yoco Test Cards

Use these for testing (no real money charged):

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- CVV: Any 3 digits
- Expiry: Any future date

**Declined Payment:**
- Card: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

**3D Secure Required:**
- Card: `4000 0027 6000 3184`
- Complete 3DS flow when prompted

---

**Ready to test?** Start ngrok and register your webhook!

