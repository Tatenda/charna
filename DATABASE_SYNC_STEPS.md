# Database Sync: Production → Development

## Database URLs

### Production Database
- **Name**: `ep-green-leaf-ad6g033y-pooler`
- **URL**: `postgresql://neondb_owner:npg_IDUtfHnj5pA2@ep-green-leaf-ad6g033y-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`
- **Used by**: Vercel Production, local `.env`

### Development Database  
- **Name**: `ep-rapid-pond-adtp7hsb-pooler`
- **URL**: `postgresql://neondb_owner:npg_IDUtfHnj5pA2@ep-rapid-pond-adtp7hsb-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require`
- **Used by**: Local `.env.local`

## Steps to Copy Production → Development

### Step 1: Backup Production Data
```bash
npx tsx scripts/backup-production.ts
```
- Creates backup file in `backups/production-backup-[timestamp].json`
- This script connects to the production database (from `.env`)

### Step 2: Load Production Data into Development
```bash
npx tsx scripts/load-production-to-dev.ts
```
- Clears all existing data in development database
- Restores data from the latest production backup
- Development database is defined in `.env.local`

### Step 3: Verify Data Sync
```bash
npx tsx scripts/compare-landing-page-data.ts
```
- Compares production and development databases
- Shows any mismatches

## Important Notes

- **Backup script** (`backup-production.ts`) uses DATABASE_URL from `.env` (production)
- **Load script** (`load-production-to-dev.ts`) uses DATABASE_URL from `.env.local` (development)
- **Comparison script** (`compare-landing-page-data.ts`) compares both databases

## Current Status

Last backup: `production-backup-2025-10-27T15-29-30-046Z.json`
- Contains 5 landing page sections with images
