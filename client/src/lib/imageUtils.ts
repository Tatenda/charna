/**
 * Utility functions for handling image paths
 */

/**
 * Converts an image path from the backend format to a Vite-compatible import
 * This handles both attached assets and external URLs
 */
export function getImagePath(path: string): string {
  // If it's an external URL, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // If it's an attached asset, convert the path
  if (path.startsWith('/attached_assets/')) {
    // Remove the leading slash and folder name
    const assetName = path.replace('/attached_assets/', '');
    return new URL(`../../attached_assets/${assetName}`, import.meta.url).href;
  }
  
  // Return the original path if it doesn't match known patterns
  return path;
}