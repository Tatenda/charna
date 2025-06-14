# LIVING GREEN MOVEMENT E-commerce Platform

## Overview

This is a full-stack e-commerce platform for LIVING GREEN MOVEMENT, a South African leather goods company specializing in handcrafted bags. The application features a modern React frontend with a Node.js/Express backend, showcasing premium leather products with a focus on craftsmanship and sustainability.

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
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```