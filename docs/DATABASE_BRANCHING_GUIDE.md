# Database Branching Setup Guide

## Overview

This guide shows how to create and use a **development database branch** so you can safely test changes without affecting production data.

---

## Why Use Database Branches?

✅ **Safe Development** - Test schema changes without risk  
✅ **Production Copy** - Dev branch has copy of real data  
✅ **Isolated Testing** - Experiments don't affect live customers  
✅ **Easy Rollback** - Delete and recreate branch anytime  
✅ **Fast** - Neon branches are created instantly  

---

## Step 1: Create Development Branch in Neon

### Via Neon Dashboard (Easiest):

1. **Go to Neon Dashboard**
   - Visit: https://console.neon.tech/
   - Select your project: `charna`

2. **Create New Branch**
   - Click **"Branches"** in left sidebar
   - Click **"Create Branch"** button
   - Name: `development` or `dev`
   - Parent: `main` (your production branch)
   - Include data: ✅ **Yes** (copy current production data)
   - Click **"Create"**

3. **Copy Connection String**
   - Click on the new `development` branch
   - Copy the connection string (starts with `postgresql://`)
   - Should look like: `postgresql://neondb_owner:xxx@ep-yyy-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`

### Via Neon CLI (Advanced):

```bash
# Install Neon CLI
npm i -g neonctl

# Login
neonctl auth

# List branches
neonctl branches list

# Create development branch from main
neonctl branches create --name development --parent main --copy-data

# Get connection string
neonctl connection-string development
```

---

## Step 2: Configure Local Development

### 2.1 Create `.env.local` File

Create a new file `.env.local` in your project root:

```bash
# Development Database (Neon dev branch)
DATABASE_URL="postgresql://neondb_owner:xxx@ep-dev-branch-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Vercel Blob Storage (same for dev)
NEXT_PUBLIC_BLOB_STORAGE_BASE_URL=https://allh29lyumanfwa1.public.blob.vercel-storage.com
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_allh29lYuMAnfwa1_Bt18CMtyXraTlgJKM58WNqF3Cgl4wr"

# Yoco TEST Keys (for development)
YOCO_SECRET_KEY=sk_test_YOUR_TEST_KEY_HERE
NEXT_PUBLIC_YOCO_PUBLIC_KEY=pk_test_YOUR_TEST_KEY_HERE

# NextAuth (same as production)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Email (optional for dev)
GMAIL_USER=info@charna.co.za
GMAIL_APP_PASSWORD=cryp ehkv jyii mhdu

# Environment
NODE_ENV=development
```

### 2.2 Update `.env` File (Production)

Keep production credentials in `.env`:

```bash
# Production Database (Neon main branch)
DATABASE_URL="postgresql://neondb_owner:npg_IDUtfHnj5pA2@ep-green-leaf-ad6g033y-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Vercel Blob Storage
NEXT_PUBLIC_BLOB_STORAGE_BASE_URL=https://allh29lyumanfwa1.public.blob.vercel-storage.com
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_allh29lYuMAnfwa1_Bt18CMtyXraTlgJKM58WNqF3Cgl4wr"

# Yoco LIVE Keys (for production)
YOCO_SECRET_KEY=sk_live_YOUR_LIVE_KEY_HERE
NEXT_PUBLIC_YOCO_PUBLIC_KEY=pk_live_YOUR_LIVE_KEY_HERE

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret"

# Environment
NODE_ENV=production
```

### 2.3 Update `.gitignore`

```bash
# Add to .gitignore
.env.local
.env*.local
```

This ensures `.env.local` is never committed to git.

---

## Step 3: Environment File Priority

Next.js loads environment files in this order (later ones override earlier):

1. `.env` - Shared defaults
2. `.env.local` - **Local overrides** (gitignored)
3. `.env.development` - Development defaults  
4. `.env.development.local` - Local dev overrides
5. `.env.production` - Production defaults

**For your setup:**
- **Local dev**: Uses `.env.local` (dev branch)
- **Vercel prod**: Uses `.env` + Vercel dashboard env vars (prod branch)

---

## Step 4: Verify Setup

### Test Database Connection:

```bash
# Should connect to DEV branch
npx prisma db execute --stdin <<< "SELECT current_database();"
```

### Check Which Branch You're Using:

```typescript
// Add to any API route temporarily
console.log('DB:', process.env.DATABASE_URL?.match(/ep-[^-]+/)?.[0]);
```

### Query Data:

```bash
# See how many products in dev branch
npx prisma studio
```

---

## Step 5: Working with Branches

### Switch Between Environments:

```bash
# Use development branch
npm run dev  # Automatically uses .env.local

# Deploy to production
# Vercel uses production DATABASE_URL from dashboard
```

### Sync Dev Branch with Production:

```bash
# Option 1: Via Neon Dashboard
# - Delete dev branch
# - Create new dev branch from main (copies latest data)

# Option 2: Via CLI
neonctl branches delete development
neonctl branches create --name development --parent main --copy-data
```

### Test Migrations Safely:

```bash
# Test migration on dev branch first
npx prisma migrate dev --name test_migration

# If it works, apply to production:
# 1. Deploy to Vercel
# 2. Vercel runs: prisma migrate deploy (on production DB)
```

---

## Step 6: Development Workflow

### Daily Development:

1. **Start dev server** → Uses `.env.local` (dev branch)
2. **Make changes** → Test on dev branch
3. **Run migrations** → Safe on dev branch
4. **Test thoroughly** → No production impact
5. **Deploy to Vercel** → Migrations run on production

### Before Production Deployment:

- ✅ All migrations tested on dev branch
- ✅ Backup production database
- ✅ Review migration files
- ✅ Test critical flows
- ✅ Monitor after deployment

---

## Neon Branch Features

### What You Get:

1. **Instant Branching** - Creates in <1 second
2. **Copy-on-Write** - Efficient storage (only stores diffs)
3. **Point-in-Time Recovery** - Create branch from any timestamp
4. **Multiple Branches** - Unlimited dev/staging/test branches
5. **Auto-Suspend** - Dev branches auto-sleep to save costs

### Branch Management:

```bash
# List all branches
neonctl branches list

# Create feature branch
neonctl branches create --name feature/new-payment-flow --parent development

# Delete old branches
neonctl branches delete old-feature-branch

# Get branch info
neonctl branches get development
```

---

## Common Scenarios

### Scenario 1: Test Risky Migration

```bash
# 1. Create test branch
neonctl branches create --name test-migration --parent main --copy-data

# 2. Get connection string
neonctl connection-string test-migration

# 3. Update DATABASE_URL temporarily
# 4. Run migration
npx prisma migrate dev

# 5. Test thoroughly
# 6. If good: Apply to production
# 7. If bad: Delete test branch
neonctl branches delete test-migration
```

### Scenario 2: Debug Production Issue

```bash
# 1. Create debug branch from production
neonctl branches create --name debug-issue-123 --parent main --copy-data

# 2. Investigate on copy of production data
# 3. Fix issue
# 4. Apply fix to production
# 5. Delete debug branch
```

### Scenario 3: Fresh Development Environment

```bash
# Reset dev branch with latest production data
neonctl branches delete development
neonctl branches create --name development --parent main --copy-data
```

---

## Security Best Practices

### ✅ DO:
- Use `.env.local` for local development
- Keep `.env.local` in `.gitignore`
- Use test payment keys in development
- Regularly sync dev branch with production (weekly)
- Delete old branches to save costs

### ❌ DON'T:
- Commit `.env.local` to git
- Use production payment keys in development
- Run destructive migrations on production first
- Share production connection strings
- Use production database for testing

---

## Troubleshooting

### "Can't connect to database"
- ✅ Check `.env.local` exists and has correct DATABASE_URL
- ✅ Verify branch exists in Neon dashboard
- ✅ Check branch is not suspended (auto-wakes on first query)

### "Migration already exists"
- Prisma tracks migrations per database
- Dev branch has same migration history as production
- Use `npx prisma migrate resolve` if needed

### "Data is outdated"
- Dev branch is a snapshot from when it was created
- Recreate branch to get latest production data

---

## Cost Considerations

### Neon Pricing (as of 2025):
- **Free Tier**: 1 project, 10 branches, 0.5 GB storage
- **Pro Tier**: Unlimited branches, autoscaling
- **Branches**: Free on all tiers!
- **Auto-suspend**: Branches sleep after inactivity (saves compute)

**Your setup will likely stay in free tier!**

---

## Next Steps

1. ✅ Create development branch in Neon dashboard
2. ✅ Copy dev branch connection string
3. ✅ Create `.env.local` with dev DATABASE_URL
4. ✅ Test connection: `npx prisma db execute --stdin <<< "SELECT 1;"`
5. ✅ Run dev server: `npm run dev`
6. ✅ Verify using dev branch (check data)

---

**Ready to proceed?** Let me know the dev branch connection string and I'll create the `.env.local` file for you!

