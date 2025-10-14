// Add custom jest matchers from jest-dom
// This allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.YOCO_SECRET_KEY = 'sk_test_mock_key'
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Mock Prisma Client globally
jest.mock('@/lib/prisma', () => ({
  prisma: {
    promoCode: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    promoCodeUsage: {
      count: jest.fn(),
      create: jest.fn(),
    },
    pendingCheckout: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    order: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}))

