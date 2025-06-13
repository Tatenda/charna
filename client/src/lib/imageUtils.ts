/**
 * Utility functions for handling image paths
 */

/**
 * Converts an image path from the backend format to a public URL
 * This handles both public assets and external URLs
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
  
  // Return the original path if it doesn't match known patterns
  return path;
}