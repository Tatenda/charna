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

const contactPageData = {
  pageName: 'contact',
  title: 'Contact Us',
  metaTitle: 'Contact Us | Charna Leather Bags - Get in Touch',
  metaDescription: 'Contact Charna\'s team in Johannesburg for questions about our handcrafted leather bags. Visit our workshop, call us, or send a message. We\'re here to help with product inquiries and custom orders.',
  enabled: true,
  content: {
    hero: {
      title: 'Contact Us',
      description: 'We\'d love to hear from you. Get in touch with our team for any questions or inquiries.'
    },
    location: {
      title: 'Visit Our Workshop',
      city: 'Johannesburg',
      country: 'South Africa'
    },
    email: {
      title: 'Email Us',
      generalEmail: 'info@charna.co.za',
      wholesaleEmail: 'info@charna.co.za'
    },
    phone: {
      title: 'Call or Chat',
      cell: '072 356 0321',
      whatsapp: '27723560321'
    },
    formHeading: 'Send Us a Message',
    workshopHours: [
      { day: 'Monday - Friday', hours: '9:00 AM - 5:00 PM' },
      { day: 'Saturday', hours: '10:00 AM - 3:00 PM' },
      { day: 'Sunday', hours: 'Closed' }
    ],
    workshopDescription: 'We welcome visitors to our workshop in Johannesburg. See our craftspeople at work and experience our products firsthand.',
    workshopNote: 'Workshop visits are by appointment only. Contact us to schedule your visit.',
    faq: [
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to select international destinations. Please contact us for shipping rates and estimated delivery times.'
      },
      {
        question: 'What is your return policy?',
        answer: 'We accept returns within 14 days of delivery for items in their original condition. Custom orders are non-returnable.'
      },
      {
        question: 'How do I care for my leather bag?',
        answer: 'We recommend regular cleaning with a soft cloth and occasional conditioning with leather cream. Keep away from direct sunlight and moisture.'
      },
      {
        question: 'Do you offer wholesale options?',
        answer: 'Yes, we offer wholesale partnerships with select retailers. Please contact our wholesale department for more information.'
      }
    ],
    socialCTA: {
      heading: 'Connect With Us on Social Media',
      description: 'Follow our journey, see behind-the-scenes content, and be the first to know about new products and promotions.',
      socialLinks: [
        {
          platform: 'instagram',
          url: 'https://www.instagram.com/charna.co?igsh=MXBscWkyNjQybWI2Mw%3D%3D&utm_source=qr',
          label: 'Instagram'
        },
        {
          platform: 'facebook',
          url: 'https://facebook.com/livinggreenmovement',
          label: 'Facebook'
        },
        {
          platform: 'pinterest',
          url: 'https://pinterest.com/livinggreenmovement',
          label: 'Pinterest'
        }
      ]
    }
  }
};

async function seed() {
  try {
    console.log('🌱 Seeding contact page content...');

    // Check if contact page already exists
    const existing = await prisma.pageContent.findUnique({
      where: { pageName: 'contact' }
    });

    if (existing) {
      console.log('⚠️  Contact page already exists. Updating...');
      await prisma.pageContent.update({
        where: { pageName: 'contact' },
        data: contactPageData
      });
      console.log('✅ Contact page updated successfully');
    } else {
      console.log('📝 Creating contact page...');
      await prisma.pageContent.create({
        data: contactPageData
      });
      console.log('✅ Contact page created successfully');
    }

    console.log('✨ Seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding contact page:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
