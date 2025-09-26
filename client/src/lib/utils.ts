import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price from cents to Rands (ZAR) display format
 * @param priceInCents - Price stored as integer in cents (e.g., 99900 = R999.00)
 * @returns Formatted price string (e.g., "999.00")
 */
export function formatPrice(priceInCents: number): string {
  const priceInRands = priceInCents / 100;
  return priceInRands.toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
