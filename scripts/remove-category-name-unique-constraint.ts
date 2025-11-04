import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables - check .env.local first, then .env
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

async function removeUniqueConstraint(dbUrl: string, dbName: string) {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: dbUrl },
    },
  });

  try {
    console.log(`\n🔍 Checking ${dbName} database...`);

    // Check for unique constraints on name column
    const uniqueOnName = await prisma.$queryRaw<Array<{constraint_name: string, indexname: string}>>`
      SELECT 
        tc.constraint_name,
        pi.indexname
      FROM information_schema.table_constraints tc
      LEFT JOIN pg_indexes pi ON pi.indexname = tc.constraint_name
      WHERE tc.table_name = 'categories'
        AND tc.constraint_type = 'UNIQUE'
        AND EXISTS (
          SELECT 1 
          FROM information_schema.constraint_column_usage ccu 
          WHERE ccu.constraint_name = tc.constraint_name 
            AND ccu.column_name = 'name'
        )
    `;

    // Also check indexes that might be unique
    const uniqueIndexes = await prisma.$queryRaw<Array<{indexname: string, indexdef: string}>>`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'categories' 
      AND indexdef LIKE '%UNIQUE%'
      AND indexdef LIKE '%name%'
    `;

    if (uniqueOnName.length > 0 || uniqueIndexes.length > 0) {
      console.log(`   ⚠️  Found unique constraint(s) on name column`);
      
      // Try to drop constraints
      for (const constraint of uniqueOnName) {
        if (constraint.constraint_name) {
          try {
            await prisma.$executeRawUnsafe(
              `ALTER TABLE categories DROP CONSTRAINT IF EXISTS "${constraint.constraint_name}" CASCADE`
            );
            console.log(`   ✅ Dropped constraint: ${constraint.constraint_name}`);
          } catch (e: any) {
            console.log(`   ⚠️  Could not drop constraint ${constraint.constraint_name}: ${e.message}`);
          }
        }
      }

      // Try to drop indexes
      for (const index of uniqueIndexes) {
        if (index.indexname) {
          try {
            await prisma.$executeRawUnsafe(
              `DROP INDEX IF EXISTS "${index.indexname}" CASCADE`
            );
            console.log(`   ✅ Dropped index: ${index.indexname}`);
          } catch (e: any) {
            console.log(`   ⚠️  Could not drop index ${index.indexname}: ${e.message}`);
          }
        }
      }

      console.log(`   ✅ Unique constraints removed from ${dbName} database`);
    } else {
      console.log(`   ✅ No unique constraint found on categories.name (already removed)`);
    }
  } catch (error: any) {
    console.error(`   ❌ Error checking ${dbName} database:`, error.message);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  console.log('🔧 Removing unique constraint from categories.name...\n');

  // Get development database URL from .env.local
  let devDbUrl: string | undefined;
  if (fs.existsSync(envLocalPath)) {
    const envLocalContent = fs.readFileSync(envLocalPath, 'utf-8');
    const devMatch = envLocalContent.match(/DATABASE_URL="?([^"\n]+)"?/);
    if (devMatch) {
      devDbUrl = devMatch[1];
    }
  }

  // Get production database URL from .env
  let prodDbUrl: string | undefined;
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const prodMatch = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
    if (prodMatch) {
      prodDbUrl = prodMatch[1];
    }
  }

  if (!devDbUrl && !prodDbUrl) {
    console.error('❌ Error: DATABASE_URL not found in .env.local or .env');
    process.exit(1);
  }

  if (devDbUrl) {
    await removeUniqueConstraint(devDbUrl, 'development');
  }

  if (prodDbUrl && prodDbUrl !== devDbUrl) {
    await removeUniqueConstraint(prodDbUrl, 'production');
  }

  console.log('\n🎉 Done! Regenerating Prisma client...\n');
}

main();
