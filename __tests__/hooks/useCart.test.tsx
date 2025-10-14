/**
 * Tests for Cart Hook
 * 
 * Tests cart operations: add, update, remove, clear, totals
 */

import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '@/hooks/useCart'
import { Product } from '@shared/types'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock product for testing
const mockProduct: Product = {
  id: 1,
  name: 'Test Backpack',
  description: 'A test backpack',
  longDescription: 'A longer description',
  price: 1000,
  rating: 5,
  reviewCount: 10,
  inStock: true,
  category: 'work',
  colors: ['black', 'brown'],
  features: ['Water resistant'],
  images: ['test.jpg'],
  materials: 'Leather',
  dimensions: '30x40x10cm',
  careInstructions: 'Wipe clean',
  featured: false,
  createdAt: new Date(),
}

const mockProduct2: Product = {
  ...mockProduct,
  id: 2,
  name: 'Test Laptop Sleeve',
  price: 500,
}

describe('useCart Hook', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  it('should start with empty cart', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.cart).toEqual([])
    expect(result.current.cartCount).toBe(0)
    expect(result.current.cartTotal).toBe(0)
  })

  it('should add item to cart', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 1)
    })

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].product.id).toBe(1)
    expect(result.current.cart[0].quantity).toBe(1)
    expect(result.current.cartCount).toBe(1)
    expect(result.current.cartTotal).toBe(1000)
  })

  it('should update quantity when adding same product', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 1)
    })

    act(() => {
      result.current.addToCart(mockProduct, 2)
    })

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].quantity).toBe(3)
    expect(result.current.cartCount).toBe(3)
    expect(result.current.cartTotal).toBe(3000)
  })

  it('should add multiple different products', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 1)
      result.current.addToCart(mockProduct2, 2)
    })

    expect(result.current.cart).toHaveLength(2)
    expect(result.current.cartCount).toBe(3)
    expect(result.current.cartTotal).toBe(2000) // 1000 + (500 * 2)
  })

  it('should handle customized items as separate cart entries', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 1)
      result.current.addToCart(mockProduct, 1, { 
        embossing: true, 
        embossingText: 'JD',
        embossingPrice: 150
      })
    })

    expect(result.current.cart).toHaveLength(2)
    expect(result.current.cartTotal).toBe(2150) // 1000 + (1000 + 150)
  })

  it('should calculate total with embossing price', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 2, {
        embossing: true,
        embossingText: 'ABC',
        embossingPrice: 150,
      })
    })

    // (1000 + 150) * 2 = 2300
    expect(result.current.cartTotal).toBe(2300)
  })

  it('should update item quantity', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 1)
    })

    act(() => {
      result.current.updateQuantity(mockProduct.id, 5)
    })

    expect(result.current.cart[0].quantity).toBe(5)
    expect(result.current.cartTotal).toBe(5000)
  })

  it('should remove item from cart', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 1)
      result.current.addToCart(mockProduct2, 1)
    })

    expect(result.current.cart).toHaveLength(2)

    act(() => {
      result.current.removeFromCart(mockProduct.id)
    })

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].product.id).toBe(2)
    expect(result.current.cartTotal).toBe(500)
  })

  it('should clear entire cart', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 1)
      result.current.addToCart(mockProduct2, 2)
    })

    expect(result.current.cart).toHaveLength(2)

    act(() => {
      result.current.clearCart()
    })

    expect(result.current.cart).toEqual([])
    expect(result.current.cartCount).toBe(0)
    expect(result.current.cartTotal).toBe(0)
  })

  it('should persist cart to localStorage', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 1)
    })

    const savedCart = localStorageMock.getItem('cart')
    expect(savedCart).toBeTruthy()
    const parsed = JSON.parse(savedCart!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].product.id).toBe(1)
  })

  it('should load cart from localStorage on mount', () => {
    // Pre-populate localStorage
    localStorageMock.setItem('cart', JSON.stringify([
      { product: mockProduct, quantity: 2 }
    ]))

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )
    const { result } = renderHook(() => useCart(), { wrapper })

    // Should load from localStorage
    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].quantity).toBe(2)
    expect(result.current.cartTotal).toBe(2000)
  })

  it('should clear promo code when clearing cart', () => {
    localStorageMock.setItem('appliedPromoCode', JSON.stringify({
      code: 'TEST',
      discount: 100,
    }))

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct, 1)
    })

    act(() => {
      result.current.clearCart()
    })

    expect(localStorageMock.getItem('appliedPromoCode')).toBeNull()
  })
})

