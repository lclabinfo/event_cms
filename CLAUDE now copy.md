# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UBF Event Registration System - A multi-language, multi-tenant church event registration platform built with Next.js 15, designed for World Mission Conference, retreats, and tour programs.

## Common Development Commands

```bash
# Development
npm run dev                    # Start dev server at http://localhost:3000
npm run build                 # Build production bundle
npm run start                 # Run production server
npm run lint                  # Run ESLint checks
npm run type-check           # TypeScript type checking

# Database Operations
npx prisma generate          # Generate Prisma Client after schema changes
npx prisma migrate dev       # Create and apply migrations
npx prisma migrate deploy    # Apply migrations in production
npm run db:migrate           # Alias for prisma migrate dev
npm run db:seed              # Seed database with test data
npm run db:studio            # Open Prisma Studio GUI

# Testing Specific Components
npm run dev                  # Then visit /demo for component gallery
```

## High-Level Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js with credentials and OAuth providers
- **i18n**: next-intl (Korean, English, Spanish)
- **UI**: Tailwind CSS + shadcn/ui components
- **Payments**: TossPayments (Korea), Stripe (International)

### Multi-Tenant Architecture
The system implements row-level security (RLS) with tenant isolation:
- Every major entity has an `orgId` field linking to Organization
- Organizations represent different church chapters/tenants
- Prisma middleware automatically filters queries by tenant context
- Authentication includes tenant claims in JWT tokens

### Key Database Relationships
```
Organization (tenant) ← Event ← Program ← Participant
                     ← Registration ← Payment
                     ← User (staff/admin)
```

### Routing Structure
- `/[locale]/*` - All public routes are internationalized
- `/[locale]/(auth)/*` - Authentication pages (login, register)
- `/[locale]/events/*` - Event listings and details
- `/dashboard/*` - Protected user dashboard
- `/admin/*` - Admin-only management interface
- `/demo/*` - Component showcase (development only)

## Critical Implementation Patterns

### Internationalization Pattern
All user-facing content uses next-intl with locale prefixes:
```tsx
// Always import translations in server components
import {getTranslations} from 'next-intl/server';
const t = await getTranslations('namespace');

// Client components use hooks
import {useTranslations} from 'next-intl';
const t = useTranslations('namespace');
```

### Authentication Middleware
The middleware.ts file orchestrates both auth and i18n:
1. Checks locale requirements first
2. Applies authentication for protected routes
3. Role-based access for admin paths

### Database Schema Conventions
- Multi-language fields: `nameKo`, `nameEn`, `nameEs`
- Timestamps: `createdAt`, `updatedAt`
- Status fields use string enums
- Money uses Decimal type with precision (10,2)
- JSON fields for flexible metadata storage

### Component Organization
```
components/
  ui/           # shadcn/ui primitive components
  auth/         # Authentication-related components
  events/       # Event-specific components
  layout/       # Layout components (nav, footer)
```

## Environment Configuration

Key environment variables needed:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Base URL for authentication
- `NEXTAUTH_SECRET` - Secret for JWT signing
- Payment provider keys (TOSS_*, STRIPE_*)
- OAuth provider credentials (optional)

## Working with Payments

The system supports dual payment providers:
- **TossPayments**: Primary for Korean market (KRW)
- **Stripe**: International payments (USD, EUR)

Payment flow: Registration → Payment Service → Gateway Router → Provider → Webhook → Database

## Database Migration Workflow

When modifying the database schema:
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name descriptive-name`
3. Update seed data if needed in `prisma/seed.ts`
4. Regenerate client with `npx prisma generate`

## Testing Approach

Currently no automated tests are configured. For manual testing:
- Use seeded test accounts (admin@ubf.org, staff@ubf.org, user@example.com)
- Component testing via `/demo` routes
- API testing through Prisma Studio

## Session and State Management

- Authentication state via NextAuth session
- Form state with react-hook-form + zod validation
- Server state with React Server Components
- Client state minimal, prefer server-side

## Development Workflow Guidelines

1. Feature branches should follow: `feature/description`
2. All database changes require migrations
3. UI components should support all three languages
4. Use existing shadcn/ui components before creating custom ones
5. Payment integrations must handle webhook retries
6. Keep client components minimal for performance

## Current Status & Next Steps

Completed:
- Multi-tenant database structure
- Authentication system with roles
- Internationalization setup
- Basic UI component library

In Progress:
- Payment integration (TossPayments priority)
- Event listing and detail pages
- Multi-step registration form
- Admin dashboard for event management