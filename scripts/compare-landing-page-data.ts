/**
 * Compare Landing Page Data between Production and Development
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

async function compareDatabases() {
  console.log('🔍 Comparing Landing Page Data...\n');

  // Read .env.local for dev DB URL
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

  // Load .env for production
  dotenv.config({ path: '.env' });
  const prodDbUrl = process.env.DATABASE_URL;

  if (!prodDbUrl) {
    console.error('❌ Could not find DATABASE_URL in .env');
    process.exit(1);
  }

  console.log(`📍 Production: ${prodDbUrl.substring(0, 60)}...`);
  console.log(`📍 Development: ${devDbUrl.substring(0, 60)}...\n`);

  // Connect to production (from .env)
  const prodPrisma = new PrismaClient({
    datasources: {
      db: {
        url: prodDbUrl
      }
    }
  });

  // Connect to development (from .env.local)
  const devPrisma = new PrismaClient({
    datasources: {
      db: {
        url: devDbUrl
      }
    }
  });

  try {
    // Fetch production data
    console.log('📦 Fetching Production data...');
    const prodSections = await prodPrisma.landingPageSection.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    // Fetch development data
    console.log('📦 Fetching Development data...\n');
    const devSections = await devPrisma.landingPageSection.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    console.log('📊 COMPARISON RESULTS\n');
    console.log('═'.repeat(80));

    // Compare sections
    console.log(`\n📋 Sections:`);
    console.log(`  Production: ${prodSections.length} sections`);
    console.log(`  Development: ${devSections.length} sections`);

    if (prodSections.length !== devSections.length) {
      console.log(`  ⚠️  MISMATCH: Different number of sections\n`);
    } else {
      console.log(`  ✅ Sections count matches\n`);
    }

    // Compare each section
    for (const prodSection of prodSections) {
      console.log(`\n${prodSection.name.toUpperCase()} SECTION`);
      console.log('─'.repeat(80));
      
      const devSection = devSections.find(s => s.name === prodSection.name);

      if (!devSection) {
        console.log(`  ❌ MISSING in Development`);
        continue;
      }

      // Compare section settings
      if (JSON.stringify(prodSection.settings) !== JSON.stringify(devSection.settings)) {
        console.log(`  ⚠️  Settings differ`);
        console.log(`     Prod: ${JSON.stringify(prodSection.settings)}`);
        console.log(`     Dev:  ${JSON.stringify(devSection.settings)}`);
      }

      // Compare images
      console.log(`  Images: Prod=${prodSection.images.length}, Dev=${devSection.images.length}`);
      
      if (prodSection.images.length !== devSection.images.length) {
        console.log(`  ⚠️  Different number of images`);
      }

      // Compare individual images
      const maxImages = Math.max(prodSection.images.length, devSection.images.length);
      for (let i = 0; i < maxImages; i++) {
        const prodImage = prodSection.images[i];
        const devImage = devSection.images[i];

        if (!prodImage) {
          console.log(`    [${i}] ❌ Missing in Production: ${devImage?.altText}`);
          continue;
        }

        if (!devImage) {
          console.log(`    [${i}] ❌ Missing in Development: ${prodImage.altText}`);
          continue;
        }

        // Check for differences
        const differences: string[] = [];
        
        if (prodImage.order !== devImage.order) {
          differences.push(`order: ${prodImage.order} vs ${devImage.order}`);
        }
        if (prodImage.imageUrl !== devImage.imageUrl) {
          differences.push(`imageUrl differs`);
        }
        if (prodImage.altText !== devImage.altText) {
          differences.push(`altText differs`);
        }
        if (prodImage.enabled !== devImage.enabled) {
          differences.push(`enabled: ${prodImage.enabled} vs ${devImage.enabled}`);
        }

        if (differences.length > 0) {
          console.log(`    [${i}] ⚠️  ${prodImage.altText.substring(0, 30)}...`);
          console.log(`        ${differences.join(', ')}`);
        }
      }

      // Check for missing in prod
      if (prodSection.images.length < devSection.images.length) {
        console.log(`  📝 Extra images in Development:`);
        devSection.images.slice(prodSection.images.length).forEach(img => {
          console.log(`    - ${img.altText}`);
        });
      }

      // Check for missing in dev
      if (devSection.images.length < prodSection.images.length) {
        console.log(`  📝 Missing images in Development:`);
        prodSection.images.slice(devSection.images.length).forEach(img => {
          console.log(`    - ${img.altText}`);
        });
      }

      if (prodSection.images.length === devSection.images.length && 
          prodSection.images.every((p, i) => p.order === devSection.images[i].order)) {
        console.log(`  ✅ Images match`);
      }
    }

    console.log('\n' + '═'.repeat(80));
    console.log('\n✅ Comparison complete\n');

    await prodPrisma.$disconnect();
    await devPrisma.$disconnect();

  } catch (error) {
    console.error('❌ Error comparing databases:', error);
    await prodPrisma.$disconnect();
    await devPrisma.$disconnect();
    process.exit(1);
  }
}

compareDatabases();
