# Korea UBF WMC Registration System - Claude Development Guide

## 🎯 Project Overview

**Multi-language church event registration system** for World Mission Conference, retreats, and tour programs.
- **Stage**: System design & implementation phase
- **Team**: 2 developers (backend/fullstack + frontend/design components)
- **Priority**: Korean payment integration (TossPayments/PortOne)

## 🏗️ Core Architecture

### Tech Stack
```yaml
Frontend:
  Framework: Next.js 14 (App Router)
  Styling: Tailwind CSS + Shadcn/ui
  State: Zustand
  Forms: React Hook Form + Zod
  i18n: next-intl

Backend:
  Runtime: Node.js 20 LTS
  API: Next.js API Routes + tRPC
  Auth: NextAuth.js
  ORM: Prisma
  Validation: Zod

Database:
  Primary: PostgreSQL 15
  Cache: Redis
  Session: Redis Store

Payments:
  Korea: TossPayments or PortOne (아임포트)
  International: Stripe (future)
```

## 📁 Project Structure

```
church-event/
├── app/                    # Next.js App Router
│   ├── [locale]/          # i18n routing (ko/en/es)
│   ├── api/               # API routes & tRPC
│   ├── admin/             # Admin panel
│   └── demo/              # 🔬 Component testing playground (DO NOT DELETE)
│       ├── components/    # Component gallery
│       └── playground/    # Interactive testing
├── components/            # React components
│   ├── ui/               # Shadcn/ui base components
│   ├── forms/            # Form components
│   ├── events/           # Event-specific components
│   └── templates/        # Reusable event templates
├── lib/                   # Core libraries
│   ├── db/               # Database client & queries
│   ├── payment/          # Payment integration
│   └── i18n/             # Translations
├── prisma/                # Database schema
└── architecture/          # System design docs
```

## 🎨 Development Guidelines

### Component Development (Frontend Developer Focus)
- Use Shadcn/ui components as base building blocks
- Create reusable components in `/components/ui/`
- Event-specific components go in `/components/events/`
- Follow mobile-first responsive design
- Implement proper loading states and error boundaries

### API Development (Backend/Fullstack Focus)
- Use tRPC for type-safe APIs
- Implement proper validation with Zod schemas
- Handle errors consistently across endpoints
- Use Prisma for all database operations
- Implement proper transaction handling for payments

### Code Style
```typescript
// ✅ Good: Type-safe, validated, clear naming
const createRegistration = async (input: RegistrationInput) => {
  const validated = registrationSchema.parse(input);
  return await prisma.registration.create({ data: validated });
};

// ❌ Bad: No types, no validation, unclear
const register = async (data: any) => {
  return await db.registration.create({ data });
};
```

## 🔧 Key Features to Implement

### Phase 1: Core Registration System
- [ ] Multi-language support (ko/en/es)
- [ ] Event CRUD operations
- [ ] User registration & authentication
- [ ] Basic registration flow
- [ ] Email notifications

### Phase 2: Payment Integration
- [ ] TossPayments/PortOne integration
- [ ] Payment webhook handling
- [ ] Refund processing
- [ ] Payment status tracking
- [ ] Receipt generation

### Phase 3: Admin Dashboard
- [ ] Registration management
- [ ] Event analytics
- [ ] Export functionality
- [ ] Bulk email sending

## 💳 Payment Integration Notes

### Korean Payment Priority
```typescript
// TossPayments is preferred for Korean market
// Alternative: PortOne (아임포트) for wider PG support
interface PaymentProvider {
  provider: 'toss' | 'portone';
  methods: ['card', 'bank_transfer', 'virtual_account'];
  webhook: '/api/webhooks/payment';
}
```

## 🗄️ Database Recommendations

### Consider Azure Database for PostgreSQL instead of VM
```yaml
Benefits:
  - Managed backups
  - Automatic failover
  - Easy scaling
  - Built-in monitoring
  - No VM maintenance

Cost-effective options:
  - Basic tier for development
  - Standard tier for production
  - Flexible Server for best price/performance
```

## 🚫 What NOT to Do

- **Don't** implement features not in current phase
- **Don't** create components without proper TypeScript types
- **Don't** access database directly without Prisma
- **Don't** handle payments without proper error handling
- **Don't** store sensitive data (card numbers) in database
- **Don't** skip validation on user inputs
- **Don't** create API endpoints without tRPC
- **Don't** delete `/app/demo/` directory - it's for component testing and validation

## 🤝 Team Collaboration

### Frontend Developer
- Focus on `/components/` directory
- Work with Figma designs if available
- Create Storybook stories for components
- Ensure responsive design
- Implement accessibility (a11y)

### Backend/Fullstack Developer
- Focus on `/app/api/` and `/lib/` directories
- Handle database schema and migrations
- Implement business logic
- Manage payment integration
- Handle security and authentication

## 📝 Architecture References

Detailed documentation available in `/architecture/`:


## 🔄 Development Workflow

1. **Design Review**: Check `/architecture/` docs before implementing
2. **Type-First**: Define TypeScript types/interfaces first
3. **Schema-First**: Create Zod schemas for validation
4. **Test Locally**: Test with Korean payment sandbox
5. **PR Review**: Both developers review each other's code


## 💡 Quick Commands

```bash
# Development
npm run dev          # Start development server
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed test data

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests

# Type checking
npm run type-check   # Check TypeScript types
npm run lint         # Run ESLint


## 🏅 Prisma Migration Golden Rules & Guide

### 🔑 3 Golden Rules

1. **After editing `schema.prisma`**  
   ```bash
   npx prisma migrate dev --name <change>
   ```
   - Applies to local DB and regenerates Prisma Client

2. **Commit migrations in your PR**  
   - Always commit `prisma/migrations/**`
   - Teammates pull and run:
     ```bash
     npx prisma migrate dev
     ```
     - to apply migrations locally

3. **On staging/production**  
   - Only run:
     ```bash
     npx prisma migrate deploy
     ```
   - (❌ Never run `db push` in production)

---

### 👥 Teammate Workflow

1. `git pull`
2. Ensure local `.env` has correct `DATABASE_URL`
3. Run:
   ```bash
   npx prisma migrate dev
   ```

- If drift/first setup and local data can be dropped:
  ```bash
  npx prisma migrate reset
  npx prisma db seed   # (if seed configured)
  ```

---

### 🛡️ Safe Change Patterns

- **Add required field**:  
  1) Add as optional → 2) Backfill data → 3) Make required (2 steps)
- **Rename**:  
  - Prefer Prisma `@map`/`@@map` (avoid drop/create)
- **Type change**:  
  1) Add new column → 2) Backfill → 3) Swap/remove
- **Enum**:  
  1) Add new value → 2) Migrate data → 3) Remove/rename old

---

### ⚙️ CI/CD & Operations

- Always backup DB before deploy
- Deploy step runs:
  ```bash
  npx prisma migrate deploy
  ```
- Check pending/applied migrations:
  ```bash
  npx prisma migrate status
  ```

## 🔗 Useful Resources

- [TossPayments Docs](https://docs.tosspayments.com)
- [PortOne (아임포트) Docs](https://docs.portone.io)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma with Next.js](https://www.prisma.io/nextjs)