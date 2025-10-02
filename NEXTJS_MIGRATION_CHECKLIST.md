# Next.js Migration Checklist

## Overview
Converting from Vite + Vercel Functions to Next.js with built-in API routes and server-side rendering.

## Pre-Migration Analysis ✅
- [x] Analyzed current project structure
- [x] Identified Vercel Functions in `/api` directory
- [x] Reviewed React components in `/client/src`
- [x] Checked dependencies and build configuration
- [x] Noted shared schemas and utilities

## Phase 1: Project Setup
- [ ] Create Next.js configuration (`next.config.js`)
- [ ] Update `package.json` with Next.js dependencies
- [ ] Remove Vite-specific dependencies
- [ ] Update build scripts
- [ ] Create Next.js directory structure

## Phase 2: API Routes Migration
- [ ] Migrate `/api/payments/create.ts` → `/pages/api/payments/create.ts`
- [ ] Migrate `/api/payments/charge.ts` → `/pages/api/payments/charge.ts`
- [ ] Migrate `/api/payments/[id].ts` → `/pages/api/payments/[id].ts`
- [ ] Migrate `/api/products.ts` → `/pages/api/products/index.ts`
- [ ] Migrate `/api/products/[id].ts` → `/pages/api/products/[id].ts`
- [ ] Migrate `/api/checkouts/[id].ts` → `/pages/api/checkouts/[id].ts`
- [ ] Migrate `/api/orders.ts` → `/pages/api/orders.ts`
- [ ] Migrate `/api/contact.ts` → `/pages/api/contact.ts`
- [ ] Migrate `/api/test-payments/*` → `/pages/api/test-payments/*`
- [ ] Update API route handlers to use Next.js format
- [ ] Remove Vercel-specific imports (`@vercel/node`)
- [ ] Test all API endpoints

## Phase 3: Frontend Migration
- [ ] Move `/client/src/pages/*` → `/pages/*`
- [ ] Move `/client/src/components/*` → `/components/*`
- [ ] Move `/client/src/lib/*` → `/lib/*`
- [ ] Move `/client/src/hooks/*` → `/hooks/*`
- [ ] Update imports to use Next.js conventions
- [ ] Replace `wouter` routing with Next.js routing
- [ ] Update `App.tsx` → `_app.tsx`
- [ ] Create `_document.tsx` for custom HTML structure
- [ ] Update CSS imports and Tailwind configuration
- [ ] Move public assets to `/public` directory

## Phase 4: Configuration Updates
- [ ] Update `tailwind.config.ts` for Next.js
- [ ] Update `tsconfig.json` for Next.js
- [ ] Remove `vite.config.ts`
- [ ] Update `postcss.config.js` if needed
- [ ] Update `components.json` paths
- [ ] Update `drizzle.config.ts` paths

## Phase 5: Server-Side Features
- [ ] Migrate Express server logic to Next.js API routes
- [ ] Update email service integration
- [ ] Update database connections
- [ ] Update session management
- [ ] Update authentication (if any)
- [ ] Update middleware

## Phase 6: Build & Deployment
- [ ] Update Vercel configuration (`vercel.json`)
- [ ] Test local development (`npm run dev`)
- [ ] Test production build (`npm run build`)
- [ ] Test production start (`npm run start`)
- [ ] Update deployment scripts
- [ ] Test deployment on Vercel

## Phase 7: Testing & Validation
- [ ] Test all pages load correctly
- [ ] Test all API endpoints work
- [ ] Test payment flow end-to-end
- [ ] Test cart functionality
- [ ] Test product browsing
- [ ] Test checkout process
- [ ] Test email notifications
- [ ] Test responsive design
- [ ] Test SEO and meta tags

## Phase 8: Cleanup
- [ ] Remove old `/api` directory
- [ ] Remove old `/client` directory
- [ ] Remove old `/server` directory
- [ ] Remove Vite-specific files
- [ ] Update documentation
- [ ] Update README
- [ ] Clean up unused dependencies

## Key Considerations

### API Routes Changes
- Vercel Functions use `export default async function handler(req, res)`
- Next.js API routes use `export default async function handler(req, res)` (same format!)
- Remove `@vercel/node` imports
- Update CORS handling if needed

### Routing Changes
- Replace `wouter` with Next.js file-based routing
- Update navigation components
- Update dynamic routes (`[id].tsx`)

### Environment Variables
- Keep existing environment variables
- Update any Vite-specific env vars (`VITE_*`)
- Test environment variable access

### Dependencies to Remove
- `vite`
- `@vitejs/plugin-react`
- `@tailwindcss/vite`
- `wouter`
- `@vercel/node`
- `tsx` (for server)

### Dependencies to Add
- `next`
- `react` (update to latest)
- `react-dom` (update to latest)

### Dependencies to Keep
- All Radix UI components
- Tailwind CSS
- React Query
- Drizzle ORM
- Yoco payment integration
- FontAwesome
- All other UI libraries

## Migration Strategy
1. **Incremental Migration**: Keep existing app running while migrating
2. **Test Each Phase**: Validate each phase before moving to next
3. **Backup**: Keep current working version as backup
4. **Documentation**: Update docs as we go

## Risk Mitigation
- Test payment integration thoroughly
- Verify all API endpoints work
- Check SEO and meta tags
- Validate responsive design
- Test email functionality

## Success Criteria
- [ ] All pages load correctly
- [ ] All API endpoints respond correctly
- [ ] Payment processing works
- [ ] Cart functionality works
- [ ] Email notifications work
- [ ] Site is responsive
- [ ] SEO meta tags are correct
- [ ] Performance is maintained or improved
- [ ] Deployment works on Vercel

## Timeline Estimate
- **Phase 1-2**: 2-3 hours (Setup + API migration)
- **Phase 3**: 3-4 hours (Frontend migration)
- **Phase 4-5**: 1-2 hours (Configuration + Server features)
- **Phase 6**: 1 hour (Build & Deployment)
- **Phase 7**: 2-3 hours (Testing)
- **Phase 8**: 30 minutes (Cleanup)

**Total Estimated Time**: 9-13 hours

## Notes
- Next.js API routes are very similar to Vercel Functions
- Most React components should work with minimal changes
- Routing will be the biggest change (wouter → Next.js)
- Payment integration should work the same
- Database and email services should work unchanged
