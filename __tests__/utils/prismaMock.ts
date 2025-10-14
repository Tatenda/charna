import { prisma } from '@/lib/prisma'

// Export the mocked prisma client
export const prismaMock = prisma as jest.Mocked<typeof prisma>

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
})

