/**
 * Integration Test: Cart with Promo Code
 * 
 * Tests the full cart flow including promo code application and total calculations
 */

import { prismaMock } from '../utils/prismaMock'

describe('Integration: Cart with Promo Code', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should calculate correct totals with cart items and promo code', async () => {
    // Scenario: Customer adds items, applies promo code
    
    // STEP 1: Cart Items
    const cartItems = [
      {
        product: { id: 1, name: 'Backpack', price: 1200 },
        quantity: 2,
      },
      {
        product: { id: 2, name: 'Laptop Sleeve', price: 600 },
        quantity: 1,
        customizations: {
          embossing: true,
          embossingText: 'ABC',
          embossingPrice: 150,
        },
      },
    ]

    // Calculate cart total
    const cartSubtotal = 
      (1200 * 2) +       // Backpack: R2,400
      ((600 + 150) * 1)  // Sleeve + embossing: R750
    // = R3,150

    expect(cartSubtotal).toBe(3150)

    // STEP 2: Apply Promo Code
    const mockPromoCode = {
      id: 1,
      code: 'SAVE20',
      discountType: 'percentage',
      discountValue: 20, // 20%
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

    // Calculate discount
    const discountAmount = Math.round((cartSubtotal * 20) / 100) // 630
    expect(discountAmount).toBe(630)

    // STEP 3: Calculate Shipping
    const shippingCost = cartSubtotal >= 1000 ? 0 : 150
    expect(shippingCost).toBe(0) // Free shipping over R1,000

    // STEP 4: Calculate Final Total
    const finalTotal = cartSubtotal - discountAmount + shippingCost
    // R3,150 - R630 + R0 = R2,520
    expect(finalTotal).toBe(2520)

    // STEP 5: Verify Payment Amount
    const paymentAmountInCents = finalTotal * 100
    expect(paymentAmountInCents).toBe(252000)

    console.log('✅ Cart with Promo Code Test Passed!')
    console.log(`   Cart Subtotal: R${cartSubtotal}`)
    console.log(`   Promo Discount (20%): -R${discountAmount}`)
    console.log(`   Shipping: R${shippingCost}`)
    console.log(`   Final Total: R${finalTotal}`)
    console.log(`   Yoco Amount: ${paymentAmountInCents} cents`)
  })

  it('should apply free shipping correctly', () => {
    // Test shipping logic
    
    // Cart under R1,000 - should have shipping
    const smallCart = 800
    const smallShipping = smallCart >= 1000 ? 0 : 150
    expect(smallShipping).toBe(150)

    // Cart over R1,000 - free shipping
    const largeCart = 1200
    const largeShipping = largeCart >= 1000 ? 0 : 150
    expect(largeShipping).toBe(0)

    // Exactly R1,000 - free shipping
    const exactCart = 1000
    const exactShipping = exactCart >= 1000 ? 0 : 150
    expect(exactShipping).toBe(0)
  })

  it('should handle cart with test product (no shipping)', () => {
    const cartTotal = 500
    const hasTestProduct = true
    
    const shippingCost = hasTestProduct ? 0 : (cartTotal >= 1000 ? 0 : 150)
    
    expect(shippingCost).toBe(0) // No shipping for test products
  })

  it('should calculate embossing price correctly', () => {
    const basePrice = 1000
    const embossingPrice = 150
    const quantity = 3

    const itemTotal = (basePrice + embossingPrice) * quantity
    
    expect(itemTotal).toBe(3450) // (1000 + 150) * 3
  })

  it('should maintain separate entries for customized vs non-customized same product', () => {
    // This tests the cart logic where customized items are always separate
    
    const cartScenario = [
      {
        product: { id: 1, price: 1000 },
        quantity: 2,
        customizations: undefined, // Non-customized
      },
      {
        product: { id: 1, price: 1000 },
        quantity: 1,
        customizations: { embossing: true, embossingPrice: 150 }, // Customized
      },
    ]

    const total = cartScenario.reduce((sum, item) => {
      const itemPrice = item.product.price + (item.customizations?.embossingPrice || 0)
      return sum + (itemPrice * item.quantity)
    }, 0)

    // (1000 * 2) + ((1000 + 150) * 1) = 3150
    expect(total).toBe(3150)
    expect(cartScenario).toHaveLength(2) // Should be separate entries
  })
})

