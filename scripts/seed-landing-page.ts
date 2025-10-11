import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedLandingPage() {
  console.log('🌱 Seeding landing page data...');

  // 1. Hero Section
  const heroSection = await prisma.landingPageSection.upsert({
    where: { name: 'hero' },
    update: {},
    create: {
      name: 'hero',
      title: 'Handcrafted, beautiful and affordable bags',
      subtitle: null,
      enabled: true,
      order: 1,
      settings: {
        ctaText: 'Shop Bags',
        ctaLink: '/browse?category=work',
        backgroundColor: '#000000',
        overlay: 'dark'
      },
      images: {
        create: [
          {
            imageUrl: '/image_1757230274214.png',
            altText: 'Premium leather backpack collection hero image',
            order: 0,
            enabled: true,
            metadata: {
              position: 'center',
              overlay: 'dark'
            }
          }
        ]
      }
    }
  });
  console.log('✅ Hero section created');

  // 2. Our Ranges Section
  const rangesSection = await prisma.landingPageSection.upsert({
    where: { name: 'ranges' },
    update: {},
    create: {
      name: 'ranges',
      title: 'Our Ranges',
      subtitle: null,
      enabled: true,
      order: 2,
      settings: {
        ctaText: 'Shop All',
        ctaLink: '/browse?category=work',
        backgroundColor: '#F5F1E8'
      },
      images: {
        create: [
          {
            imageUrl: '/Retro Range - Navy Blue_1758225069385.png',
            altText: 'Retro Range - Navy Backpack',
            linkUrl: '/browse?category=work',
            order: 0,
            enabled: true,
            metadata: {
              rangeName: 'Retro Range',
              price: 2399,
              description: 'Bring the retro style to your laptop bag',
              hoverImage: '/Retro Range - Olive_1758362124136.png',
              category: 'work'
            }
          },
          {
            imageUrl: '/LGM_hip_1757356807770.png',
            altText: 'Leisure Range - White Hip Bag',
            linkUrl: '/browse?category=leisure',
            order: 1,
            enabled: true,
            metadata: {
              rangeName: 'Leisure Range',
              price: 1100,
              description: 'Elegant everyday bag',
              hoverImage: '/913E8FCD-4943-44D3-A3EF-645778762B43_1758357180594.png',
              category: 'leisure'
            }
          },
          {
            imageUrl: '/Navy sports back - neutral background_1758112268197.png',
            altText: 'Tennis Sports Bag - Navy',
            linkUrl: '/browse?category=sport',
            order: 2,
            enabled: true,
            metadata: {
              rangeName: 'Sports Range',
              price: 3299,
              description: 'Athletic gear carrier',
              hoverImage: '/Tennis bag - White - neutral background_1758110253206.png',
              category: 'sport'
            }
          },
          {
            imageUrl: '/Copy of Classic range - Rose Gold_1758112410766.png',
            altText: 'Classic Backpack - Navy',
            linkUrl: '/browse?category=travel',
            order: 3,
            enabled: true,
            metadata: {
              rangeName: 'Classic Range',
              price: 2499,
              description: 'Adventure companion',
              hoverImage: '/LGM_Classic_me (1)_1758112410768.png',
              category: 'travel'
            }
          },
          {
            imageUrl: '/LGM_Grounded (1)_1757318142201.png',
            altText: 'Grounded Backpack - Original',
            linkUrl: '/browse?category=work',
            order: 4,
            enabled: true,
            metadata: {
              rangeName: 'Grounded Range',
              price: 1999,
              description: 'Practical everyday essentials',
              hoverImage: '/ChatGPT Image Sep 17, 2025, 03_24_36 PM_1758115521218.png',
              category: 'work'
            }
          },
          {
            imageUrl: '/LGM_Styled_1757318531199.png',
            altText: 'Timeless Backpack - Original',
            linkUrl: '/browse?category=work',
            order: 5,
            enabled: true,
            metadata: {
              rangeName: 'Timeless Range',
              price: 1899,
              description: 'Timeless style meets smart organisation',
              hoverImage: '/Timeless Range - Rose Gold zip_1758117345340.png',
              category: 'work'
            }
          },
          {
            imageUrl: '/DF6D3DFE-6CBA-45BD-8742-1ABE450C1F7E_1758358612678.png',
            altText: 'Laptop Sleeve - Tan',
            linkUrl: '/browse?category=accessories',
            order: 6,
            enabled: true,
            metadata: {
              rangeName: 'Sleeved Range',
              price: 1100,
              description: 'Switch up your laptop sleeves',
              hoverImages: [
                '/DF6D3DFE-6CBA-45BD-8742-1ABE450C1F7E_1758358612678.png',
                '/1FCA156B-07B9-4EB4-B6CB-90243D3F1240_1758358612678.png',
                '/855ABA3F-D6BD-42E0-BBA5-488FEFF9EE7E_1758358612678.png',
                '/73877EA7-4681-4580-9B27-19C20A7D3A10_1758358612678.png'
              ],
              category: 'accessories'
            }
          }
        ]
      }
    }
  });
  console.log('✅ Ranges section created');

  // 3. Categories Section
  const categoriesSection = await prisma.landingPageSection.upsert({
    where: { name: 'categories' },
    update: {},
    create: {
      name: 'categories',
      title: 'Discover',
      subtitle: 'Shop by Category',
      enabled: true,
      order: 3,
      settings: {
        backgroundColor: '#7A8471',
        layout: 'collage'
      },
      images: {
        create: [
          {
            imageUrl: '/ChatGPT Image Sep 17, 2025, 04_11_01 PM_1758118389040.png',
            altText: 'Business Collection',
            linkUrl: '/browse?category=work',
            order: 0,
            enabled: true,
            metadata: {
              categoryName: 'Business',
              description: 'Professional Excellence',
              gridSpan: 'col-span-2 row-span-2',
              hoverImages: [
                '/ChatGPT Image Sep 17, 2025, 04_11_01 PM_1758118389040.png',
                '/Retro Range - Olive_1758362124136.png',
                '/LGM_Grounded (1) (1)_1757354457354.png',
                '/ChatGPT Image Sep 17, 2025, 01_42_26 PM_1758118389041.png',
                '/ChatGPT Image Jul 25, 2025, 05_27_55 PM_1757354752545.png'
              ]
            }
          },
          {
            imageUrl: '/Gent wih tennis bag - navy _1758386562325.png',
            altText: 'Sports Collection',
            linkUrl: '/browse?category=sport',
            order: 1,
            enabled: true,
            metadata: {
              categoryName: 'Sports',
              description: 'Athletic Performance',
              gridSpan: 'col-span-2 row-span-1',
              hoverImages: [
                '/Gent wih tennis bag - navy _1758386562325.png',
                '/Tennis bag - White - neutral background_1758386577764.png',
                '/Navy Tennis bag_1758386586336.png'
              ]
            }
          },
          {
            imageUrl: '/Lady with side bag - navy_1758383464073.png',
            altText: 'Leisure Collection',
            linkUrl: '/browse?category=leisure',
            order: 2,
            enabled: true,
            metadata: {
              categoryName: 'Leisure',
              description: 'Elegant Comfort',
              gridSpan: 'col-span-1 row-span-1',
              hoverImages: [
                '/Lady with side bag - navy_1758383464073.png',
                '/LGM_hip_1757356807770.png',
                '/913E8FCD-4943-44D3-A3EF-645778762B43_1758357180594.png'
              ]
            }
          },
          {
            imageUrl: '/ChatGPT Image Jul 25, 2025, 05_56_03 PM_1758206025280.png',
            altText: 'Travel Collection',
            linkUrl: '/browse?category=travel',
            order: 3,
            enabled: true,
            metadata: {
              categoryName: 'Travel',
              description: 'Adventure Awaits',
              gridSpan: 'col-span-1 row-span-1',
              hoverImages: [
                '/ChatGPT Image Jul 25, 2025, 05_56_03 PM_1758206025280.png',
                '/LGM_Classic_me_1757356445165.png',
                '/Classic range - Rose Gold_1757356095029.png'
              ]
            }
          },
          {
            imageUrl: '/DF6D3DFE-6CBA-45BD-8742-1ABE450C1F7E_1758358612678.png',
            altText: 'Accessories Collection',
            linkUrl: '/browse?category=accessories',
            order: 4,
            enabled: true,
            metadata: {
              categoryName: 'Accessories',
              description: 'Complete Your Look',
              gridSpan: 'col-span-1 row-span-1',
              hoverImages: [
                '/DF6D3DFE-6CBA-45BD-8742-1ABE450C1F7E_1758358612678.png',
                '/1FCA156B-07B9-4EB4-B6CB-90243D3F1240_1758358612678.png',
                '/855ABA3F-D6BD-42E0-BBA5-488FEFF9EE7E_1758358612678.png',
                '/73877EA7-4681-4580-9B27-19C20A7D3A10_1758358612678.png',
                '/Welcome message - Christopher_1758224465167.png',
                '/Embossing example_1758224006405.png'
              ]
            }
          },
          {
            imageUrl: '/Wine bag - wine bottles_1758387116266.png',
            altText: 'Gifts Collection',
            linkUrl: '/browse?category=gifting',
            order: 5,
            enabled: true,
            metadata: {
              categoryName: 'Gifts',
              description: 'Perfect for Every Occasion',
              gridSpan: 'col-span-1 row-span-1',
              hoverImages: [
                '/Wine bag - wine bottles_1758387116266.png',
                '/Wine bag_1758387116268.png'
              ]
            }
          },
          {
            imageUrl: '/Retro Range - Navy Blue_1758225069385.png',
            altText: 'Onboarding Collection',
            linkUrl: '/browse?category=onboarding',
            order: 6,
            enabled: true,
            metadata: {
              categoryName: 'Onboarding',
              description: 'Unforgettable employee experiences',
              gridSpan: 'col-span-2 row-span-1',
              hoverImages: [
                '/Retro Range - Navy Blue_1758225069385.png',
                '/LGM_Grounded (1)_1758225069383.png',
                '/Retro Range - Olive_1758362124136.png'
              ],
              subTiles: [
                {
                  image: '/DF6D3DFE-6CBA-45BD-8742-1ABE450C1F7E_1758358612678.png',
                  title: 'Laptop Sleeves'
                },
                {
                  image: '/Embossing example_1758224006405.png',
                  title: 'Named'
                },
                {
                  title: 'Desk Mat'
                },
                {
                  image: '/Welcome message - Christopher_1758224465167.png',
                  title: 'Welcome Tag'
                }
              ]
            }
          }
        ]
      }
    }
  });
  console.log('✅ Categories section created');

  // 4. Capsule Section
  const capsuleSection = await prisma.landingPageSection.upsert({
    where: { name: 'capsule' },
    update: {},
    create: {
      name: 'capsule',
      title: 'Bag Capsule',
      subtitle: null,
      enabled: true,
      order: 4,
      settings: {
        backgroundColor: '#f5f5f5',
        fullscreen: true
      },
      images: {
        create: [
          {
            imageUrl: '/images/navy-backpack-capsule.png',
            altText: 'Premium Navy Leather Backpack',
            order: 0,
            enabled: true,
            metadata: {
              fullscreen: true
            }
          }
        ]
      }
    }
  });
  console.log('✅ Capsule section created');

  // 5. Instagram Section
  const instagramSection = await prisma.landingPageSection.upsert({
    where: { name: 'instagram' },
    update: {},
    create: {
      name: 'instagram',
      title: 'Charna on the #Gram',
      subtitle: null,
      enabled: true,
      order: 5,
      settings: {
        backgroundColor: '#7A8471',
        instagramHandle: '@charna.co',
        instagramUrl: 'https://www.instagram.com/charna.co?igsh=MXBscWkyNjQybWI2Mw%3D%3D&utm_source=qr',
        layout: 'grid',
        columns: 5
      },
      images: {
        create: [
          {
            imageUrl: '/images/green-backpack.jpg',
            altText: 'Instagram post - Green backpack',
            order: 0,
            enabled: true
          },
          {
            imageUrl: '/913E8FCD-4943-44D3-A3EF-645778762B43_1758357180594.png',
            altText: 'Instagram post - Blue crossbody bag',
            order: 1,
            enabled: true
          },
          {
            imageUrl: '/Navy Tennis bag_1758386586336.png',
            altText: 'Instagram post - Navy tennis bag',
            order: 2,
            enabled: true
          },
          {
            imageUrl: '/Retro Range - Navy Blue_1757319569359.png',
            altText: 'Instagram post - Retro navy backpack',
            order: 3,
            enabled: true
          },
          {
            imageUrl: '/images/white-backpack.jpg',
            altText: 'Instagram post - White backpack',
            order: 4,
            enabled: true
          },
          {
            imageUrl: '/Classic range - Rose Gold_1757356095029.png',
            altText: 'Instagram post - Classic range',
            order: 5,
            enabled: true
          },
          {
            imageUrl: '/LGM_Grounded (1)_1757318142201.png',
            altText: 'Instagram post - Grounded backpack',
            order: 6,
            enabled: true
          },
          {
            imageUrl: '/LGM_Classic_me (1)_1758112410768.png',
            altText: 'Instagram post - Classic tan backpack',
            order: 7,
            enabled: true
          },
          {
            imageUrl: '/Tennis bag - White - neutral background_1758386577764.png',
            altText: 'Instagram post - White tennis bag',
            order: 8,
            enabled: true
          },
          {
            imageUrl: '/DF6D3DFE-6CBA-45BD-8742-1ABE450C1F7E_1758358612678.png',
            altText: 'Instagram post - Laptop sleeve',
            order: 9,
            enabled: true
          }
        ]
      }
    }
  });
  console.log('✅ Instagram section created');

  console.log('');
  console.log('🎉 Landing page seeded successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`  - ${await prisma.landingPageSection.count()} sections`);
  console.log(`  - ${await prisma.landingPageImage.count()} images`);
}

seedLandingPage()
  .catch((e) => {
    console.error('❌ Error seeding landing page:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

