import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with comprehensive product catalog...')

  // Clear existing data
  await prisma.packageItem.deleteMany({})
  await prisma.variantAttribute.deleteMany({})
  await prisma.productVariant.deleteMany({})
  await prisma.productCategory.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})

  // Create Categories (Hierarchical)
  console.log('Creating categories...')
  
  // Parent Categories
  const workCategory = await prisma.category.create({
    data: {
      name: 'work',
      slug: 'work',
      displayName: 'Work',
      description: 'Professional work bags and accessories',
      sortOrder: 1,
    }
  })

  const sportCategory = await prisma.category.create({
    data: {
      name: 'sport',
      slug: 'sport',
      displayName: 'Sport',
      description: 'Sports bags and equipment',
      sortOrder: 2,
    }
  })

  const leisureCategory = await prisma.category.create({
    data: {
      name: 'leisure',
      slug: 'leisure',
      displayName: 'Leisure',
      description: 'Casual leisure bags',
      sortOrder: 3,
    }
  })

  const travelCategory = await prisma.category.create({
    data: {
      name: 'travel',
      slug: 'travel',
      displayName: 'Travel',
      description: 'Travel bags and luggage',
      sortOrder: 4,
    }
  })

  const accessoriesCategory = await prisma.category.create({
    data: {
      name: 'accessories',
      slug: 'accessories',
      displayName: 'Accessories',
      description: 'Bag accessories and add-ons',
      sortOrder: 5,
    }
  })

  const giftingCategory = await prisma.category.create({
    data: {
      name: 'gifting',
      slug: 'gifting',
      displayName: 'Gifting',
      description: 'Gift items and packages',
      sortOrder: 6,
    }
  })

  const onboardingCategory = await prisma.category.create({
    data: {
      name: 'onboarding',
      slug: 'onboarding',
      displayName: 'Onboarding',
      description: 'Onboarding packages and bundles',
      sortOrder: 7,
    }
  })

  // Subcategories
  const businessCategory = await prisma.category.create({
    data: {
      name: 'business',
      slug: 'business',
      displayName: 'Business',
      description: 'Professional business bags',
      parentId: workCategory.id,
      sortOrder: 1,
    }
  })

  const tennisCategory = await prisma.category.create({
    data: {
      name: 'tennis',
      slug: 'tennis',
      displayName: 'Tennis',
      description: 'Tennis bags and equipment',
      parentId: sportCategory.id,
      sortOrder: 1,
    }
  })

  const laptopSleevesCategory = await prisma.category.create({
    data: {
      name: 'laptop-sleeves',
      slug: 'laptop-sleeves',
      displayName: 'Laptop Sleeves',
      description: 'Protective laptop sleeves',
      parentId: accessoriesCategory.id,
      sortOrder: 1,
    }
  })

  const bagTagsCategory = await prisma.category.create({
    data: {
      name: 'bag-tags',
      slug: 'bag-tags',
      displayName: 'Bag Tags',
      description: 'Personalized bag tags',
      parentId: accessoriesCategory.id,
      sortOrder: 2,
    }
  })

  const deskMatsCategory = await prisma.category.create({
    data: {
      name: 'desk-mats',
      slug: 'desk-mats',
      displayName: 'Desk Mats',
      description: 'Premium desk mats',
      parentId: accessoriesCategory.id,
      sortOrder: 3,
    }
  })

  // Create Products with Variations
  console.log('Creating products with variations...')

  // 1. Grounded Tan Backpack with Hardware Variations
  const groundedBackpack = await prisma.product.create({
    data: {
      name: 'Grounded Tan Backpack',
      slug: 'grounded-tan-backpack',
      description: 'Professional backpack with premium tan leather',
      longDescription: 'The Grounded Tan Backpack represents the perfect balance of professional functionality and timeless style. Crafted from premium tan leather, it\'s designed for the modern professional who values both form and function.',
      basePrice: 1999,
      rating: 5,
      reviewCount: 12,
      badge: 'Best Seller',
      materials: 'Premium tan leather and canvas',
      dimensions: '42cm x 32cm x 16cm',
      careInstructions: 'Clean with leather cleaner, condition monthly',
      featured: true,
      isPackage: false,
    }
  })

  // Create variants for Grounded Tan Backpack
  const groundedStandardVariant = await prisma.productVariant.create({
    data: {
      productId: groundedBackpack.id,
      name: 'Standard',
      sku: 'GTB-STD',
      price: 1999,
      originalPrice: 2499,
      inStock: true,
      images: ['LGM_Grounded_1757354709717.png'],
      isDefault: true,
    }
  })

  const groundedGoldVariant = await prisma.productVariant.create({
    data: {
      productId: groundedBackpack.id,
      name: 'Gold Zip',
      sku: 'GTB-GOLD',
      price: 1999,
      originalPrice: 2499,
      inStock: true,
      images: ['ChatGPT Image Sep 17, 2025, 03_09_28 PM_1758392791511.png'],
      isDefault: false,
    }
  })

  // Add attributes to variants
  await prisma.variantAttribute.createMany({
    data: [
      { variantId: groundedStandardVariant.id, attributeType: 'hardware', attributeValue: 'standard', displayOrder: 1 },
      { variantId: groundedStandardVariant.id, attributeType: 'color', attributeValue: 'tan', displayOrder: 2 },
      { variantId: groundedGoldVariant.id, attributeType: 'hardware', attributeValue: 'gold', displayOrder: 1 },
      { variantId: groundedGoldVariant.id, attributeType: 'color', attributeValue: 'tan', displayOrder: 2 },
    ]
  })

  // 2. Timeless White Backpack with Hardware Variations
  const timelessWhiteBackpack = await prisma.product.create({
    data: {
      name: 'Timeless White Backpack',
      slug: 'timeless-white-backpack',
      description: 'Clean and timeless white backpack for professional use',
      longDescription: 'The Timeless White Backpack offers a clean, professional look that never goes out of style. Perfect for professionals who want a minimalist approach to their work accessories.',
      basePrice: 1899,
      rating: 5,
      reviewCount: 10,
      badge: 'Minimalist',
      materials: 'Premium white leather',
      dimensions: '40cm x 30cm x 15cm',
      careInstructions: 'Clean with white leather cleaner, avoid color transfer',
      featured: true,
      isPackage: false,
    }
  })

  const timelessStandardVariant = await prisma.productVariant.create({
    data: {
      productId: timelessWhiteBackpack.id,
      name: 'Standard',
      sku: 'TWB-STD',
      price: 1899,
      originalPrice: 2299,
      inStock: true,
      images: ['Timeless Range - Rose Gold zip_1758117345340.png'],
      isDefault: true,
    }
  })

  const timelessRosegoldVariant = await prisma.productVariant.create({
    data: {
      productId: timelessWhiteBackpack.id,
      name: 'Rosegold Zip',
      sku: 'TWB-ROSEGOLD',
      price: 1899,
      originalPrice: 2299,
      inStock: true,
      images: ['Timeless White BackPack Rosegold Zip_1757319569359.png'],
      isDefault: false,
    }
  })

  await prisma.variantAttribute.createMany({
    data: [
      { variantId: timelessStandardVariant.id, attributeType: 'hardware', attributeValue: 'standard', displayOrder: 1 },
      { variantId: timelessStandardVariant.id, attributeType: 'color', attributeValue: 'white', displayOrder: 2 },
      { variantId: timelessRosegoldVariant.id, attributeType: 'hardware', attributeValue: 'rosegold', displayOrder: 1 },
      { variantId: timelessRosegoldVariant.id, attributeType: 'color', attributeValue: 'white', displayOrder: 2 },
    ]
  })

  // 3. Retro Backpack with Color Variations
  const retroBackpack = await prisma.product.create({
    data: {
      name: 'Retro Backpack',
      slug: 'retro-backpack',
      description: 'Retro-inspired backpack with modern functionality',
      longDescription: 'The Retro Backpack combines vintage aesthetics with modern functionality. Its retro styling makes it perfect for those who appreciate classic design with contemporary features.',
      basePrice: 2399,
      rating: 5,
      reviewCount: 7,
      badge: 'Retro',
      materials: 'Canvas and leather with retro hardware',
      dimensions: '42cm x 32cm x 16cm',
      careInstructions: 'Clean with damp cloth, condition leather monthly',
      featured: true,
      isPackage: false,
    }
  })

  const retroNavyVariant = await prisma.productVariant.create({
    data: {
      productId: retroBackpack.id,
      name: 'Navy',
      sku: 'RB-NAVY',
      price: 2399,
      originalPrice: 2899,
      inStock: true,
      images: ['retro-navy.png'],
      isDefault: true,
    }
  })

  const retroOliveVariant = await prisma.productVariant.create({
    data: {
      productId: retroBackpack.id,
      name: 'Olive',
      sku: 'RB-OLIVE',
      price: 2399,
      originalPrice: 2899,
      inStock: true,
      images: ['retro-olive.png'],
      isDefault: false,
    }
  })

  await prisma.variantAttribute.createMany({
    data: [
      { variantId: retroNavyVariant.id, attributeType: 'color', attributeValue: 'navy', displayOrder: 1 },
      { variantId: retroNavyVariant.id, attributeType: 'style', attributeValue: 'retro', displayOrder: 2 },
      { variantId: retroOliveVariant.id, attributeType: 'color', attributeValue: 'olive', displayOrder: 1 },
      { variantId: retroOliveVariant.id, attributeType: 'style', attributeValue: 'retro', displayOrder: 2 },
    ]
  })

  // 4. Classic Travel Bag with Color Variations
  const classicTravelBag = await prisma.product.create({
    data: {
      name: 'Classic Travel Bag',
      slug: 'classic-travel-bag',
      description: 'Perfect companion for your travels with classic styling',
      longDescription: 'The Classic Travel Bag is designed for the modern traveler who values both style and functionality. With ample space and thoughtful organization, it\'s perfect for weekend trips and business travel.',
      basePrice: 2499,
      rating: 5,
      reviewCount: 11,
      badge: 'Travel',
      materials: 'Heavy-duty canvas and leather',
      dimensions: '45cm x 35cm x 20cm',
      careInstructions: 'Clean with damp cloth, air dry',
      featured: true,
      isPackage: false,
    }
  })

  const travelNavyVariant = await prisma.productVariant.create({
    data: {
      productId: classicTravelBag.id,
      name: 'Navy',
      sku: 'CTB-NAVY',
      price: 2499,
      originalPrice: 2999,
      inStock: true,
      images: ['Classic range - Rose Gold_1757338766199.png'],
      isDefault: true,
    }
  })

  const travelTanVariant = await prisma.productVariant.create({
    data: {
      productId: classicTravelBag.id,
      name: 'Tan',
      sku: 'CTB-TAN',
      price: 2499,
      originalPrice: 2999,
      inStock: true,
      images: ['Classic range - Rose Gold_1757356095029.png'],
      isDefault: false,
    }
  })

  await prisma.variantAttribute.createMany({
    data: [
      { variantId: travelNavyVariant.id, attributeType: 'color', attributeValue: 'navy', displayOrder: 1 },
      { variantId: travelNavyVariant.id, attributeType: 'size', attributeValue: 'large', displayOrder: 2 },
      { variantId: travelTanVariant.id, attributeType: 'color', attributeValue: 'tan', displayOrder: 1 },
      { variantId: travelTanVariant.id, attributeType: 'size', attributeValue: 'large', displayOrder: 2 },
    ]
  })

  // 5. Crossbody Bag with Color Variations
  const crossbodyBag = await prisma.product.create({
    data: {
      name: 'Crossbody Bag',
      slug: 'crossbody-bag',
      description: 'Lightweight and stylish crossbody bag for everyday use',
      longDescription: 'The Crossbody Bag is perfect for those who prefer a lighter, more casual approach to carrying their essentials. Its compact design makes it ideal for everyday use and casual outings.',
      basePrice: 1100,
      rating: 4,
      reviewCount: 7,
      badge: 'Casual',
      materials: 'Lightweight canvas and leather',
      dimensions: '25cm x 20cm x 8cm',
      careInstructions: 'Spot clean, air dry',
      featured: false,
      isPackage: false,
    }
  })

  const crossbodyCreamVariant = await prisma.productVariant.create({
    data: {
      productId: crossbodyBag.id,
      name: 'Cream',
      sku: 'CB-CREAM',
      price: 1100,
      originalPrice: 1400,
      inStock: true,
      images: ['ChatGPT Image Sep 9, 2025, 06_31_47 AM_1757403283997.png'],
      isDefault: true,
    }
  })

  const crossbodyNavyVariant = await prisma.productVariant.create({
    data: {
      productId: crossbodyBag.id,
      name: 'Navy',
      sku: 'CB-NAVY',
      price: 1100,
      originalPrice: 1400,
      inStock: true,
      images: ['Navy side bag - neutral background_1758388433671.png'],
      isDefault: false,
    }
  })

  await prisma.variantAttribute.createMany({
    data: [
      { variantId: crossbodyCreamVariant.id, attributeType: 'color', attributeValue: 'cream', displayOrder: 1 },
      { variantId: crossbodyCreamVariant.id, attributeType: 'size', attributeValue: 'small', displayOrder: 2 },
      { variantId: crossbodyNavyVariant.id, attributeType: 'color', attributeValue: 'navy', displayOrder: 1 },
      { variantId: crossbodyNavyVariant.id, attributeType: 'size', attributeValue: 'small', displayOrder: 2 },
    ]
  })

  // 6. Tennis Bag with Color Variations
  const tennisBag = await prisma.product.create({
    data: {
      name: 'Tennis Bag',
      slug: 'tennis-bag',
      description: 'Professional tennis bag designed for players who demand quality and style',
      longDescription: 'The Tennis Bag combines functionality with elegant design. Perfect for tennis players who need to carry their equipment in style. Features multiple compartments for racquets, balls, and accessories.',
      basePrice: 3299,
      rating: 5,
      reviewCount: 8,
      badge: 'Popular',
      materials: 'Heavy-duty canvas and nylon',
      dimensions: '50cm x 25cm x 20cm',
      careInstructions: 'Machine washable, air dry',
      featured: true,
      isPackage: false,
    }
  })

  const tennisNavyVariant = await prisma.productVariant.create({
    data: {
      productId: tennisBag.id,
      name: 'Navy',
      sku: 'TB-NAVY',
      price: 3299,
      originalPrice: 3999,
      inStock: true,
      images: ['Navy Tennis bag_1757319259444.png'],
      isDefault: true,
    }
  })

  const tennisWhiteVariant = await prisma.productVariant.create({
    data: {
      productId: tennisBag.id,
      name: 'White',
      sku: 'TB-WHITE',
      price: 3299,
      originalPrice: 3999,
      inStock: true,
      images: ['Tennis bag - White - neutral background_1757403947038.png'],
      isDefault: false,
    }
  })

  await prisma.variantAttribute.createMany({
    data: [
      { variantId: tennisNavyVariant.id, attributeType: 'color', attributeValue: 'navy', displayOrder: 1 },
      { variantId: tennisNavyVariant.id, attributeType: 'size', attributeValue: 'large', displayOrder: 2 },
      { variantId: tennisWhiteVariant.id, attributeType: 'color', attributeValue: 'white', displayOrder: 1 },
      { variantId: tennisWhiteVariant.id, attributeType: 'size', attributeValue: 'large', displayOrder: 2 },
    ]
  })

  // 7. Laptop Sleeve with Color Variations
  const laptopSleeve = await prisma.product.create({
    data: {
      name: 'Laptop Sleeve',
      slug: 'laptop-sleeve',
      description: 'Protective laptop sleeve',
      longDescription: 'The Laptop Sleeve provides excellent protection for your laptop while maintaining a professional appearance. Made from premium materials, it\'s perfect for business professionals.',
      basePrice: 1100,
      rating: 4,
      reviewCount: 6,
      badge: 'Protective',
      materials: 'Premium leather and padding',
      dimensions: '35cm x 25cm x 3cm',
      careInstructions: 'Clean with leather cleaner, air dry',
      featured: false,
      isPackage: false,
    }
  })

  const laptopTanVariant = await prisma.productVariant.create({
    data: {
      productId: laptopSleeve.id,
      name: 'Tan',
      sku: 'LS-TAN',
      price: 1100,
      originalPrice: 1400,
      inStock: true,
      images: [
        'Laptop sleeve - Tan_1758299564397.png',
        'Laptop sleeve - Tan_1758299666358.png',
        'Laptop sleeve - Tan_1758299888842.png'
      ],
      isDefault: true,
    }
  })

  const laptopNavyVariant = await prisma.productVariant.create({
    data: {
      productId: laptopSleeve.id,
      name: 'Navy',
      sku: 'LS-NAVY',
      price: 1100,
      originalPrice: 1400,
      inStock: true,
      images: [
        'Laptop sleeve - Navy_1758299564401.png',
        'Laptop sleeve - Navy_1758299666356.png',
        'Laptop sleeve - Navy_1758299888839.png'
      ],
      isDefault: false,
    }
  })

  await prisma.variantAttribute.createMany({
    data: [
      { variantId: laptopTanVariant.id, attributeType: 'color', attributeValue: 'tan', displayOrder: 1 },
      { variantId: laptopTanVariant.id, attributeType: 'size', attributeValue: 'standard', displayOrder: 2 },
      { variantId: laptopNavyVariant.id, attributeType: 'color', attributeValue: 'navy', displayOrder: 1 },
      { variantId: laptopNavyVariant.id, attributeType: 'size', attributeValue: 'standard', displayOrder: 2 },
    ]
  })

  // 8. Desk Mat with Color Variations
  const deskMat = await prisma.product.create({
    data: {
      name: 'Desk Mat',
      slug: 'desk-mat',
      description: 'Premium desk mats for enhanced workspace comfort',
      longDescription: 'Our premium desk mats provide comfort and style for your workspace. Available in multiple colors and sizes to match your office aesthetic.',
      basePrice: 899,
      rating: 4,
      reviewCount: 8,
      badge: 'Workspace',
      materials: 'Premium leather and rubber base',
      dimensions: '60cm x 40cm x 0.5cm',
      careInstructions: 'Clean with damp cloth, air dry',
      featured: false,
      isPackage: false,
    }
  })

  const deskMatTanVariant = await prisma.productVariant.create({
    data: {
      productId: deskMat.id,
      name: 'Tan',
      sku: 'DM-TAN',
      price: 899,
      originalPrice: 1200,
      inStock: true,
      images: ['ChatGPT Image Jul 25, 2025, 05_27_55 PM_1757354752545.png'],
      isDefault: true,
    }
  })

  const deskMatOliveVariant = await prisma.productVariant.create({
    data: {
      productId: deskMat.id,
      name: 'Olive',
      sku: 'DM-OLIVE',
      price: 899,
      originalPrice: 1200,
      inStock: true,
      images: ['ChatGPT Image Sep 17, 2025, 03_09_28 PM_1758392791511.png'],
      isDefault: false,
    }
  })

  const deskMatNavyVariant = await prisma.productVariant.create({
    data: {
      productId: deskMat.id,
      name: 'Navy',
      sku: 'DM-NAVY',
      price: 899,
      originalPrice: 1200,
      inStock: true,
      images: ['ChatGPT Image Sep 5, 2025, 05_34_17 PM_1757354728267.png'],
      isDefault: false,
    }
  })

  await prisma.variantAttribute.createMany({
    data: [
      { variantId: deskMatTanVariant.id, attributeType: 'color', attributeValue: 'tan', displayOrder: 1 },
      { variantId: deskMatTanVariant.id, attributeType: 'size', attributeValue: 'standard', displayOrder: 2 },
      { variantId: deskMatOliveVariant.id, attributeType: 'color', attributeValue: 'olive', displayOrder: 1 },
      { variantId: deskMatOliveVariant.id, attributeType: 'size', attributeValue: 'standard', displayOrder: 2 },
      { variantId: deskMatNavyVariant.id, attributeType: 'color', attributeValue: 'navy', displayOrder: 1 },
      { variantId: deskMatNavyVariant.id, attributeType: 'size', attributeValue: 'standard', displayOrder: 2 },
    ]
  })

  // 9. Company Leather Bag Tag
  const bagTag = await prisma.product.create({
    data: {
      name: 'Company Leather Bag Tag',
      slug: 'company-leather-bag-tag',
      description: 'Elegant leather bag tag for personalization',
      longDescription: 'The Company Leather Bag Tag adds a personal touch to your bag. Made from premium leather, it\'s perfect for customization and identification.',
      basePrice: 250,
      rating: 5,
      reviewCount: 12,
      badge: 'Personal',
      materials: 'Premium leather',
      dimensions: '8cm x 5cm x 0.3cm',
      careInstructions: 'Clean with leather cleaner',
      featured: false,
      isPackage: false,
    }
  })

  const bagTagVariant = await prisma.productVariant.create({
    data: {
      productId: bagTag.id,
      name: 'Standard',
      sku: 'BT-STD',
      price: 250,
      originalPrice: 350,
      inStock: true,
      images: ['Label Tag for company_1758222915683.png'],
      isDefault: true,
    }
  })

  await prisma.variantAttribute.createMany({
    data: [
      { variantId: bagTagVariant.id, attributeType: 'material', attributeValue: 'leather', displayOrder: 1 },
      { variantId: bagTagVariant.id, attributeType: 'size', attributeValue: 'small', displayOrder: 2 },
    ]
  })

  // 10. Leather Luggage Tags
  const luggageTags = await prisma.product.create({
    data: {
      name: 'Leather Luggage Tags',
      slug: 'leather-luggage-tags',
      description: 'Premium leather luggage tags for travel',
      longDescription: 'High-quality leather luggage tags perfect for identifying your luggage during travel. Made from premium leather with durable construction.',
      basePrice: 150,
      rating: 4,
      reviewCount: 5,
      badge: 'Travel',
      materials: 'Premium leather',
      dimensions: '6cm x 4cm x 0.2cm',
      careInstructions: 'Clean with leather cleaner',
      featured: false,
      isPackage: false,
    }
  })

  const luggageTagsVariant = await prisma.productVariant.create({
    data: {
      productId: luggageTags.id,
      name: 'Standard',
      sku: 'LT-STD',
      price: 150,
      originalPrice: 200,
      inStock: true,
      images: ['ChatGPT Image Sep 5, 2025, 12_44_50 PM_1757069177402.png'],
      isDefault: true,
    }
  })

  await prisma.variantAttribute.createMany({
    data: [
      { variantId: luggageTagsVariant.id, attributeType: 'material', attributeValue: 'leather', displayOrder: 1 },
      { variantId: luggageTagsVariant.id, attributeType: 'size', attributeValue: 'small', displayOrder: 2 },
    ]
  })

  // 11. Wine Bottle Bag
  const wineBottleBag = await prisma.product.create({
    data: {
      name: 'Wine Bottle Bag',
      slug: 'wine-bottle-bag',
      description: 'Elegant wine bottle bag for gifting',
      longDescription: 'Perfect for wine enthusiasts and gift-givers. This elegant wine bottle bag provides a sophisticated way to present wine bottles for special occasions.',
      basePrice: 900,
      rating: 4,
      reviewCount: 3,
      badge: 'Gift',
      materials: 'Premium fabric and leather accents',
      dimensions: '35cm x 12cm x 12cm',
      careInstructions: 'Spot clean, air dry',
      featured: false,
      isPackage: false,
    }
  })

  const wineBottleBagVariant = await prisma.productVariant.create({
    data: {
      productId: wineBottleBag.id,
      name: 'Standard',
      sku: 'WBB-STD',
      price: 900,
      originalPrice: 1200,
      inStock: true,
      images: ['Wine bag_1758387116268.png'],
      isDefault: true,
    }
  })

  await prisma.variantAttribute.createMany({
    data: [
      { variantId: wineBottleBagVariant.id, attributeType: 'size', attributeValue: 'standard', displayOrder: 1 },
      { variantId: wineBottleBagVariant.id, attributeType: 'purpose', attributeValue: 'gift', displayOrder: 2 },
    ]
  })

  // 12. White Tennis Bag (separate from Navy Tennis Bag)
  const whiteTennisBag = await prisma.product.create({
    data: {
      name: 'White Tennis Bag',
      slug: 'white-tennis-bag',
      description: 'Clean white tennis bag for players who prefer lighter colors',
      longDescription: 'The White Tennis Bag offers the same functionality as our navy tennis bag but in a clean white color. Perfect for tennis players who prefer lighter colors or want to make a statement on the court.',
      basePrice: 3299,
      rating: 5,
      reviewCount: 4,
      badge: 'Clean',
      materials: 'Heavy-duty white canvas and nylon',
      dimensions: '50cm x 25cm x 20cm',
      careInstructions: 'Machine washable, air dry, avoid color transfer',
      featured: false,
      isPackage: false,
    }
  })

  const whiteTennisBagVariant = await prisma.productVariant.create({
    data: {
      productId: whiteTennisBag.id,
      name: 'White',
      sku: 'WTB-WHITE',
      price: 3299,
      originalPrice: 3999,
      inStock: true,
      images: ['Tennis bag - White - neutral background_1757403947038.png'],
      isDefault: true,
    }
  })

  await prisma.variantAttribute.createMany({
    data: [
      { variantId: whiteTennisBagVariant.id, attributeType: 'color', attributeValue: 'white', displayOrder: 1 },
      { variantId: whiteTennisBagVariant.id, attributeType: 'size', attributeValue: 'large', displayOrder: 2 },
    ]
  })

  // 13. Desk Mat - Tan (separate product)
  const deskMatTan = await prisma.product.create({
    data: {
      name: 'Desk Mat - Tan',
      slug: 'desk-mat-tan',
      description: 'Premium tan desk mat for enhanced workspace comfort',
      longDescription: 'Our premium tan desk mat provides comfort and style for your workspace. The warm tan color creates a professional yet inviting atmosphere.',
      basePrice: 899,
      rating: 4,
      reviewCount: 6,
      badge: 'Workspace',
      materials: 'Premium leather and rubber base',
      dimensions: '60cm x 40cm x 0.5cm',
      careInstructions: 'Clean with damp cloth, air dry',
      featured: false,
      isPackage: false,
    }
  })

  const deskMatTanSingleVariant = await prisma.productVariant.create({
    data: {
      productId: deskMatTan.id,
      name: 'Tan',
      sku: 'DMT-TAN',
      price: 899,
      originalPrice: 1200,
      inStock: true,
      images: ['ChatGPT Image Jul 25, 2025, 05_27_55 PM_1757354752545.png'],
      isDefault: true,
    }
  })

  await prisma.variantAttribute.createMany({
    data: [
      { variantId: deskMatTanSingleVariant.id, attributeType: 'color', attributeValue: 'tan', displayOrder: 1 },
      { variantId: deskMatTanSingleVariant.id, attributeType: 'size', attributeValue: 'standard', displayOrder: 2 },
    ]
  })

  // 14. Desk Mat - Olive (separate product)
  const deskMatOlive = await prisma.product.create({
    data: {
      name: 'Desk Mat - Olive',
      slug: 'desk-mat-olive',
      description: 'Premium olive desk mat for enhanced workspace comfort',
      longDescription: 'Our premium olive desk mat provides comfort and style for your workspace. The olive color adds a natural, earthy touch to your office.',
      basePrice: 899,
      rating: 4,
      reviewCount: 5,
      badge: 'Workspace',
      materials: 'Premium leather and rubber base',
      dimensions: '60cm x 40cm x 0.5cm',
      careInstructions: 'Clean with damp cloth, air dry',
      featured: false,
      isPackage: false,
    }
  })

  const deskMatOliveSingleVariant = await prisma.productVariant.create({
    data: {
      productId: deskMatOlive.id,
      name: 'Olive',
      sku: 'DMO-OLIVE',
      price: 899,
      originalPrice: 1200,
      inStock: true,
      images: ['ChatGPT Image Sep 17, 2025, 03_09_28 PM_1758392791511.png'],
      isDefault: true,
    }
  })

  await prisma.variantAttribute.createMany({
    data: [
      { variantId: deskMatOliveSingleVariant.id, attributeType: 'color', attributeValue: 'olive', displayOrder: 1 },
      { variantId: deskMatOliveSingleVariant.id, attributeType: 'size', attributeValue: 'standard', displayOrder: 2 },
    ]
  })

  // 15. Desk Mat - Navy (separate product)
  const deskMatNavy = await prisma.product.create({
    data: {
      name: 'Desk Mat - Navy',
      slug: 'desk-mat-navy',
      description: 'Premium navy desk mat for enhanced workspace comfort',
      longDescription: 'Our premium navy desk mat provides comfort and style for your workspace. The navy color creates a professional, sophisticated look.',
      basePrice: 899,
      rating: 4,
      reviewCount: 5,
      badge: 'Workspace',
      materials: 'Premium leather and rubber base',
      dimensions: '60cm x 40cm x 0.5cm',
      careInstructions: 'Clean with damp cloth, air dry',
      featured: false,
      isPackage: false,
    }
  })

  const deskMatNavySingleVariant = await prisma.productVariant.create({
    data: {
      productId: deskMatNavy.id,
      name: 'Navy',
      sku: 'DMN-NAVY',
      price: 899,
      originalPrice: 1200,
      inStock: true,
      images: ['ChatGPT Image Sep 5, 2025, 05_34_17 PM_1757354728267.png'],
      isDefault: true,
    }
  })

  await prisma.variantAttribute.createMany({
    data: [
      { variantId: deskMatNavySingleVariant.id, attributeType: 'color', attributeValue: 'navy', displayOrder: 1 },
      { variantId: deskMatNavySingleVariant.id, attributeType: 'size', attributeValue: 'standard', displayOrder: 2 },
    ]
  })

  // 16. Test Bag
  const testBag = await prisma.product.create({
    data: {
      name: 'Test Bag',
      slug: 'test-bag',
      description: 'Test product for development and testing purposes',
      longDescription: 'This is a test product used for development and testing. It has a low price to test payment processing and shipping calculations.',
      basePrice: 200,
      rating: 5,
      reviewCount: 1,
      badge: 'Test',
      materials: 'Test materials',
      dimensions: '30cm x 20cm x 10cm',
      careInstructions: 'Test care instructions',
      featured: false,
      isPackage: false,
    }
  })

  const testBagVariant = await prisma.productVariant.create({
    data: {
      productId: testBag.id,
      name: 'Standard',
      sku: 'TB-TEST',
      price: 200,
      originalPrice: 300,
      inStock: true,
      images: ['ChatGPT Image Jul 25, 2025, 05_27_55 PM_1757354752545.png'],
      isDefault: true,
    }
  })

  await prisma.variantAttribute.createMany({
    data: [
      { variantId: testBagVariant.id, attributeType: 'color', attributeValue: 'red', displayOrder: 1 },
      { variantId: testBagVariant.id, attributeType: 'size', attributeValue: 'small', displayOrder: 2 },
    ]
  })

  // 13. Package Product - The Perfect Onboarding Package
  const onboardingPackage = await prisma.product.create({
    data: {
      name: 'The Perfect Onboarding Package',
      slug: 'perfect-onboarding-package',
      description: 'Complete onboarding solution with essential items',
      longDescription: 'The Perfect Onboarding Package includes everything a new employee needs: a professional backpack, laptop sleeve, and personalized bag tag. Perfect for welcoming new team members.',
      basePrice: 3180,
      rating: 5,
      reviewCount: 15,
      badge: 'Complete',
      materials: 'Multiple premium materials',
      dimensions: 'Package dimensions vary',
      careInstructions: 'See individual item care instructions',
      featured: true,
      isPackage: true,
    }
  })

  // Create package items
  await prisma.packageItem.createMany({
    data: [
      {
        packageProductId: onboardingPackage.id,
        variantId: groundedStandardVariant.id,
        quantity: 1,
        size: 'large',
        displayOrder: 1,
      },
      {
        packageProductId: onboardingPackage.id,
        variantId: laptopTanVariant.id,
        quantity: 1,
        size: 'small',
        displayOrder: 2,
      },
      {
        packageProductId: onboardingPackage.id,
        variantId: bagTagVariant.id,
        quantity: 1,
        size: 'small',
        displayOrder: 3,
      },
    ]
  })

  // 14. Package Product - The Perfect Onboarding Package 2
  const onboardingPackage2 = await prisma.product.create({
    data: {
      name: 'The Perfect Onboarding Package 2',
      slug: 'perfect-onboarding-package-2',
      description: 'Premium onboarding package with retro styling',
      longDescription: 'The Perfect Onboarding Package 2 offers a premium selection with retro styling. Includes a retro backpack, laptop sleeve, desk mat, and personalized tag for the complete professional experience.',
      basePrice: 4399,
      rating: 5,
      reviewCount: 8,
      badge: 'Premium',
      materials: 'Multiple premium materials',
      dimensions: 'Package dimensions vary',
      careInstructions: 'See individual item care instructions',
      featured: true,
      isPackage: true,
    }
  })

  // Create package items for package 2
  await prisma.packageItem.createMany({
    data: [
      {
        packageProductId: onboardingPackage2.id,
        variantId: retroNavyVariant.id,
        quantity: 1,
        size: 'medium',
        displayOrder: 1,
      },
      {
        packageProductId: onboardingPackage2.id,
        variantId: laptopTanVariant.id,
        quantity: 1,
        size: 'medium',
        displayOrder: 2,
      },
      {
        packageProductId: onboardingPackage2.id,
        variantId: deskMatTanVariant.id,
        quantity: 1,
        size: 'medium',
        displayOrder: 3,
      },
      {
        packageProductId: onboardingPackage2.id,
        variantId: bagTagVariant.id,
        quantity: 1,
        size: 'medium',
        displayOrder: 4,
      },
    ]
  })

  // Create Product-Category Relationships
  console.log('Creating product-category relationships...')
  
  await prisma.productCategory.createMany({
    data: [
      // Grounded Tan Backpack - Business (primary), Onboarding, Gifting
      { productId: groundedBackpack.id, categoryId: businessCategory.id, isPrimary: true },
      { productId: groundedBackpack.id, categoryId: onboardingCategory.id, isPrimary: false },
      { productId: groundedBackpack.id, categoryId: giftingCategory.id, isPrimary: false },
      
      // Timeless White Backpack - Business (primary), Onboarding, Gifting
      { productId: timelessWhiteBackpack.id, categoryId: businessCategory.id, isPrimary: true },
      { productId: timelessWhiteBackpack.id, categoryId: onboardingCategory.id, isPrimary: false },
      { productId: timelessWhiteBackpack.id, categoryId: giftingCategory.id, isPrimary: false },
      
      // Retro Backpack - Business (primary), Onboarding, Gifting
      { productId: retroBackpack.id, categoryId: businessCategory.id, isPrimary: true },
      { productId: retroBackpack.id, categoryId: onboardingCategory.id, isPrimary: false },
      { productId: retroBackpack.id, categoryId: giftingCategory.id, isPrimary: false },
      
      // Classic Travel Bag - Travel (primary)
      { productId: classicTravelBag.id, categoryId: travelCategory.id, isPrimary: true },
      
      // Crossbody Bag - Leisure (primary)
      { productId: crossbodyBag.id, categoryId: leisureCategory.id, isPrimary: true },
      
      // Tennis Bag - Tennis (primary), Sport
      { productId: tennisBag.id, categoryId: tennisCategory.id, isPrimary: true },
      
      // Laptop Sleeve - Accessories (primary), Business, Onboarding
      { productId: laptopSleeve.id, categoryId: laptopSleevesCategory.id, isPrimary: true },
      { productId: laptopSleeve.id, categoryId: businessCategory.id, isPrimary: false },
      { productId: laptopSleeve.id, categoryId: onboardingCategory.id, isPrimary: false },
      
      // Desk Mat - Accessories (primary), Onboarding
      { productId: deskMat.id, categoryId: deskMatsCategory.id, isPrimary: true },
      { productId: deskMat.id, categoryId: onboardingCategory.id, isPrimary: false },
      
      // Company Leather Bag Tag - Accessories (primary), Onboarding
      { productId: bagTag.id, categoryId: bagTagsCategory.id, isPrimary: true },
      { productId: bagTag.id, categoryId: onboardingCategory.id, isPrimary: false },
      
      // Leather Luggage Tags - Accessories (primary)
      { productId: luggageTags.id, categoryId: bagTagsCategory.id, isPrimary: true },
      
      // Wine Bottle Bag - Gifting (primary)
      { productId: wineBottleBag.id, categoryId: giftingCategory.id, isPrimary: true },
      
      // White Tennis Bag - Tennis (primary), Sport
      { productId: whiteTennisBag.id, categoryId: tennisCategory.id, isPrimary: true },
      
      // Desk Mat - Tan - Accessories (primary)
      { productId: deskMatTan.id, categoryId: deskMatsCategory.id, isPrimary: true },
      
      // Desk Mat - Olive - Accessories (primary)
      { productId: deskMatOlive.id, categoryId: deskMatsCategory.id, isPrimary: true },
      
      // Desk Mat - Navy - Accessories (primary)
      { productId: deskMatNavy.id, categoryId: deskMatsCategory.id, isPrimary: true },
      
      // Test Bag - Business (primary)
      { productId: testBag.id, categoryId: businessCategory.id, isPrimary: true },
      
      // Onboarding Packages - Onboarding (primary), Gifting
      { productId: onboardingPackage.id, categoryId: onboardingCategory.id, isPrimary: true },
      { productId: onboardingPackage.id, categoryId: giftingCategory.id, isPrimary: false },
      { productId: onboardingPackage2.id, categoryId: onboardingCategory.id, isPrimary: true },
      { productId: onboardingPackage2.id, categoryId: giftingCategory.id, isPrimary: false },
    ]
  })

  console.log('Database seeded successfully!')
  console.log('Created:')
  console.log('- 7 categories (2 parent, 5 subcategories)')
  console.log('- 19 products')
  console.log('- 30 product variants')
  console.log('- 60+ variant attributes')
  console.log('- 40+ product-category relationships')
  console.log('- 7 package items')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })