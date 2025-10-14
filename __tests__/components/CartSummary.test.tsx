/**
 * Tests for CartSummary Component
 * 
 * Tests cart summary display, promo code integration, and total calculations
 */

import { render, screen } from '@testing-library/react'
import CartSummary from '@/components/cart/CartSummary'
import { useCart } from '@/hooks/useCart'

// Mock the useCart hook
jest.mock('@/hooks/useCart')
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>

// Mock PromoCodeInput component
jest.mock('@/components/cart/PromoCodeInput', () => ({
  __esModule: true,
  default: ({ onPromoApplied, onPromoRemoved }: any) => (
    <div data-testid="promo-input">
      <button onClick={() => onPromoApplied('TEST25', 500, 1)}>Apply Promo</button>
      <button onClick={() => onPromoRemoved()}>Remove Promo</button>
    </div>
  ),
}))

describe('CartSummary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display cart subtotal correctly', () => {
    mockUseCart.mockReturnValue({
      cart: [
        {
          product: { id: 1, name: 'Backpack', price: 1500 } as any,
          quantity: 2,
        },
      ],
      cartTotal: 3000,
      cartCount: 2,
      addToCart: jest.fn(),
      updateQuantity: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
    })

    render(<CartSummary />)

    expect(screen.getByText('R3,000')).toBeInTheDocument()
  })

  it('should display free shipping for orders over R1000', () => {
    mockUseCart.mockReturnValue({
      cart: [
        {
          product: { id: 1, name: 'Backpack', price: 1200 } as any,
          quantity: 1,
        },
      ],
      cartTotal: 1200,
      cartCount: 1,
      addToCart: jest.fn(),
      updateQuantity: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
    })

    render(<CartSummary />)

    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('should display shipping cost for orders under R1000', () => {
    mockUseCart.mockReturnValue({
      cart: [
        {
          product: { id: 1, name: 'Sleeve', price: 500 } as any,
          quantity: 1,
        },
      ],
      cartTotal: 500,
      cartCount: 1,
      addToCart: jest.fn(),
      updateQuantity: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
    })

    render(<CartSummary />)

    // Should show R150 shipping
    expect(screen.getByText(/R150/)).toBeInTheDocument()
  })

  it('should show free shipping message for carts under R1000', () => {
    mockUseCart.mockReturnValue({
      cart: [
        {
          product: { id: 1, name: 'Sleeve', price: 500 } as any,
          quantity: 1,
        },
      ],
      cartTotal: 500,
      cartCount: 1,
      addToCart: jest.fn(),
      updateQuantity: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
    })

    render(<CartSummary />)

    expect(screen.getByText(/Free shipping on orders over R1000/)).toBeInTheDocument()
  })

  it('should handle empty cart', () => {
    mockUseCart.mockReturnValue({
      cart: [],
      cartTotal: 0,
      cartCount: 0,
      addToCart: jest.fn(),
      updateQuantity: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
    })

    render(<CartSummary />)

    const checkoutButton = screen.getByRole('button', { name: /Your Cart is Empty/i })
    expect(checkoutButton).toBeDisabled()
  })

  it('should not charge shipping for test products', () => {
    mockUseCart.mockReturnValue({
      cart: [
        {
          product: { id: 9, name: 'Test Bag', price: 200 } as any,
          quantity: 1,
        },
      ],
      cartTotal: 200,
      cartCount: 1,
      addToCart: jest.fn(),
      updateQuantity: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
    })

    render(<CartSummary />)

    // Should show free shipping even though cart is under R1000
    expect(screen.getByText('Free')).toBeInTheDocument()
  })
})

