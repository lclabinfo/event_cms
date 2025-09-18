# UBF Event Registration System

Multi-language church event registration platform for World Mission Conference, retreats, and tour programs.

## 🚀 Quick Start

### Prerequisites
- Node.js 20 LTS
- PostgreSQL (Azure PostgreSQL recommended)
- Git

### Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your database connection string and other configurations.

3. **Setup database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations (when you have Azure PostgreSQL ready)
   npx prisma migrate dev
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ubf-event/
├── app/                    # Next.js App Router
├── components/            # React components
│   └── ui/               # Reusable UI components
├── lib/                   # Utility functions
├── messages/              # i18n translation files
├── prisma/                # Database schema
├── architecture/          # System design documentation
└── public/               # Static assets
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Azure)
- **Authentication**: NextAuth.js
- **Internationalization**: next-intl (ko/en/es)
- **Payment**: TossPayments (Korea), Stripe (International)
- **UI Components**: Shadcn/ui, Radix UI

## 📋 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Check TypeScript types
```

## 🔧 Development Workflow

See [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md) for detailed sprint planning and task allocation.

## 👥 Team Structure

- **Developer 1**: Backend/Fullstack (API, Database, Payments)
- **Developer 2**: Frontend/Design (UI/UX, Components, i18n)

See [TEAM_COLLABORATION_GUIDE.md](TEAM_COLLABORATION_GUIDE.md) for collaboration guidelines.

## 📚 Documentation

- [System Architecture](architecture/SYSTEM_ARCHITECTURE.md)
- [Multi-Tenant Design](architecture/MULTI_TENANT_DESIGN.md)
- [Component Development Guide](COMPONENT_DEVELOPMENT_GUIDE.md)
- [Development Workflow](DEVELOPMENT_WORKFLOW.md)

## 🚦 Current Status

✅ Initial setup completed:
- Next.js with TypeScript
- Prisma ORM configured
- Basic UI components
- Internationalization setup
- Git repository initialized

⏳ Next steps:
- Connect to Azure PostgreSQL
- Implement authentication flow
- Build event listing page
- Create registration form

## 📄 License

Private - All rights reserved