import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { PromoCodeValidationRequest, PromoCodeValidationResponse } from '@/shared/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PromoCodeValidationResponse>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      valid: false,
      discount: 0,
      message: 'Method not allowed'
    });
  }

  try {
    const { code, orderTotal, customerEmail }: PromoCodeValidationRequest = req.body;

    // Validate request
    if (!code || orderTotal === undefined) {
      return res.status(400).json({
        valid: false,
        discount: 0,
        message: 'Missing required fields: code and orderTotal'
      });
    }

    // Normalize code (uppercase, trim whitespace)
    const normalizedCode = code.trim().toUpperCase();

    // Find promo code (case-insensitive)
    const promoCode = await prisma.promoCode.findFirst({
      where: {
        code: {
          equals: normalizedCode,
          mode: 'insensitive'
        }
      }
    });

    // Check if code exists
    if (!promoCode) {
      return res.status(200).json({
        valid: false,
        discount: 0,
        message: 'Invalid promo code'
      });
    }

    // Check if code is active
    if (!promoCode.isActive) {
      return res.status(200).json({
        valid: false,
        discount: 0,
        message: 'This promo code is no longer active'
      });
    }

    // Check validity period
    const now = new Date();
    if (promoCode.validFrom > now) {
      return res.status(200).json({
        valid: false,
        discount: 0,
        message: 'This promo code is not yet valid'
      });
    }

    if (promoCode.validUntil && promoCode.validUntil < now) {
      return res.status(200).json({
        valid: false,
        discount: 0,
        message: 'This promo code has expired'
      });
    }

    // Check if max uses exceeded
    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return res.status(200).json({
        valid: false,
        discount: 0,
        message: 'This promo code has reached its usage limit'
      });
    }

    // Check per-user limit if customer email provided
    if (customerEmail && promoCode.maxUsesPerUser) {
      const userUsageCount = await prisma.promoCodeUsage.count({
        where: {
          promoCodeId: promoCode.id,
          customerEmail: {
            equals: customerEmail,
            mode: 'insensitive'
          }
        }
      });

      if (userUsageCount >= promoCode.maxUsesPerUser) {
        return res.status(200).json({
          valid: false,
          discount: 0,
          message: 'You have already used this promo code'
        });
      }
    }

    // Check minimum order value
    if (promoCode.minimumOrderValue && orderTotal < promoCode.minimumOrderValue) {
      return res.status(200).json({
        valid: false,
        discount: 0,
        message: `Minimum order value of R${promoCode.minimumOrderValue} required`
      });
    }

    // Calculate discount
    let discount = 0;
    if (promoCode.discountType === 'percentage') {
      discount = Math.round((orderTotal * promoCode.discountValue) / 100);
    } else if (promoCode.discountType === 'fixed') {
      discount = promoCode.discountValue;
    }

    // Ensure discount doesn't exceed order total
    discount = Math.min(discount, orderTotal);

    const discountedTotal = orderTotal - discount;

    // Return success
    return res.status(200).json({
      valid: true,
      discount,
      discountedTotal,
      message: promoCode.discountType === 'percentage' 
        ? `${promoCode.discountValue}% discount applied!`
        : `R${promoCode.discountValue} discount applied!`,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        description: promoCode.description || undefined,
        discountType: promoCode.discountType as 'percentage' | 'fixed',
        discountValue: promoCode.discountValue,
        maxUses: promoCode.maxUses || undefined,
        usedCount: promoCode.usedCount,
        maxUsesPerUser: promoCode.maxUsesPerUser || undefined,
        validFrom: promoCode.validFrom,
        validUntil: promoCode.validUntil || undefined,
        minimumOrderValue: promoCode.minimumOrderValue || undefined,
        isActive: promoCode.isActive,
        createdBy: promoCode.createdBy || undefined,
        createdAt: promoCode.createdAt,
        updatedAt: promoCode.updatedAt
      }
    });

  } catch (error) {
    console.error('Error validating promo code:', error);
    return res.status(500).json({
      valid: false,
      discount: 0,
      message: 'Failed to validate promo code'
    });
  }
}

