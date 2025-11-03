/**
 * Update Admin Password in Database
 * 
 * This script updates the admin user's password in both dev and production databases
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

async function updateAdminPassword() {
  console.log('🔐 Updating Admin Password...\n');

  // Get new password from environment or prompt
  const newPassword = process.env.ADMIN_PASSWORD;
  
  if (!newPassword) {
    console.error('❌ Error: ADMIN_PASSWORD environment variable is required');
    console.error('\nUsage:');
    console.error('  ADMIN_PASSWORD=your-secure-password npx tsx scripts/update-admin-password.ts');
    console.error('\nOr set it in your .env file:');
    console.error('  ADMIN_PASSWORD=your-secure-password');
    process.exit(1);
  }

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

  console.log(`📍 Production DB: ${prodDbUrl.substring(0, 50)}...`);
  console.log(`📍 Development DB: ${devDbUrl.substring(0, 50)}...\n`);

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  console.log('✅ Password hashed\n');

  // Connect to production
  const prodPrisma = new PrismaClient({
    datasources: {
      db: {
        url: prodDbUrl
      }
    }
  });

  // Connect to development
  const devPrisma = new PrismaClient({
    datasources: {
      db: {
        url: devDbUrl
      }
    }
  });

  try {
    // Update production
    console.log('🔄 Updating production database...');
    const prodAdmin = await prodPrisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (prodAdmin) {
      await prodPrisma.user.update({
        where: { id: prodAdmin.id },
        data: { password: hashedPassword }
      });
      console.log(`✅ Production: Admin password updated (${prodAdmin.email})`);
    } else {
      console.log('⚠️  Production: No admin user found');
    }

    // Update development
    console.log('\n🔄 Updating development database...');
    const devAdmin = await devPrisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (devAdmin) {
      await devPrisma.user.update({
        where: { id: devAdmin.id },
        data: { password: hashedPassword }
      });
      console.log(`✅ Development: Admin password updated (${devAdmin.email})`);
    } else {
      console.log('⚠️  Development: No admin user found');
    }

    console.log('\n🎉 Admin password update complete!');
    console.log('\nNew login credentials:');
    console.log(`Email: ${prodAdmin?.email || devAdmin?.email}`);
    console.log('Password: [the password you set]');
    console.log('\n⚠️  Please keep this password secure!');

  } catch (error) {
    console.error('❌ Error updating admin password:', error);
    process.exit(1);
  } finally {
    await prodPrisma.$disconnect();
    await devPrisma.$disconnect();
  }
}

updateAdminPassword()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

