import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function removeUniqueConstraint() {
  console.log('🔧 Removing unique constraint from categories.name...\n');

  // Production database
  const prodDbUrl = process.env.DATABASE_URL;
  if (!prodDbUrl) {
    console.error('❌ DATABASE_URL not found in .env');
    process.exit(1);
  }

  // Development database
  const devDbUrl = process.env.DATABASE_URL || 
    (process.env.DATABASE_URL?.includes('ep-rapid-pond') 
      ? process.env.DATABASE_URL 
      : undefined);

  // Get dev URL from .env.local if needed
  const devEnvPath = path.join(process.cwd(), '.env.local');
  let devDbUrlFromLocal: string | undefined;
  try {
    const fs = require('fs');
    const devEnvContent = fs.readFileSync(devEnvPath, 'utf-8');
    const devDbMatch = devEnvContent.match(/DATABASE_URL="([^"]+)"/);
    if (devDbMatch) {
      devDbUrlFromLocal = devDbMatch[1];
    }
  } catch (e) {
    console.warn('⚠️  Could not read .env.local');
  }

  const databases = [
    { name: 'Production', url: prodDbUrl },
    { name: 'Development', url: devDbUrlFromLocal || prodDbUrl }
  ].filter(db => db.url);

  for (const db of databases) {
    console.log(`\n📦 Processing ${db.name} database...`);
    
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: db.url
        }
      }
    });

    try {
      // First, find the constraint name
      const result = await prisma.$queryRaw<Array<{ indexname: string }>>`
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'categories' 
        AND indexdef LIKE '%UNIQUE%'
        AND indexdef LIKE '%name%'
      `;

      if (result.length === 0) {
        console.log(`✅ No unique constraint on name found in ${db.name} (may already be removed)`);
        continue;
      }

      const constraintName = result[0].indexname;
      console.log(`   Found constraint: ${constraintName}`);

      // Drop the constraint
      await prisma.$executeRawUnsafe(`DROP INDEX IF EXISTS "${constraintName}"`);
      console.log(`✅ Removed unique constraint from ${db.name} database`);

    } catch (error: any) {
      console.error(`❌ Error processing ${db.name}:`, error.message);
    } finally {
      await prisma.$disconnect();
    }
  }

  console.log('\n🎉 Done! Regenerating Prisma client...');
}

removeUniqueConstraint()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
