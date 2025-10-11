// Landing Page Section Configuration

export interface SectionConfig {
  name: string;
  displayName: string;
  description: string;
  maxImages: number | null; // null = unlimited
  icon: string;
  hasHoverImages: boolean;
  metadataFields: MetadataField[];
}

export interface MetadataField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'url' | 'json';
  required?: boolean;
  placeholder?: string;
}

export const SECTION_CONFIGS: Record<string, SectionConfig> = {
  hero: {
    name: 'hero',
    displayName: 'Hero Section',
    description: 'Main landing page background image',
    maxImages: 1,
    icon: '🎬',
    hasHoverImages: false,
    metadataFields: [
      { key: 'position', label: 'Image Position', type: 'text', placeholder: 'center' },
      { key: 'overlay', label: 'Overlay Type', type: 'text', placeholder: 'dark' },
    ],
  },
  ranges: {
    name: 'ranges',
    displayName: 'Our Ranges',
    description: 'Product range showcase cards',
    maxImages: null, // unlimited
    icon: '🎒',
    hasHoverImages: true,
    metadataFields: [
      { key: 'rangeName', label: 'Range Name', type: 'text', required: true },
      { key: 'price', label: 'Price', type: 'number', required: true },
      { key: 'description', label: 'Description', type: 'text', required: true },
      { key: 'category', label: 'Category', type: 'text', required: true },
      { key: 'hoverImage', label: 'Hover Image URL', type: 'url' },
    ],
  },
  categories: {
    name: 'categories',
    displayName: 'Shop by Category',
    description: 'Category tiles with animated images',
    maxImages: 8,
    icon: '🏷️',
    hasHoverImages: true,
    metadataFields: [
      { key: 'categoryName', label: 'Category Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'text', required: true },
      { key: 'gridSpan', label: 'Grid Span', type: 'text', placeholder: 'col-span-1 row-span-1' },
      { key: 'hoverImages', label: 'Hover Images (JSON array)', type: 'json' },
    ],
  },
  capsule: {
    name: 'capsule',
    displayName: 'Bag Capsule',
    description: 'Full-screen feature image',
    maxImages: 1,
    icon: '📦',
    hasHoverImages: false,
    metadataFields: [
      { key: 'fullscreen', label: 'Fullscreen', type: 'text', placeholder: 'true' },
    ],
  },
  instagram: {
    name: 'instagram',
    displayName: 'Instagram Gallery',
    description: 'Social media gallery grid',
    maxImages: 10,
    icon: '📸',
    hasHoverImages: false,
    metadataFields: [],
  },
};

export function getSectionConfig(sectionName: string): SectionConfig {
  return SECTION_CONFIGS[sectionName] || {
    name: sectionName,
    displayName: sectionName,
    description: 'Custom section',
    maxImages: null,
    icon: '📄',
    hasHoverImages: false,
    metadataFields: [],
  };
}

export function canAddImage(sectionName: string, currentCount: number): boolean {
  const config = getSectionConfig(sectionName);
  if (config.maxImages === null) return true;
  return currentCount < config.maxImages;
}

export function getImageLimitMessage(sectionName: string): string {
  const config = getSectionConfig(sectionName);
  if (config.maxImages === null) return 'Unlimited images';
  return `Maximum ${config.maxImages} image${config.maxImages === 1 ? '' : 's'}`;
}

