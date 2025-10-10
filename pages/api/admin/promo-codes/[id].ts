import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid promo code ID' });
  }

  const promoCodeId = parseInt(id);

  if (isNaN(promoCodeId)) {
    return res.status(400).json({ message: 'Invalid promo code ID' });
  }

  try {
    if (req.method === 'GET') {
      // Get specific promo code with usage details
      const promoCode = await prisma.promoCode.findUnique({
        where: { id: promoCodeId },
        include: {
          orders: {
            select: {
              id: true,
              customerInfo: true,
              totalAmount: true,
              discountAmount: true,
              createdAt: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          usageLogs: {
            select: {
              id: true,
              customerEmail: true,
              discountApplied: true,
              createdAt: true,
              orderId: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          _count: {
            select: {
              orders: true,
              usageLogs: true
            }
          }
        }
      });

      if (!promoCode) {
        return res.status(404).json({ message: 'Promo code not found' });
      }

      return res.status(200).json(promoCode);

    } else if (req.method === 'PUT') {
      // Update promo code
      const {
        description,
        discountType,
        discountValue,
        maxUses,
        maxUsesPerUser,
        validFrom,
        validUntil,
        minimumOrderValue,
        isActive
      } = req.body;

      // Check if promo code exists
      const existingPromoCode = await prisma.promoCode.findUnique({
        where: { id: promoCodeId }
      });

      if (!existingPromoCode) {
        return res.status(404).json({ message: 'Promo code not found' });
      }

      // Validate discount type if provided
      if (discountType && discountType !== 'percentage' && discountType !== 'fixed') {
        return res.status(400).json({ 
          message: 'discountType must be either "percentage" or "fixed"' 
        });
      }

      // Validate discount value if provided
      if (discountValue !== undefined && discountType === 'percentage') {
        if (discountValue < 1 || discountValue > 100) {
          return res.status(400).json({ 
            message: 'Percentage discount must be between 1 and 100' 
          });
        }
      }

      // Build update data
      const updateData: any = {};
      if (description !== undefined) updateData.description = description;
      if (discountType !== undefined) updateData.discountType = discountType;
      if (discountValue !== undefined) updateData.discountValue = parseInt(discountValue);
      if (maxUses !== undefined) updateData.maxUses = maxUses ? parseInt(maxUses) : null;
      if (maxUsesPerUser !== undefined) updateData.maxUsesPerUser = maxUsesPerUser ? parseInt(maxUsesPerUser) : null;
      if (validFrom !== undefined) updateData.validFrom = new Date(validFrom);
      if (validUntil !== undefined) updateData.validUntil = validUntil ? new Date(validUntil) : null;
      if (minimumOrderValue !== undefined) updateData.minimumOrderValue = minimumOrderValue ? parseInt(minimumOrderValue) : null;
      if (isActive !== undefined) updateData.isActive = isActive;

      // Update promo code
      const promoCode = await prisma.promoCode.update({
        where: { id: promoCodeId },
        data: updateData
      });

      return res.status(200).json({
        message: 'Promo code updated successfully',
        promoCode
      });

    } else if (req.method === 'DELETE') {
      // Delete promo code
      const existingPromoCode = await prisma.promoCode.findUnique({
        where: { id: promoCodeId }
      });

      if (!existingPromoCode) {
        return res.status(404).json({ message: 'Promo code not found' });
      }

      // Check if promo code has been used
      const usageCount = await prisma.promoCodeUsage.count({
        where: { promoCodeId }
      });

      if (usageCount > 0) {
        // Instead of deleting, deactivate it
        const promoCode = await prisma.promoCode.update({
          where: { id: promoCodeId },
          data: { isActive: false }
        });

        return res.status(200).json({
          message: 'Promo code has been deactivated (cannot delete used codes)',
          promoCode
        });
      }

      // Delete if never used
      await prisma.promoCode.delete({
        where: { id: promoCodeId }
      });

      return res.status(200).json({
        message: 'Promo code deleted successfully'
      });

    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Error handling promo code:', error);
    return res.status(500).json({ 
      message: 'Failed to process request',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

