/**
 * Utility functions for handling image paths
 */

/**
 * Converts an image path from the backend format to a public URL
 * This handles both public assets, external URLs, and Vercel Blob storage
 */
export function getImagePath(path: string): string {
  // If it's an external URL, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // If it's already a public image path, return as is
  if (path.startsWith('/images/')) {
    return path;
  }
  
  // If it's a Vercel Blob filename (stored in DB), construct the full URL
  if (path && !path.startsWith('/') && !path.startsWith('http')) {
    const baseUrl = process.env.NEXT_PUBLIC_BLOB_STORAGE_BASE_URL || process.env.BLOB_STORAGE_BASE_URL;
    if (baseUrl) {
      // Ensure the path starts with a slash
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `${baseUrl}${cleanPath}`;
    }
    
    // If no Vercel Blob base URL, assume it's a local public file
    // Add leading slash if not present
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return cleanPath;
  }
  
  // Return the original path if it doesn't match known patterns
  return path;
}