# Database Setup Instructions

## 1. Create a .env file in the root directory with:

```bash
# Database
# Replace with your actual PostgreSQL connection string
# For Neon: postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
# For local: postgresql://username:password@localhost:5432/charna_db?schema=public
DATABASE_URL="postgresql://username:password@localhost:5432/charna_db?schema=public"

# Yoco Test Keys (for local development)
YOCO_SECRET_KEY=sk_test_477a1cb5gER1pBmdca3419e8b810
YOCO_PUBLIC_KEY=pk_test_3097b2971WOrGKw92624

# Email Configuration (optional)
GMAIL_USER=info@charna.co.com
GMAIL_APP_PASSWORD=cryp ehkv jyii mhdu

# Environment
NODE_ENV=development
```

## 2. Set up your PostgreSQL database:

### Option A: Use Neon (Recommended for production)
1. Go to https://neon.tech/
2. Create a new project
3. Copy the connection string
4. Replace DATABASE_URL in .env with your Neon connection string

### Option B: Use local PostgreSQL
1. Install PostgreSQL locally
2. Create a database named `charna_db`
3. Update the DATABASE_URL in .env with your local credentials

## 3. Run Prisma commands:

```bash
# Generate Prisma client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

## 4. Update your API routes to use Prisma instead of the old storage system
