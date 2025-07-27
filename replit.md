# LIGREMO E-commerce Platform

## Overview

This is a full-stack e-commerce platform for LIGREMO, a South African leather goods company specializing in handcrafted bags. The application features a modern React frontend with a Node.js/Express backend, showcasing premium leather products with a focus on craftsmanship and Italian heritage brought to life in Johannesburg.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Context API for cart management, TanStack Query for server state
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for brand colors
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **API Pattern**: RESTful API design
- **Development**: Hot reload with tsx and Vite integration

### Database Strategy
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Centralized schema definition in `shared/schema.ts`
- **Migrations**: Drizzle Kit for database migrations
- **Connection**: Neon serverless PostgreSQL database

## Key Components

### Product Management
- Product catalog with detailed information (images, pricing, descriptions)
- Category-based organization (tennis, business bags)
- Featured products system
- Inventory tracking and stock management
- Multi-image gallery support

### Shopping Cart & Checkout
- Persistent cart using localStorage
- Real-time cart updates with React Context
- Comprehensive checkout form with validation
- Order management system
- Customer information collection

### User Interface
- Responsive design optimized for mobile and desktop
- Custom color scheme reflecting brand identity
- Font Awesome icons for consistent iconography
- Toast notifications for user feedback
- Loading states and error handling

### Contact & Communication
- Contact form with validation
- WhatsApp integration for customer support
- Company story and values presentation
- Social media integration

## Data Flow

1. **Product Display**: Products are fetched from the backend API and cached using TanStack Query
2. **Cart Management**: Cart state is managed through React Context and persisted in localStorage
3. **Order Processing**: Orders are submitted to the backend with customer and cart information
4. **Contact Forms**: Contact submissions are processed and stored in the database

## External Dependencies

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Radix UI**: Accessible component primitives
- **Font Awesome**: Icon library for consistent iconography
- **Google Fonts**: Inter, Montserrat, and Playfair Display typography

### Development Tools
- **TypeScript**: Type safety across the entire application
- **Vite**: Fast build tool with hot module replacement
- **ESBuild**: Production bundling for the server
- **Drizzle Kit**: Database schema management and migrations

### Database & Backend
- **Neon**: Serverless PostgreSQL database
- **Zod**: Runtime type validation for forms and API
- **React Hook Form**: Form state management with validation

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts both frontend and backend with hot reload
- **Port Configuration**: Frontend on port 5000, backend API routes on same port
- **Environment Variables**: Database URL and other configurations

### Production Build
- **Frontend**: Built with Vite to `dist/public` directory
- **Backend**: Bundled with ESBuild to `dist/index.js`
- **Static Assets**: Served from the backend in production
- **Database**: Drizzle migrations applied via `npm run db:push`

### Replit Configuration
- **Modules**: Node.js 20, web development, PostgreSQL 16
- **Auto-deployment**: Configured for autoscale deployment target
- **Build Process**: Automated build and start scripts
- **Port Mapping**: External port 80 mapped to internal port 5000

## Changelog

```
Changelog:
- June 14, 2025. Initial setup
- June 14, 2025. Updated authentic brand story: Italian heritage (founder's grandparents' dream) brought to life through South African manufacturing and local craftsmanship
- June 14, 2025. Complete navigation system implemented with all footer links functional
- June 14, 2025. Product consolidation: 3 distinct products with accurate photography integration
- January 8, 2025. Complete rebrand from "Concetto" to "LIGREMO" with domain ligremp.replit.app
- January 8, 2025. Updated all location references to Johannesburg (previously Cape Town)
- January 8, 2025. Updated domain references to ligremp.replit.app
- January 8, 2025. Removed all Italian heritage references - now focuses purely on South African craftsmanship and Johannesburg manufacturing
- January 8, 2025. Removed all remaining "Concetto" brand references and replaced with "LIGREMO" throughout the entire website
- July 22, 2025. Complete visual transformation to 70's retro aesthetic with mustard yellow, green, black, and white color scheme
- July 22, 2025. Added retro styling elements: retro-stripe patterns, retro-border (thick black borders), retro-shadow (layered box shadows), and 70's-inspired language throughout
- July 22, 2025. Updated Hero component with bold retro styling, rotated elements, and groovy language ("Far Out Collection", "Groovy Story")
- July 22, 2025. Redesigned Header with mustard yellow background, bold black borders, and retro navigation styling
- July 22, 2025. Updated Values component with 70's language and visual elements, including retro patterns and styling
- July 22, 2025. Enhanced Footer with retro background elements and updated brand messaging to emphasize "groovy 70's vibes"
- July 22, 2025. Implemented 5-category navigation structure: Business, Travel, Sport, Leisure, and Custom bags with category-based filtering
- July 22, 2025. Added comprehensive product catalog with 8 total products across all categories, featuring retro styling and groovy language
- July 22, 2025. Updated Products page with "Far Out Groovy Gear" header and enhanced filtering system supporting all new categories and colors
- July 22, 2025. Complete design transformation from 70's retro to modern product design theme inspired by professional product pitch websites
- July 22, 2025. Updated color scheme: Deep navy primary, light gray secondary, premium orange accent for modern professional aesthetic
- July 22, 2025. Redesigned Hero component with clean "Crafted Excellence" messaging and modern gradient text effects
- July 22, 2025. Updated Header with clean white background, rounded navigation elements, and professional styling
- July 22, 2025. Transformed Values component to modern card-based design with hover effects and professional messaging
- July 22, 2025. Redesigned Footer with product gradient background and organized navigation structure
- July 22, 2025. Replaced retro elements (retro-border, retro-shadow, retro-stripe) with modern design elements (product-shadow, modern-card, glass-effect)
- July 22, 2025. Updated to 2025 Canva-inspired color palette: Mocha Mousse (PANTONE Color of the Year) primary, warm earth tones, sunny yellow accents
- July 22, 2025. Implemented warm earth color palette with terracotta, clay, sage, coral, cream, and sand tones for modern sophisticated look
- July 22, 2025. Enhanced gradients to use warm earth combinations for backgrounds and accent elements throughout the site
- July 22, 2025. Updated fonts to modern Canva-style typography: DM Sans for headings, Plus Jakarta Sans for accents, matching clean design aesthetic
- July 22, 2025. Added mocha pink color variations (light, regular, dark) inspired by Canva design boards for softer, more sophisticated look
- July 22, 2025. Implemented soft pink and mocha pink gradients throughout Hero, Header, Products, and Values sections for cohesive warm aesthetic
- July 22, 2025. Updated Hero section with clean neutral background gradient (stone/amber tones) matching Canva design aesthetic with focused green bag product showcase
- July 22, 2025. Changed Hero messaging from "Crafted Excellence" to "Designed for you in Mind" per user request
- July 22, 2025. Updated color palette to warmer brown and amber tones matching modern lifestyle Canva design reference
- July 23, 2025. Removed orange colors, replaced with soft beige/taupe tones matching reference image, added olive green for quality indicators
- July 23, 2025. Complete redesign to match BigCommerce parallax bag template: carousel hero section, promotional banners, tabbed product sections
- July 25, 2025. Updated hero carousel with 3 new lifestyle product images (olive backpack, cream crossbody, brown backpack) and changed subtitle from "LEATHER FASHION BRANDS" to "For Every Journey"
- July 25, 2025. Changed promotional section heading from "What's special" to "Where are you going today?"
- July 25, 2025. Created 4 category sections under "Where are you going today?": Work (green backpack), Sports (white tennis bag), Exploring (brown backpack lifestyle), and Leisure (white backpack)
- July 25, 2025. Removed New Arrivals section from home page per user request
- July 26, 2025. Removed promotional discount banners (30% OFF, FREE SHIP, GIFTS) from home page, keeping only category sections
- July 26, 2025. Removed marketing banner "Save 20% on all premium leather bags this weekend! Free shipping on orders over R1500" from top of home page
- July 26, 2025. Changed hero carousel text colors ("LOOKBOOK", "For Every Journey", "NEW SEASON", "PREMIUM COLLECTION", "NEW ARRIVAL", "SHOP THE COLLECTION") to mustard yellow
- July 26, 2025. Updated hero carousel text to darker mustard yellow (mustard-dark) for better visibility
- July 26, 2025. Added forest/olive green theme touches: gradient overlay on carousel images, olive green "Shop Now" button, olive green carousel indicators, olive green section heading and decorative line, subtle olive green background gradient
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```