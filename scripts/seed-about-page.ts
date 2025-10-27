import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

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

// Force Prisma to use the dev database URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: devDbUrl
    }
  }
});

const aboutPageData = {
  pageName: 'about-us',
  title: 'Our Story',
  metaTitle: 'Our Story | Charna. - Made in Johannesburg with Purpose',
  metaDescription: 'Discover the story behind Charna.\'s handcrafted leather bags. Learn about our skilled South African artisans in Johannesburg who create premium leather goods with traditional craftsmanship and sustainable practices.',
  enabled: true,
  content: {
    hero: {
      title: 'Our Story',
      description: 'Crafted with pride in Johannesburg. Discover the passion and skill behind our handmade leather goods.'
    },
    originStory: {
      heading: 'Crafted with Pride in Johannesburg',
      paragraphs: [
        'Charna. was founded with a simple vision: to create exceptional leather goods that showcase the incredible skill and artistry of South African craftspeople. Our workshop in Johannesburg is where passion meets precision.',
        'Every Charna. piece is handcrafted by skilled local artisans who bring years of experience and deep pride in their work. We believe in the power of traditional craftsmanship combined with contemporary design sensibilities.',
        'Our leather goods represent the best of South African manufacturing – where attention to detail, quality materials, and expert craftsmanship come together to create timeless pieces built to last.'
      ],
      imageUrl: 'Navy Tennis bag_1758386586336.png',
      imageAlt: 'Charna. tennis bag with Johannesburg skyline'
    },
    values: {
      heading: 'Our Values',
      items: [
        {
          icon: 'hands',
          title: 'Artisan Craftsmanship',
          description: 'We honor traditional techniques passed down through generations, ensuring each piece is crafted with precision and care.'
        },
        {
          icon: 'leaf',
          title: 'Environmental Responsibility',
          description: 'We prioritize sustainable practices, minimize waste, and source materials ethically to reduce our environmental impact.'
        },
        {
          icon: 'users',
          title: 'Community Empowerment',
          description: 'We create fair employment opportunities and invest in skills development to support the livelihoods of local communities.'
        }
      ]
    },
    quote: {
      text: 'Every Charna. piece represents the incredible skill and dedication of our South African artisans — we\'re proud to showcase the exceptional craftsmanship that our country has to offer.',
      author: '— Founder, Charna.'
    },
    cta: {
      heading: 'Experience the Charna. Difference',
      description: 'When you purchase a Charna. bag, you\'re not just buying a product – you\'re supporting a movement of sustainable, ethical craftsmanship and becoming part of our story.',
      buttons: [
        {
          text: 'Shop Our Collection',
          url: '/browse',
          variant: 'primary'
        },
        {
          text: 'Contact Us',
          url: '/contact',
          variant: 'secondary'
        }
      ]
    }
  }
};

async function seed() {
  try {
    console.log('🌱 Seeding about-us page content...');

    // Check if about-us page already exists
    const existing = await prisma.pageContent.findUnique({
      where: { pageName: 'about-us' }
    });

    if (existing) {
      console.log('⚠️  About Us page already exists. Updating...');
      await prisma.pageContent.update({
        where: { pageName: 'about-us' },
        data: aboutPageData
      });
      console.log('✅ About Us page updated successfully');
    } else {
      console.log('📝 Creating About Us page...');
      await prisma.pageContent.create({
        data: aboutPageData
      });
      console.log('✅ About Us page created successfully');
    }

    console.log('✨ Seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding About Us page:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
