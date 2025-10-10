/**
 * Database Backup Script
 * 
 * Creates a JSON backup of all critical tables
 */

import { prisma } from '../lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

async function backup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups');
  
  // Create backups directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log('🔄 Starting database backup...');

  try {
    // Backup all tables
    const data = {
      timestamp,
      products: await prisma.product.findMany({
        include: {
          variants: true,
          categories: true,
          packageItems: true
        }
      }),
      categories: await prisma.category.findMany(),
      orders: await prisma.order.findMany(),
      contacts: await prisma.contact.findMany(),
      promoCodes: await prisma.promoCode.findMany(),
      promoCodeUsages: await prisma.promoCodeUsage.findMany(),
      users: await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
          // Don't backup passwords!
        }
      })
    };

    // Write backup file
    const filename = `backup-${timestamp}.json`;
    const filepath = path.join(backupDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    
    const stats = fs.statSync(filepath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('✅ Backup completed successfully!');
    console.log(`📁 File: ${filename}`);
    console.log(`📊 Size: ${fileSizeInMB} MB`);
    console.log(`📍 Location: ${filepath}`);
    console.log('');
    console.log('Backup contains:');
    console.log(`  - ${data.products.length} products`);
    console.log(`  - ${data.orders.length} orders`);
    console.log(`  - ${data.contacts.length} contacts`);
    console.log(`  - ${data.promoCodes.length} promo codes`);
    console.log(`  - ${data.users.length} users`);
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

backup();

