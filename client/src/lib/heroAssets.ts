// Optimized image loading for Hero component - load images dynamically
export const getHeroImage = (imageName: string): string => {
  try {
    switch (imageName) {
      case 'newHeroBg':
        return new URL('../../../attached_assets/image_1757230274214.png', import.meta.url).href;
      case 'oliveBackpack':
        return new URL('../../../attached_assets/Retro Range - Olive_1758362124136.png', import.meta.url).href;
      case 'creamCrossbody':
        return new URL('../../../attached_assets/ChatGPT Image Sep 9, 2025, 06_31_47 AM_1757403283997.png', import.meta.url).href;
      case 'brownBackpack':
        return new URL('../../../attached_assets/LGM_Classic_me (1)_1757403284001.png', import.meta.url).href;
      default:
        // Return a placeholder for missing images
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+';
    }
  } catch (error) {
    console.warn('Failed to load hero image:', imageName, error);
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+';
  }
};

// Only load the essential carousel images
export const carouselImages = [
  {
    id: 1,
    src: 'oliveBackpack',
    alt: 'Olive Green Backpack',
    title: 'Premium Collection',
    subtitle: 'For Every Journey'
  },
  {
    id: 2, 
    src: 'creamCrossbody',
    alt: 'Cream Crossbody Bag',
    title: 'Handcrafted Quality',
    subtitle: 'South African Heritage'
  },
  {
    id: 3,
    src: 'brownBackpack', 
    alt: 'Brown Lifestyle Backpack',
    title: 'Modern Design',
    subtitle: 'Timeless Style'
  }
];