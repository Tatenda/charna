import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@charna.co.za'
    const password = process.env.ADMIN_PASSWORD
    const name = process.env.ADMIN_NAME || 'Admin User'

    // Require password to be provided
    if (!password) {
      console.error('Error: ADMIN_PASSWORD environment variable is required')
      console.error('\nUsage:')
      console.error('  ADMIN_PASSWORD=your-secure-password yarn create-admin')
      console.error('\nOr set it in your .env file:')
      console.error('  ADMIN_PASSWORD=your-secure-password')
      process.exit(1)
    }

    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('Admin user already exists:', email)
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'admin',
        emailVerified: new Date(),
      }
    })

    console.log('Admin user created successfully:', {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role
    })

    console.log('\nLogin credentials:')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('\nYou can change the password after logging in.')

  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
