/**
 * Tests for Yoco Webhook Handler
 * 
 * Critical: Ensures orders are created with correct discount amounts from pending checkout
 */

import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/webhooks/yoco'
import { prismaMock } from '../../utils/prismaMock'

// Mock crypto for signature verification
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  createHmac: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn(() => 'mock-signature'),
  })),
}))

describe('/api/webhooks/yoco', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create order with discount from pending checkout on payment success', async () => {
    // Mock: No existing order for this payment
    prismaMock.order.findFirst.mockResolvedValue(null)
    
    const mockPendingCheckout = {
      id: 'pending_123',
      checkoutId: 'checkout_abc123',
      customerInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2000',
      },
      items: [
        {
          productId: 1,
          productName: 'Test Bag',
          quantity: 1,
          price: 2000,
        },
      ],
      subtotal: 2000,
      discountAmount: 500,
      totalAmount: 1500,
      promoCodeId: 1,
      promoCodeUsed: 'SUMMER2025',
      expiresAt: new Date(Date.now() + 3600000),
      createdAt: new Date(),
    }

    const mockPromoCode = {
      id: 1,
      code: 'SUMMER2025',
      usedCount: 0,
    }

    const mockOrder = {
      id: 1,
      customerInfo: mockPendingCheckout.customerInfo,
      items: mockPendingCheckout.items,
      subtotal: 2000,
      discountAmount: 500,
      totalAmount: 1500,
      promoCodeId: 1,
      promoCodeUsed: 'SUMMER2025',
      paymentId: 'payment_xyz789',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    prismaMock.pendingCheckout.findUnique.mockResolvedValue(mockPendingCheckout as any)
    prismaMock.promoCode.findFirst.mockResolvedValue(mockPromoCode as any)
    prismaMock.promoCode.update.mockResolvedValue({ ...mockPromoCode, usedCount: 1 } as any)
    prismaMock.promoCodeUsage.create.mockResolvedValue({
      id: 1,
      promoCodeId: 1,
      customerEmail: 'john@example.com',
      discountApplied: 500,
      createdAt: new Date(),
    } as any)
    prismaMock.order.create.mockResolvedValue(mockOrder as any)
    prismaMock.pendingCheckout.delete.mockResolvedValue(mockPendingCheckout as any)

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'x-yoco-signature': 'mock-signature', // Mocked for testing
      },
      body: {
        type: 'payment.succeeded',
        payload: {
          id: 'payment_xyz789',
          checkoutId: 'checkout_abc123',
          amount: 150000, // R1,500 in cents
          status: 'successful',
        },
      },
    })

    await handler(req, res)

    // Verify order was created with correct amounts
    expect(prismaMock.order.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        subtotal: 2000,
        discountAmount: 500,
        totalAmount: 1500,
        promoCodeId: 1,
        promoCodeUsed: 'SUMMER2025',
        paymentId: 'payment_xyz789',
        status: 'completed',
      }),
    })

    // Verify promo code usage was tracked
    expect(prismaMock.promoCode.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { usedCount: { increment: 1 } },
    })

    expect(prismaMock.promoCodeUsage.create).toHaveBeenCalledWith({
      data: {
        promoCodeId: 1,
        customerEmail: 'john@example.com',
        discountApplied: 500,
      },
    })

    // Verify pending checkout was deleted
    expect(prismaMock.pendingCheckout.delete).toHaveBeenCalledWith({
      where: { checkoutId: 'checkout_abc123' },
    })

    expect(res._getStatusCode()).toBe(200)
  })

  it('should create order without discount when no promo code used', async () => {
    // Mock: No existing order for this payment
    prismaMock.order.findFirst.mockResolvedValue(null)
    
    const mockPendingCheckout = {
      id: 'pending_456',
      checkoutId: 'checkout_def456',
      customerInfo: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        address: '456 Oak Ave',
        city: 'Cape Town',
        province: 'Western Cape',
        postalCode: '8000',
      },
      items: [
        {
          productId: 2,
          productName: 'Another Bag',
          quantity: 1,
          price: 1500,
        },
      ],
      subtotal: 1500,
      discountAmount: 0,
      totalAmount: 1500,
      promoCodeId: null,
      promoCodeUsed: null,
      expiresAt: new Date(Date.now() + 3600000),
      createdAt: new Date(),
    }

    prismaMock.pendingCheckout.findUnique.mockResolvedValue(mockPendingCheckout as any)
    prismaMock.order.create.mockResolvedValue({
      id: 2,
      ...mockPendingCheckout,
      paymentId: 'payment_abc123',
      status: 'completed',
      updatedAt: new Date(),
    } as any)
    prismaMock.pendingCheckout.delete.mockResolvedValue(mockPendingCheckout as any)

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'x-yoco-signature': 'mock-signature',
      },
      body: {
        type: 'payment.succeeded',
        payload: {
          id: 'payment_abc123',
          checkoutId: 'checkout_def456',
          amount: 150000,
          status: 'successful',
        },
      },
    })

    await handler(req, res)

    // Verify order created with 0 discount
    expect(prismaMock.order.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        subtotal: 1500,
        discountAmount: 0,
        totalAmount: 1500,
        promoCodeId: null,
        promoCodeUsed: null,
      }),
    })

    // Verify promo code tracking was NOT called
    expect(prismaMock.promoCode.update).not.toHaveBeenCalled()
    expect(prismaMock.promoCodeUsage.create).not.toHaveBeenCalled()

    expect(res._getStatusCode()).toBe(200)
  })

  it('should handle missing pending checkout gracefully', async () => {
    // Mock: No existing order for this payment
    prismaMock.order.findFirst.mockResolvedValue(null)
    // Mock: No pending checkout found
    prismaMock.pendingCheckout.findUnique.mockResolvedValue(null)
    // Mock: Order creation from webhook metadata fallback
    prismaMock.order.create.mockResolvedValue({
      id: 1,
      status: 'completed',
    } as any)

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'x-yoco-signature': 'mock-signature',
      },
      body: {
        type: 'payment.succeeded',
        payload: {
          id: 'payment_orphan',
          checkoutId: 'checkout_notfound',
          amount: 150000,
        },
      },
    })

    await handler(req, res)

    // Should still create order using webhook metadata fallback
    expect(res._getStatusCode()).toBe(200)
    expect(prismaMock.order.create).toHaveBeenCalled()
    
    // Verify it created order from webhook metadata (not pending checkout)
    const createCall = prismaMock.order.create.mock.calls[0][0]
    expect(createCall.data).toMatchObject({
      paymentId: 'payment_orphan',
      status: 'completed',
    })
  })
})

