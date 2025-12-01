/**
 * Load Production Data into Development
 * 
 * This script loads the production backup into the development database
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Read .env.local directly to get dev database URL
const envLocalPath = path.join(process.cwd(), '.env.local');
let devDbUrl = '';

if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');
  const match = envContent.match(/DATABASE_URL="([^"]+)"/);
  if (match) {
    devDbUrl = match[1];
  }
}

if (!devDbUrl) {
  console.error('❌ Could not find DATABASE_URL in .env.local');
  process.exit(1);
}

console.log('📍 Using DATABASE_URL (dev):', devDbUrl.substring(0, 60) + '...\n');

// Force Prisma to use the dev database URL we extracted from .env.local
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: devDbUrl
    }
  }
});

async function loadProductionToDev() {
  console.log('🔄 Loading production data into development...\n');

  try {
    // Find the latest production backup
    const backupDir = path.join(process.cwd(), 'backups');
    const files = fs.readdirSync(backupDir)
      .filter(f => (f.startsWith('backup-') || f.startsWith('production-backup-')) && f.endsWith('.json'))
      .sort()
      .reverse();
    
    if (files.length === 0) {
      console.error('❌ No backup files found in backups/ directory');
      process.exit(1);
    }

    // Prefer production backups over regular backups
    const productionBackups = files.filter(f => f.startsWith('production-backup-'));
    const latestBackup = productionBackups.length > 0 ? productionBackups[0] : files[0];
    console.log(`📂 Using backup: ${latestBackup}\n`);
    
    const backupPath = path.join(backupDir, latestBackup);
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

    console.log('⚠️  WARNING: This will DELETE all existing data in development database!');
    console.log('   Make sure you have a backup before proceeding.\n');

    // Delete existing data
    console.log('🗑️  Cleaning development database...');
    await prisma.promoCodeUsage.deleteMany();
    await prisma.promoCode.deleteMany();
    await prisma.order.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.variantAttribute.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.packageItem.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.landingPageImage.deleteMany();
    await prisma.landingPageSection.deleteMany();
    
    console.log('✅ Cleaned existing data\n');

    // Restore data
    console.log('📦 Restoring data from production backup...');

    // Restore categories
    if (backupData.categories && backupData.categories.length > 0) {
      await prisma.category.createMany({
        data: backupData.categories.map((cat: any) => ({
          ...cat,
          updatedAt: new Date(),
          createdAt: new Date(cat.createdAt)
        }))
      });
      console.log(`  ✅ Restored ${backupData.categories.length} categories`);
    }

    // Restore products
    if (backupData.products && backupData.products.length > 0) {
      // Map old variant IDs to new variant IDs
      const variantIdMap = new Map<number, number>();
      
      for (const product of backupData.products) {
        const { variants, categories, packageItems, ...productData } = product;
        
        // Create product
        const createdProduct = await prisma.product.create({
          data: {
            ...productData,
            createdAt: new Date(productData.createdAt),
            updatedAt: new Date(productData.updatedAt)
          }
        });

        // Create variants and map old IDs to new IDs
        if (variants && variants.length > 0) {
          for (const variant of variants) {
            const { attributes, ...variantData } = variant;
            const oldVariantId = variant.id;
            
            const newVariant = await prisma.productVariant.create({
              data: {
                ...variantData,
                productId: createdProduct.id,
                createdAt: new Date(variant.createdAt),
                updatedAt: new Date(variant.updatedAt)
              }
            });
            
            // Map old ID to new ID
            variantIdMap.set(oldVariantId, newVariant.id);
          }
        }

        // Create category relationships
        if (categories && categories.length > 0) {
          for (const cat of categories) {
            await prisma.productCategory.create({
              data: {
                productId: createdProduct.id,
                categoryId: cat.categoryId,
                isPrimary: cat.isPrimary,
                displayOrder: cat.displayOrder
              }
            });
          }
        }

        // Create package items with mapped variant IDs
        if (packageItems && packageItems.length > 0) {
          for (const item of packageItems) {
            const newVariantId = variantIdMap.get(item.variantId);
            if (newVariantId) {
              await prisma.packageItem.create({
                data: {
                  packageProductId: createdProduct.id,
                  variantId: newVariantId,
                  quantity: item.quantity
                }
              });
            }
          }
        }
      }
      console.log(`  ✅ Restored ${backupData.products.length} products`);
    }

    // Restore landing page sections
    if (backupData.landingPageSections && backupData.landingPageSections.length > 0) {
      let totalImages = 0;
      for (const section of backupData.landingPageSections) {
        const { images, id, ...sectionData } = section; // Exclude id from backup
        
        const createdSection = await prisma.landingPageSection.create({
          data: {
            ...sectionData,
            createdAt: new Date(sectionData.createdAt),
            updatedAt: new Date(sectionData.updatedAt)
          }
        });

        // Create images for this section
        if (images && images.length > 0) {
          try {
            const imageData = images.map((image: any) => ({
              imageUrl: image.imageUrl,
              altText: image.altText,
              caption: image.caption,
              linkUrl: image.linkUrl,
              order: image.order,
              enabled: image.enabled,
              metadata: image.metadata,
              sectionId: createdSection.id,
              createdAt: new Date(image.createdAt),
              updatedAt: new Date(image.updatedAt)
            }));
            
            console.log(`    → Section "${section.name}": attempting to create ${images.length} images for sectionId ${createdSection.id}`);
            
            const result = await prisma.landingPageImage.createMany({
              data: imageData,
              skipDuplicates: false
            });
            
            // Verify by reading back
            const verifyCount = await prisma.landingPageImage.count({
              where: { sectionId: createdSection.id }
            });
            
            console.log(`    → Section "${section.name}": createMany reports ${result.count}, actually has ${verifyCount} images`);
            
            if (result.count !== images.length || verifyCount !== images.length) {
              console.log(`    ⚠️  WARNING: Mismatch! Attempted ${images.length}, createMany says ${result.count}, count query says ${verifyCount}`);
            }
            totalImages += result.count;
          } catch (error: any) {
            console.error(`    ❌ Error creating images for "${section.name}":`, error.message);
            // Try creating images one by one to see which one fails
            for (const image of images) {
              try {
                await prisma.landingPageImage.create({
                  data: {
                    imageUrl: image.imageUrl,
                    altText: image.altText,
                    caption: image.caption,
                    linkUrl: image.linkUrl,
                    order: image.order,
                    enabled: image.enabled,
                    metadata: image.metadata,
                    sectionId: createdSection.id,
                    createdAt: new Date(image.createdAt),
                    updatedAt: new Date(image.updatedAt)
                  }
                });
                totalImages++;
              } catch (imgError: any) {
                console.error(`      ❌ Failed to create image "${image.altText}":`, imgError.message);
              }
            }
          }
        }
      }
      console.log(`  ✅ Restored ${backupData.landingPageSections.length} landing page sections (${totalImages} total images)`);
    }

    // Restore contacts (no dependencies)
    if (backupData.contacts && backupData.contacts.length > 0) {
      await prisma.contact.createMany({
        data: backupData.contacts.map((contact: any) => ({
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          subject: contact.subject,
          message: contact.message,
          createdAt: new Date(contact.createdAt)
        }))
      });
      console.log(`  ✅ Restored ${backupData.contacts.length} contacts`);
    }

    // Restore promo codes (must be before orders)
    if (backupData.promoCodes && backupData.promoCodes.length > 0) {
      await prisma.promoCode.createMany({
        data: backupData.promoCodes.map((code: any) => ({
          ...code,
          createdAt: new Date(code.createdAt),
          updatedAt: new Date(code.updatedAt)
        }))
      });
      console.log(`  ✅ Restored ${backupData.promoCodes.length} promo codes`);
    }

    // Restore orders (depends on promo codes)
    if (backupData.orders && backupData.orders.length > 0) {
      await prisma.order.createMany({
        data: backupData.orders.map((order: any) => ({
          ...order,
          // Handle new fields that may not exist in old backups
          shippingCost: order.shippingCost ?? order.shipping_cost ?? 0,
          vatAmount: order.vatAmount ?? order.vat_amount ?? 0,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt)
        }))
      });
      console.log(`  ✅ Restored ${backupData.orders.length} orders`);
    }

    // Restore promo code usages (depends on promo codes)
    if (backupData.promoCodeUsages && backupData.promoCodeUsages.length > 0) {
      await prisma.promoCodeUsage.createMany({
        data: backupData.promoCodeUsages.map((usage: any) => ({
          id: usage.id,
          promoCodeId: usage.promoCodeId,
          orderId: usage.orderId,
          customerEmail: usage.customerEmail,
          discountApplied: usage.discountApplied,
          createdAt: new Date(usage.createdAt)
        }))
      });
      console.log(`  ✅ Restored ${backupData.promoCodeUsages.length} promo code usages`);
    }

    // Note: Users are NOT restored for security reasons

    console.log('\n✅ Successfully loaded production data into development!');
    console.log('\n📊 Summary:');
    console.log(`  - ${backupData.products?.length || 0} products`);
    console.log(`  - ${backupData.orders?.length || 0} orders`);
    console.log(`  - ${backupData.contacts?.length || 0} contacts`);
    console.log(`  - ${backupData.promoCodes?.length || 0} promo codes`);
    console.log(`  - ${backupData.users?.length || 0} users (not restored)`);
    console.log(`  - ${backupData.landingPageSections?.length || 0} landing page sections`);

    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Failed to load production data:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

loadProductionToDev();
