/**
 * Delete Yoco Webhook
 * 
 * Usage: npx tsx scripts/delete-yoco-webhook.ts <webhook-id>
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

async function deleteWebhook() {
  const webhookId = process.argv[2];
  
  if (!webhookId) {
    console.error('❌ Please provide webhook ID');
    console.log('\nUsage: npx tsx scripts/delete-yoco-webhook.ts <webhook-id>');
    console.log('Example: npx tsx scripts/delete-yoco-webhook.ts sub_aEqGn69mGoOfdmNi8rzCp2xD');
    process.exit(1);
  }

  const secretKey = process.env.YOCO_SECRET_KEY;
  
  if (!secretKey) {
    console.error('❌ YOCO_SECRET_KEY not found');
    process.exit(1);
  }

  console.log(`🗑️  Deleting webhook: ${webhookId}\n`);

  try {
    const response = await fetch(`https://payments.yoco.com/api/webhooks/${webhookId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('❌ Failed to delete webhook');
      console.error('Status:', response.status);
      const text = await response.text();
      console.error('Response:', text);
      process.exit(1);
    }

    console.log('✅ Webhook deleted successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

deleteWebhook();

