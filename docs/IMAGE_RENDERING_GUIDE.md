# Image Rendering Guide

## Overview

This project uses a centralized image rendering utility (`getImagePath`) to consistently handle images from various sources:
- Vercel Blob Storage (primary storage for product images)
- Local public assets (static files in /public directory)
- External URLs (http/https links)

## The Image Utility

Located at: `lib/imageUtils.ts`

### Purpose

The `getImagePath` function ensures that all images are properly resolved to their correct URLs, regardless of their source. This is particularly important for:
1. **Vercel Blob Storage**: Images uploaded to Vercel Blob need the full URL constructed
2. **Local Assets**: Static files in /public directory need correct paths
3. **External URLs**: Third-party images need to be passed through unchanged

### How It Works

```typescript
import { getImagePath } from "@/lib/imageUtils";

// Usage example
<img src={getImagePath(product.images[0])} alt={product.name} />
```

The function handles different image path formats:

1. **External URLs** (http/https)
   - Input: `https://example.com/image.jpg`
   - Output: `https://example.com/image.jpg` (unchanged)

2. **Local Public Assets** (starts with /)
   - Input: `/images/logo.png`
   - Output: `/images/logo.png` (unchanged)

3. **Vercel Blob Storage** (no leading slash, no protocol)
   - Input: `product-abc123.jpg`
   - Output: `https://your-blob-url.vercel-storage.com/product-abc123.jpg`

4. **Null/Undefined**
   - Input: `null` or `undefined`
   - Output: `/images/placeholder.png` (fallback)

## Implementation

### Files Updated

The following components have been updated to use `getImagePath`:

1. **Browse Page** (`pages/browse.tsx`)
   - ProductTile component
   - PackageItem component

2. **Home Page Components**
   - `components/home/NewArrivals.tsx`
   - `components/home/ProductTabs.tsx`

3. **Product Components**
   - `components/products/ProductCard.tsx`
   - `components/products/ProductGallery.tsx`

4. **Cart Component**
   - `components/cart/CartItem.tsx`

5. **Admin Components**
   - `pages/admin/products/index.tsx`
   - `components/admin/ImageUpload.tsx`

### Database Image Storage

Images in the database are stored WITHOUT leading slashes (see `server/storage.ts`):
- ✅ `product-123.jpg`
- ❌ `/product-123.jpg`

This format allows `getImagePath` to properly construct Vercel Blob URLs.

## Environment Variables

The utility requires the following environment variable:

```bash
# .env.local
NEXT_PUBLIC_BLOB_STORAGE_BASE_URL=https://your-blob-url.vercel-storage.com
```

**Important**: The `NEXT_PUBLIC_` prefix is required for client-side access.

## Best Practices

### ✅ DO

```typescript
import { getImagePath } from "@/lib/imageUtils";

// Always wrap image paths with getImagePath
<img src={getImagePath(product.images[0])} alt={product.name} />

// Works with Next.js Image component too
<Image src={getImagePath(image)} alt="Product" fill />

// Handle arrays safely
{product.images?.map(img => (
  <img src={getImagePath(img)} alt="Product" />
))}
```

### ❌ DON'T

```typescript
// Don't use raw image paths
<img src={product.images[0]} alt={product.name} />

// Don't manually construct Vercel Blob URLs
<img src={`${process.env.BLOB_URL}/${image}`} alt="Product" />

// Don't forget to handle null/undefined
<img src={product.images[0]} alt={product.name} /> // Might crash
```

## Testing

To test if images are rendering correctly:

1. **Check Browse Page**: Navigate to `/browse?category=work`
   - All product images should load from Vercel Blob Storage

2. **Check Admin Dashboard**: Navigate to `/admin/products`
   - Product thumbnails should display correctly

3. **Check Cart**: Add items to cart and navigate to `/cart`
   - Cart item images should display correctly

4. **Check Network Tab**: Open browser DevTools
   - Image requests should go to Vercel Blob Storage URL
   - No 404 errors for missing images

## Troubleshooting

### Images Not Loading

1. **Verify Environment Variable**
   ```bash
   echo $NEXT_PUBLIC_BLOB_STORAGE_BASE_URL
   ```

2. **Check Database Storage**
   - Images should be stored without leading slashes
   - Run: `SELECT images FROM variants LIMIT 1;`

3. **Check Console for Errors**
   - Open browser DevTools
   - Look for image loading errors

### Images Loading from Wrong Source

1. **Check Image Path Format**
   - Use browser DevTools to inspect the `src` attribute
   - Should match expected format (Vercel Blob URL)

2. **Verify getImagePath Usage**
   - Ensure all image rendering uses `getImagePath`
   - Search codebase: `grep -r "src={product" --include="*.tsx"`

## Migration Notes

When migrating from local storage to Vercel Blob Storage:

1. Update all image references in database to remove leading slashes
2. Set `NEXT_PUBLIC_BLOB_STORAGE_BASE_URL` environment variable
3. Update all components to use `getImagePath`
4. Test thoroughly across all pages

## Future Enhancements

Potential improvements to consider:

1. **Image Optimization**: Add automatic image optimization/resizing
2. **Lazy Loading**: Implement progressive image loading
3. **Error Handling**: Add retry logic for failed image loads
4. **Caching**: Implement client-side image caching strategy
5. **CDN Integration**: Add CDN support for faster global delivery

