#!/bin/bash

echo "🔄 Restarting Development Server..."
echo ""

# Stop any running dev servers
echo "1. Stopping any running dev servers..."
pkill -f "next dev" 2>/dev/null || echo "   No dev server running"

# Clear Next.js cache
echo "2. Clearing Next.js cache..."
rm -rf .next
echo "   ✅ Cache cleared"

# Regenerate Prisma client
echo "3. Regenerating Prisma client..."
npx prisma generate > /dev/null 2>&1
echo "   ✅ Prisma client ready"

echo ""
echo "✅ All done! Now run: npm run dev"
echo ""

