/**
 * Register Yoco Webhook
 * 
 * This script registers your webhook URL with Yoco's API.
 * Run once to set up webhook for payment notifications.
 * 
 * Usage:
 *   npx tsx scripts/register-yoco-webhook.ts
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

async function registerWebhook() {
  const secretKey = process.env.YOCO_SECRET_KEY;
  
  if (!secretKey) {
    console.error('❌ YOCO_SECRET_KEY not found in environment variables');
    console.log('\nAdd to your .env or .env.local:');
    console.log('YOCO_SECRET_KEY=sk_test_YOUR_KEY_HERE');
    process.exit(1);
  }

  // Determine if using test or live key
  const isTestMode = secretKey.startsWith('sk_test_');
  const mode = isTestMode ? '🧪 TEST MODE' : '🔴 LIVE MODE';
  
  console.log(`\n${mode}`);
  console.log('🔗 Registering Yoco webhook...\n');

  // Get webhook URL - use deployed URL or ngrok for local testing
  const webhookUrl = process.env.WEBHOOK_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/webhooks/yoco` : null);

  if (!webhookUrl) {
    console.log('⚠️  WEBHOOK_URL not set. Please provide your webhook URL:\n');
    console.log('For production:');
    console.log('  WEBHOOK_URL=https://your-domain.com/api/webhooks/yoco\n');
    console.log('For local testing (with ngrok):');
    console.log('  1. Run: ngrok http 3000');
    console.log('  2. Use: WEBHOOK_URL=https://abc123.ngrok.io/api/webhooks/yoco\n');
    process.exit(1);
  }

  const webhookData = {
    name: isTestMode ? 'charna-webhook-test' : 'charna-webhook-production',
    url: webhookUrl
  };

  console.log('📍 Webhook URL:', webhookUrl);
  console.log('📝 Webhook Name:', webhookData.name);
  console.log('\nRegistering...\n');

  try {
    const response = await fetch('https://payments.yoco.com/api/webhooks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookData)
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('❌ Failed to register webhook');
      console.error('Status:', response.status);
      console.error('Response:', responseText);
      
      if (response.status === 401) {
        console.log('\n💡 Tip: Check your YOCO_SECRET_KEY is correct');
        console.log('   Get it from: Yoco App → Sales → Payment Gateway');
      }
      
      process.exit(1);
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = responseText;
    }

    console.log('✅ Webhook registered successfully!\n');
    console.log('📋 Webhook Details:');
    console.log(JSON.stringify(result, null, 2));
    console.log('\n🎉 Your webhook is now active!');
    console.log('\nWebhook will receive notifications for:');
    console.log('  - payment.succeeded');
    console.log('  - checkout.succeeded');
    console.log('  - payment.failed (if configured)');
    console.log('\n💡 Test it by making a payment on your site!');

  } catch (error) {
    console.error('❌ Error registering webhook:', error);
    process.exit(1);
  }
}

// List existing webhooks function
async function listWebhooks() {
  const secretKey = process.env.YOCO_SECRET_KEY;
  
  if (!secretKey) {
    console.error('❌ YOCO_SECRET_KEY not found');
    return;
  }

  console.log('\n📋 Fetching existing webhooks...\n');

  try {
    const response = await fetch('https://payments.yoco.com/api/webhooks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log('Could not fetch webhooks (might not be supported)');
      return;
    }

    const webhooks = await response.json();
    console.log('Existing webhooks:');
    console.log(JSON.stringify(webhooks, null, 2));

  } catch (error) {
    console.log('Could not list webhooks');
  }
}

// Check command line args
const args = process.argv.slice(2);

if (args.includes('--list')) {
  listWebhooks();
} else {
  registerWebhook();
}

