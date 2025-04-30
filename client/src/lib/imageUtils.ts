/**
 * Utility functions for handling image paths
 */

// Import all the images statically using the @assets alias
import creatorKit1 from "@assets/CreatorKit-AI (1).jpg";
import creatorKit3 from "@assets/CreatorKit-AI (3).jpg";
import creatorKit4 from "@assets/CreatorKit-AI (4).jpg";
import creatorKit6 from "@assets/CreatorKit-AI (6).jpg";
import creatorKit7 from "@assets/CreatorKit-AI (7).jpg";

// Create a map of image paths to their imported versions
const IMAGE_MAP: Record<string, string> = {
  "/attached_assets/CreatorKit-AI (1).jpg": creatorKit1,
  "/attached_assets/CreatorKit-AI (3).jpg": creatorKit3,
  "/attached_assets/CreatorKit-AI (4).jpg": creatorKit4,
  "/attached_assets/CreatorKit-AI (6).jpg": creatorKit6,
  "/attached_assets/CreatorKit-AI (7).jpg": creatorKit7,
};

/**
 * Converts an image path from the backend format to a Vite-compatible import
 * This handles both attached assets and external URLs
 */
export function getImagePath(path: string): string {
  // If it's an external URL, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // If it's an attached asset, return the imported version
  if (path.startsWith('/attached_assets/') && IMAGE_MAP[path]) {
    return IMAGE_MAP[path];
  }
  
  // Return the original path if it doesn't match known patterns
  return path;
}