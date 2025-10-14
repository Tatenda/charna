/**
 * Tests for Promo Code Validation API
 * 
 * Critical for ensuring discounts are calculated correctly
 */

import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/promo-codes/validate'
import { prismaMock } from '../../utils/prismaMock'

describe('/api/promo-codes/validate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should validate a percentage discount promo code', async () => {
    const mockPromoCode = {
      id: 1,
      code: 'SUMMER2025',
      discountType: 'percentage',
      discountValue: 25, // 25%
      isActive: true,
      validFrom: new Date('2025-01-01'),
      validUntil: null,
      maxUses: null,
      usedCount: 0,
      maxUsesPerUser: 1,
      minimumOrderValue: 500,
    }

    prismaMock.promoCode.findFirst.mockResolvedValue(mockPromoCode as any)
    prismaMock.promoCodeUsage.count.mockResolvedValue(0)

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        code: 'summer2025',
        orderTotal: 2000,
        customerEmail: 'test@example.com',
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    
    expect(data.valid).toBe(true)
    expect(data.discount).toBe(500) // 25% of 2000
    expect(data.discountedTotal).toBe(1500)
    expect(data.message).toContain('25% discount')
  })

  it('should validate a fixed discount promo code', async () => {
    const mockPromoCode = {
      id: 2,
      code: 'SAVE500',
      discountType: 'fixed',
      discountValue: 500,
      isActive: true,
      validFrom: new Date('2025-01-01'),
      validUntil: null,
      maxUses: null,
      usedCount: 0,
      maxUsesPerUser: 1,
      minimumOrderValue: 1000,
    }

    prismaMock.promoCode.findFirst.mockResolvedValue(mockPromoCode as any)
    prismaMock.promoCodeUsage.count.mockResolvedValue(0)

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        code: 'SAVE500',
        orderTotal: 2000,
        customerEmail: 'test@example.com',
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    
    expect(data.valid).toBe(true)
    expect(data.discount).toBe(500)
    expect(data.discountedTotal).toBe(1500)
  })

  it('should reject invalid promo code', async () => {
    prismaMock.promoCode.findFirst.mockResolvedValue(null)

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        code: 'INVALID',
        orderTotal: 2000,
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    
    expect(data.valid).toBe(false)
    expect(data.discount).toBe(0)
    expect(data.message).toBe('Invalid promo code')
  })

  it('should reject inactive promo code', async () => {
    const mockPromoCode = {
      id: 1,
      code: 'EXPIRED',
      isActive: false,
      discountType: 'percentage',
      discountValue: 10,
      validFrom: new Date('2025-01-01'),
      validUntil: null,
    }

    prismaMock.promoCode.findFirst.mockResolvedValue(mockPromoCode as any)

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        code: 'EXPIRED',
        orderTotal: 2000,
      },
    })

    await handler(req, res)

    const data = JSON.parse(res._getData())
    expect(data.valid).toBe(false)
    expect(data.message).toBe('This promo code is no longer active')
  })

  it('should reject if order is below minimum value', async () => {
    const mockPromoCode = {
      id: 1,
      code: 'BIGORDER',
      discountType: 'percentage',
      discountValue: 10,
      isActive: true,
      validFrom: new Date('2025-01-01'),
      validUntil: null,
      minimumOrderValue: 1000,
      maxUses: null,
      usedCount: 0,
    }

    prismaMock.promoCode.findFirst.mockResolvedValue(mockPromoCode as any)

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        code: 'BIGORDER',
        orderTotal: 500, // Below minimum
      },
    })

    await handler(req, res)

    const data = JSON.parse(res._getData())
    expect(data.valid).toBe(false)
    expect(data.message).toContain('Minimum order value of R1000 required')
  })

  it('should reject if user has already used the code', async () => {
    const mockPromoCode = {
      id: 1,
      code: 'ONCEONLY',
      discountType: 'percentage',
      discountValue: 10,
      isActive: true,
      validFrom: new Date('2025-01-01'),
      validUntil: null,
      maxUsesPerUser: 1,
      maxUses: null,
      usedCount: 0,
    }

    prismaMock.promoCode.findFirst.mockResolvedValue(mockPromoCode as any)
    prismaMock.promoCodeUsage.count.mockResolvedValue(1) // Already used once

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        code: 'ONCEONLY',
        orderTotal: 2000,
        customerEmail: 'test@example.com',
      },
    })

    await handler(req, res)

    const data = JSON.parse(res._getData())
    expect(data.valid).toBe(false)
    expect(data.message).toBe('You have already used this promo code')
  })
})

