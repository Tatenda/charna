import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function checkConstraints() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }

  const prisma = new PrismaClient({
    datasources: {
      db: { url: dbUrl },
    },
  });

  try {
    // Check all indexes on categories table
    const indexes = await prisma.$queryRaw<Array<{indexname: string, indexdef: string}>>`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'categories'
      ORDER BY indexname
    `;

    console.log('\n📋 All indexes on categories table:');
    indexes.forEach(idx => {
      console.log(`   ${idx.indexname}`);
      console.log(`   ${idx.indexdef}\n`);
    });

    // Check constraints
    const constraints = await prisma.$queryRaw<Array<{constraint_name: string, constraint_type: string}>>`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'categories'
      ORDER BY constraint_name
    `;

    console.log('\n🔒 All constraints on categories table:');
    constraints.forEach(cons => {
      console.log(`   ${cons.constraint_name} (${cons.constraint_type})`);
    });

    // Check for unique constraints specifically on name column
    const uniqueOnName = await prisma.$queryRaw<Array<{constraint_name: string}>>`
      SELECT tc.constraint_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu 
        ON tc.constraint_name = ccu.constraint_name
      WHERE tc.table_name = 'categories'
        AND tc.constraint_type = 'UNIQUE'
        AND ccu.column_name = 'name'
    `;

    if (uniqueOnName.length > 0) {
      console.log('\n⚠️  Found unique constraints on name column:');
      uniqueOnName.forEach(cons => {
        console.log(`   ${cons.constraint_name}`);
      });
    } else {
      console.log('\n✅ No unique constraints found on name column');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkConstraints();
