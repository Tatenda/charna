/**
 * Utility functions for handling image paths
 * 
 * This utility ensures consistent image rendering across the application by:
 * - Handling external URLs (http/https)
 * - Handling local public assets (/images/, /public/)
 * - Handling Vercel Blob storage URLs
 */

/**
 * Converts an image path from the backend format to a public URL
 * This handles both public assets, external URLs, and Vercel Blob storage
 * 
 * @param path - The image path from the database or API
 * @returns The full URL or path to access the image
 * 
 * @example
 * // External URL - returns as-is
 * getImagePath('https://example.com/image.jpg') // => 'https://example.com/image.jpg'
 * 
 * @example
 * // Public asset - returns as-is
 * getImagePath('/images/logo.png') // => '/images/logo.png'
 * 
 * @example
 * // Vercel Blob filename - constructs full URL
 * getImagePath('product-123.jpg') // => 'https://blob.vercel-storage.com/product-123.jpg'
 */
export function getImagePath(path: string | undefined | null): string {
  // Handle empty/null/undefined paths
  if (!path) {
    return '/images/placeholder.png'; // Fallback to a placeholder
  }

  // If it's an external URL (http or https), return as is - these are complete Vercel Blob URLs
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it's a known local public asset path, return as is
  if (path.startsWith('/images/') || path.startsWith('/public/') || path.startsWith('/ChatGPT')) {
    return path;
  }
  
  // If path starts with slash but NOT a known local path, it's likely a Vercel Blob pathname
  // Vercel Blob pathnames look like: /upload_123_abc.jpg
  // We need to check if this is a Vercel upload by looking for common patterns
  if (path.startsWith('/upload_') || path.startsWith('/product-') || 
      (path.startsWith('/') && path.match(/^\/[a-zA-Z0-9_-]+\.[a-z]{3,4}$/))) {
    // This looks like a Vercel Blob pathname - construct the full URL
    const baseUrl = typeof window !== 'undefined'
      ? process.env.NEXT_PUBLIC_BLOB_STORAGE_BASE_URL
      : (process.env.NEXT_PUBLIC_BLOB_STORAGE_BASE_URL || process.env.BLOB_STORAGE_BASE_URL);
    
    if (baseUrl) {
      return `${baseUrl}${path}`;
    }
    
    // Fallback: return as local path if no base URL configured
    console.warn('NEXT_PUBLIC_BLOB_STORAGE_BASE_URL not set, treating as local path:', path);
    return path;
  }
  
  // If path starts with a slash and doesn't match Vercel patterns, it's a local public file
  if (path.startsWith('/')) {
    return path;
  }
  
  // If it's a filename without leading slash (legacy format), construct Vercel Blob URL
  const baseUrl = typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_BLOB_STORAGE_BASE_URL
    : (process.env.NEXT_PUBLIC_BLOB_STORAGE_BASE_URL || process.env.BLOB_STORAGE_BASE_URL);
  
  if (baseUrl) {
    return `${baseUrl}/${path}`;
  }
  
  // Fallback: add leading slash for local path
  return `/${path}`;
}