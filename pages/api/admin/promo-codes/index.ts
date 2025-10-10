import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

  try {
    if (req.method === 'GET') {
      // List all promo codes
      const { search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      const where: any = {};

      // Filter by search (code or description)
      if (search && typeof search === 'string') {
        where.OR = [
          { code: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      // Filter by status
      if (status === 'active') {
        where.isActive = true;
      } else if (status === 'inactive') {
        where.isActive = false;
      } else if (status === 'expired') {
        where.validUntil = { lt: new Date() };
      }

      const orderBy: any = {};
      if (typeof sortBy === 'string') {
        orderBy[sortBy] = sortOrder === 'asc' ? 'asc' : 'desc';
      }

      const promoCodes = await prisma.promoCode.findMany({
        where,
        orderBy,
        include: {
          _count: {
            select: {
              orders: true,
              usageLogs: true
            }
          }
        }
      });

      return res.status(200).json(promoCodes);

    } else if (req.method === 'POST') {
      // Create new promo code
      const {
        code,
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

      // Validate required fields
      if (!code || !discountType || discountValue === undefined) {
        return res.status(400).json({ 
          message: 'Missing required fields: code, discountType, discountValue' 
        });
      }

      // Validate discount type
      if (discountType !== 'percentage' && discountType !== 'fixed') {
        return res.status(400).json({ 
          message: 'discountType must be either "percentage" or "fixed"' 
        });
      }

      // Validate discount value
      if (discountType === 'percentage' && (discountValue < 1 || discountValue > 100)) {
        return res.status(400).json({ 
          message: 'Percentage discount must be between 1 and 100' 
        });
      }

      // Normalize code (uppercase, trim)
      const normalizedCode = code.trim().toUpperCase();

      // Check if code already exists
      const existingCode = await prisma.promoCode.findFirst({
        where: {
          code: {
            equals: normalizedCode,
            mode: 'insensitive'
          }
        }
      });

      if (existingCode) {
        return res.status(409).json({ 
          message: 'A promo code with this code already exists' 
        });
      }

      // Create promo code
      const promoCode = await prisma.promoCode.create({
        data: {
          code: normalizedCode,
          description,
          discountType,
          discountValue: parseInt(discountValue),
          maxUses: maxUses ? parseInt(maxUses) : null,
          maxUsesPerUser: maxUsesPerUser ? parseInt(maxUsesPerUser) : 1,
          validFrom: validFrom ? new Date(validFrom) : new Date(),
          validUntil: validUntil ? new Date(validUntil) : null,
          minimumOrderValue: minimumOrderValue ? parseInt(minimumOrderValue) : null,
          isActive: isActive !== undefined ? isActive : true,
          createdBy: session.user?.email || undefined
        }
      });

      return res.status(201).json({
        message: 'Promo code created successfully',
        promoCode
      });

    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Error handling promo codes:', error);
    return res.status(500).json({ 
      message: 'Failed to process request',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

