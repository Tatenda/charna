# Payment Setup Guide

## Current Configuration

Your application uses **Yoco** for payment processing with environment-based configuration:

- **All Environments**: Uses `YOCO_SECRET_KEY` for both test and live modes

## Switching to Live Payments

### 1. Get Your Live Yoco Keys
1. Log into your [Yoco Dashboard](https://dashboard.yoco.com/)
2. Navigate to **Settings** → **API Keys**
3. Generate your **Live Secret Key** (different from your test key)

### 2. Set Environment Variables in Vercel

#### Option A: Via Vercel Dashboard
1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project → **Settings** → **Environment Variables**
3. Add these variables:
   - `YOCO_SECRET_KEY` = `your_secret_key_here`
   - `NODE_ENV` = `production` (if not already set)

#### Option B: Via Vercel CLI
```bash
vercel env add YOCO_SECRET_KEY
# Enter your live secret key when prompted

vercel env add NODE_ENV
# Enter "production" when prompted
```

### 3. Deploy to Production
After setting the environment variables, redeploy your application:
```bash
vercel --prod
```

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `YOCO_SECRET_KEY` | Secret key for current environment | `sk_test_...` or `sk_live_...` |
| `NODE_ENV` | Environment mode | `production` for live payments |

## Testing Live Payments

⚠️ **Important**: When testing live payments, use small amounts and real payment methods. Live payments will charge real money!

### Safe Testing Approach
1. Start with very small amounts (e.g., R1.00)
2. Use your own payment method first
3. Test the complete flow: payment → success → failure scenarios
4. Monitor your Yoco dashboard for transaction logs

## Verification

To verify you're in live mode, check the console logs during payment processing. You should see:
- `Environment: production`
- `Using live secret key: Present`

### Frontend Changes
The payment component will automatically hide the test card information when deployed to production. In development mode, you'll see:
- Test card information: "Use test card: 4111 1111 1111 1111..."

In production mode, this test information will be hidden and only show:
- "Your payment will be processed securely through Yoco's encrypted payment system."

## Security Notes

- Never commit API keys to your repository
- Use environment variables for all sensitive data
- Regularly rotate your API keys
- Monitor your Yoco dashboard for any suspicious activity
