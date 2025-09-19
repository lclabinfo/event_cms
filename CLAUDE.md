# 🚀 Multi-Tenant Event Platform - Implementation Roadmap

## 🎯 Overview
단계별 구현 로드맵과 기술 스택 선택 가이드입니다.

## 📋 Table of Contents
1. [Technology Stack](#technology-stack)
2. [Phase 1: Foundation](#phase-1-foundation-week-1-2)
3. [Phase 2: Organization Management](#phase-2-organization-management-week-3-4)
4. [Phase 3: Payment Integration](#phase-3-payment-integration-week-5-6)
5. [Phase 4: Advanced Features](#phase-4-advanced-features-week-7-8)
6. [Deployment Strategy](#deployment-strategy)
7. [Migration Plan](#migration-plan)

---

## Technology Stack

### Core Technologies
```yaml
Frontend:
  Framework: Next.js 14.2+ (App Router)
  Styling: Tailwind CSS 3.4+
  Components: Shadcn/ui
  State Management: Zustand 4.5+
  Forms: React Hook Form 7.50+ + Zod 3.22+
  Tables: TanStack Table v8
  Charts: Recharts 2.10+
  i18n: next-intl 3.9+

Backend:
  Runtime: Node.js 20 LTS
  API: tRPC 10.45+ (type-safe APIs)
  Authentication: NextAuth.js 4.24+ (Auth.js)
  ORM: Prisma 5.9+
  Validation: Zod 3.22+
  Background Jobs: BullMQ 5.1+

Database:
  Primary: PostgreSQL 15+
  Cache: Redis 7+
  Session Store: Redis
  File Storage: S3-compatible (AWS S3 / Cloudflare R2)

Payments:
  Korea Primary: TossPayments
  Korea Alternative: PortOne (아임포트)
  International: Stripe (future)

DevOps:
  Hosting: Vercel / AWS / Azure
  CDN: Cloudflare
  Monitoring: Sentry + Posthog
  CI/CD: GitHub Actions
  Container: Docker (optional)
```

### Required NPM Packages
```json
{
  "dependencies": {
    // Core
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",

    // Authentication
    "next-auth": "^4.24.0",
    "@auth/prisma-adapter": "^1.3.0",
    "bcryptjs": "^2.4.3",

    // Database
    "@prisma/client": "^5.9.0",
    "prisma": "^5.9.0",

    // API
    "@trpc/server": "^10.45.0",
    "@trpc/client": "^10.45.0",
    "@trpc/react-query": "^10.45.0",
    "@trpc/next": "^10.45.0",
    "@tanstack/react-query": "^5.17.0",

    // State Management
    "zustand": "^4.5.0",

    // Forms & Validation
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",

    // UI Components
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^3.4.0",
    "tailwindcss-animate": "^1.0.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",

    // Tables & Charts
    "@tanstack/react-table": "^8.11.0",
    "recharts": "^2.10.0",

    // Internationalization
    "next-intl": "^3.9.0",

    // Utilities
    "date-fns": "^3.3.0",
    "uuid": "^9.0.1",
    "slugify": "^1.6.6",

    // Payments
    "@tosspayments/sdk": "^2.2.0",
    "iamport-rest-client-nodejs": "^0.9.0",

    // File Upload
    "uploadthing": "^6.3.0",

    // Email
    "@sendgrid/mail": "^8.1.0",
    "resend": "^3.1.0",

    // Background Jobs
    "bullmq": "^5.1.0",
    "ioredis": "^5.3.0",

    // QR Code
    "qrcode": "^1.5.3",

    // PDF Generation
    "@react-pdf/renderer": "^3.4.0"
  },

  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0",
    "prettier": "^3.2.0",
    "@types/bcryptjs": "^2.4.6"
  }
}
```

---

## Phase 1: Foundation (Week 1-2)

### 목표
- 핵심 데이터베이스 스키마 구현
- 인증/권한 시스템 구축
- 수퍼 어드민 기본 기능

### Tasks

#### 1.1 Database Setup (Day 1-2)
```bash
# Initialize Prisma
npx prisma init

# Create migrations
npx prisma migrate dev --name init
npx prisma migrate dev --name add-user-roles
npx prisma migrate dev --name add-organizations
npx prisma migrate dev --name add-subscriptions

# Seed initial data
npx prisma db seed
```

**Schema Priority:**
1. User, Account, Session (NextAuth)
2. Organization, OrganizationMember
3. Subscription, Invoice
4. UserRole enum

#### 1.2 Authentication System (Day 3-4)
```typescript
// /app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// /lib/auth.ts
export const authOptions = {
  providers: [
    CredentialsProvider({
      // Email/Password login
    }),
    GoogleProvider({
      // OAuth login
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to JWT
    },
    async session({ session, token }) {
      // Add role to session
    }
  }
}
```

#### 1.3 RBAC Implementation (Day 5-6)
```typescript
// /lib/rbac.ts
export const permissions = {
  SUPER_ADMIN: {
    organizations: ['create', 'read', 'update', 'delete'],
    subscriptions: ['create', 'read', 'update', 'delete'],
    users: ['create', 'read', 'update', 'delete'],
    platform: ['manage']
  },
  ORG_OWNER: {
    organization: ['read', 'update'],
    events: ['create', 'read', 'update', 'delete'],
    registrations: ['read', 'approve', 'export'],
    team: ['invite', 'manage']
  },
  ORG_ADMIN: {
    events: ['create', 'read', 'update'],
    registrations: ['read', 'approve'],
    team: ['view']
  },
  ORG_STAFF: {
    events: ['read'],
    registrations: ['read']
  },
  PARTICIPANT: {
    own_registrations: ['read', 'create', 'cancel'],
    own_profile: ['read', 'update']
  }
}

// Middleware for route protection
export async function hasPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  // Check user role and permissions
}
```

#### 1.4 Super Admin Dashboard (Day 7-8)
```typescript
// /app/platform-admin/page.tsx
export default async function PlatformAdminDashboard() {
  // Verify super admin role
  const user = await requireRole('SUPER_ADMIN')

  // Fetch platform metrics
  const metrics = await getPlatformMetrics()

  return (
    <PlatformLayout>
      <MetricsGrid metrics={metrics} />
      <RevenueChart />
      <OrganizationList />
    </PlatformLayout>
  )
}
```

#### 1.5 Organization CRUD (Day 9-10)
```typescript
// /server/api/routers/organization.ts
export const organizationRouter = router({
  create: protectedProcedure
    .input(createOrgSchema)
    .mutation(async ({ input, ctx }) => {
      // Create organization
      // Create subscription
      // Invite owner
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      // Return paginated organizations
    }),

  update: protectedProcedure
    .input(updateOrgSchema)
    .mutation(async ({ input, ctx }) => {
      // Update organization
    })
})
```

### Deliverables
- [ ] Database schema deployed
- [ ] Authentication working
- [ ] Super admin can login
- [ ] Organizations CRUD operational
- [ ] Basic subscription management

---

## Phase 2: Organization Management (Week 3-4)

### 목표
- 기관 관리자 페이지 구현
- Multi-tenancy 라우팅
- 행사 관리 기능

### Tasks

#### 2.1 Multi-tenancy Setup (Day 1-2)
```typescript
// /middleware.ts
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  const subdomain = getSubdomain(hostname)

  if (subdomain && subdomain !== 'www') {
    // Organization route
    const org = await getOrgBySlug(subdomain)
    if (org) {
      request.headers.set('x-org-id', org.id)
      request.headers.set('x-org-slug', org.slug)
    }
  }

  return NextResponse.next()
}

// /lib/org-context.tsx
export const OrgProvider = ({ children }) => {
  const org = useOrganization()
  return (
    <OrgContext.Provider value={org}>
      {children}
    </OrgContext.Provider>
  )
}
```

#### 2.2 Organization Admin Layout (Day 3-4)
```typescript
// /app/[org]/admin/layout.tsx
export default async function OrgAdminLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { org: string }
}) {
  const org = await getOrgBySlug(params.org)
  const user = await requireOrgRole(org.id, ['ORG_OWNER', 'ORG_ADMIN'])

  return (
    <OrgProvider organization={org}>
      <AdminSidebar />
      <main>{children}</main>
    </OrgProvider>
  )
}
```

#### 2.3 Event Management (Day 5-8)
```typescript
// Event CRUD
// /server/api/routers/event.ts
export const eventRouter = router({
  create: orgProcedure
    .input(createEventSchema)
    .mutation(async ({ input, ctx }) => {
      return await prisma.event.create({
        data: {
          ...input,
          orgId: ctx.org.id,
          createdBy: ctx.session.user.id
        }
      })
    }),

  list: orgProcedure
    .query(async ({ ctx }) => {
      return await prisma.event.findMany({
        where: { orgId: ctx.org.id },
        include: { _count: { select: { registrations: true } } }
      })
    })
})

// Event Builder Component
// /components/admin/events/EventBuilder.tsx
export function EventBuilder() {
  const [step, setStep] = useState(0)

  const steps = [
    <BasicInfoStep />,
    <ScheduleStep />,
    <PricingStep />,
    <RegistrationFormStep />,
    <EmailSettingsStep />,
    <ReviewStep />
  ]

  return (
    <StepWizard
      steps={steps}
      currentStep={step}
      onStepChange={setStep}
    />
  )
}
```

#### 2.4 Registration Management (Day 9-10)
```typescript
// /app/[org]/admin/registrations/page.tsx
export default function RegistrationsPage() {
  const { data: registrations } = trpc.registration.list.useQuery()

  return (
    <DataTable
      columns={registrationColumns}
      data={registrations}
      filters={registrationFilters}
      bulkActions={[
        'approve',
        'export',
        'send_email'
      ]}
    />
  )
}
```

#### 2.5 Basic Analytics (Day 11-12)
```typescript
// /components/admin/analytics/EventAnalytics.tsx
export function EventAnalytics({ eventId }: { eventId: string }) {
  const { data: analytics } = trpc.analytics.getEventStats.useQuery({ eventId })

  return (
    <div className="grid gap-4">
      <MetricsRow metrics={analytics.summary} />
      <RegistrationChart data={analytics.registrations} />
      <RevenueBreakdown data={analytics.revenue} />
    </div>
  )
}
```

### Deliverables
- [ ] Multi-tenancy routing working
- [ ] Organization admin can login
- [ ] Events CRUD complete
- [ ] Registration management functional
- [ ] Basic analytics displayed

---

## Phase 3: Payment Integration (Week 5-6)

### 목표
- B2B 구독 결제 시스템
- B2C 행사 결제 통합
- 결제 웹훅 처리

### Tasks

#### 3.1 Payment Gateway Setup (Day 1-2)
```typescript
// /lib/payment/toss.ts
import { TossPayments } from '@tosspayments/sdk'

export const tossPayments = new TossPayments({
  clientKey: process.env.TOSS_CLIENT_KEY,
  secretKey: process.env.TOSS_SECRET_KEY
})

// /lib/payment/portone.ts
import Iamport from 'iamport-rest-client-nodejs'

export const portone = new Iamport({
  imp_key: process.env.PORTONE_KEY,
  imp_secret: process.env.PORTONE_SECRET
})
```

#### 3.2 B2B Subscription Payments (Day 3-5)
```typescript
// /server/api/routers/subscription.ts
export const subscriptionRouter = router({
  createCheckout: protectedProcedure
    .input(z.object({
      plan: z.enum(['basic', 'pro', 'enterprise']),
      billingCycle: z.enum(['monthly', 'yearly'])
    }))
    .mutation(async ({ input, ctx }) => {
      // Create TossPayments billing
      const billing = await tossPayments.billing.create({
        customerKey: ctx.org.id,
        productName: `${input.plan} Plan`,
        amount: getPlanPrice(input.plan, input.billingCycle)
      })

      return { checkoutUrl: billing.checkoutUrl }
    }),

  handleWebhook: publicProcedure
    .mutation(async ({ ctx, input }) => {
      // Verify webhook signature
      // Update subscription status
      // Generate invoice
    })
})
```

#### 3.3 B2C Event Payments (Day 6-8)
```typescript
// /app/[org]/[event]/register/payment/page.tsx
export default function PaymentStep() {
  const handlePayment = async () => {
    const payment = await tossPayments.payment.create({
      amount: registration.totalAmount,
      orderId: registration.id,
      orderName: `${event.title} Registration`,
      customerName: participant.name,
      successUrl: `${window.location.origin}/payment/success`,
      failUrl: `${window.location.origin}/payment/fail`
    })

    // Redirect to payment page
    window.location.href = payment.checkout.url
  }

  return (
    <PaymentForm
      methods={['card', 'bank_transfer', 'virtual_account']}
      onSubmit={handlePayment}
    />
  )
}
```

#### 3.4 Payment Webhook Handler (Day 9-10)
```typescript
// /app/api/webhooks/payment/route.ts
export async function POST(request: Request) {
  const signature = request.headers.get('x-toss-signature')
  const body = await request.text()

  // Verify signature
  if (!verifyWebhookSignature(body, signature)) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = JSON.parse(body)

  switch(event.type) {
    case 'PAYMENT.COMPLETED':
      await handlePaymentCompleted(event.data)
      break
    case 'PAYMENT.FAILED':
      await handlePaymentFailed(event.data)
      break
    case 'REFUND.COMPLETED':
      await handleRefundCompleted(event.data)
      break
  }

  return new Response('OK', { status: 200 })
}
```

#### 3.5 Refund Processing (Day 11-12)
```typescript
// /server/api/routers/payment.ts
export const paymentRouter = router({
  processRefund: orgProcedure
    .input(refundSchema)
    .mutation(async ({ input, ctx }) => {
      const payment = await prisma.payment.findUnique({
        where: { id: input.paymentId }
      })

      // Process refund with payment provider
      const refund = await tossPayments.refund.create({
        paymentKey: payment.providerId,
        amount: input.amount,
        reason: input.reason
      })

      // Update database
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'refunded',
          refundAmount: input.amount,
          refundReason: input.reason,
          refundedAt: new Date()
        }
      })

      // Send notification
      await sendRefundEmail(payment.registration)

      return refund
    })
})
```

### Deliverables
- [ ] TossPayments integration complete
- [ ] Subscription billing working
- [ ] Event payment flow complete
- [ ] Webhook handling implemented
- [ ] Refund processing functional

---

## Phase 4: Advanced Features (Week 7-8)

### 목표
- 커스텀 폼 빌더
- 이메일 자동화
- 고급 분석 기능
- 커스텀 도메인 지원

### Tasks

#### 4.1 Form Builder (Day 1-3)
```typescript
// /components/admin/forms/FormBuilder.tsx
export function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([])

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: uuid(),
      type,
      label: '',
      required: false,
      options: []
    }
    setFields([...fields, newField])
  }

  return (
    <div className="flex gap-4">
      <FieldPalette onAddField={addField} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="form-fields">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <FieldEditor
                      field={field}
                      onUpdate={(updated) => updateField(field.id, updated)}
                      onDelete={() => deleteField(field.id)}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    />
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <FormPreview fields={fields} />
    </div>
  )
}
```

#### 4.2 Email Automation (Day 4-5)
```typescript
// /lib/email/automation.ts
export class EmailAutomation {
  async sendRegistrationConfirmation(registration: Registration) {
    const template = await getEmailTemplate(
      registration.event.orgId,
      'registration_confirmation'
    )

    const email = renderTemplate(template, {
      participant_name: registration.name,
      event_title: registration.event.title,
      registration_number: registration.registrationNumber,
      qr_code: await generateQRCode(registration.id)
    })

    await sendEmail({
      to: registration.email,
      subject: email.subject,
      html: email.html
    })
  }

  async scheduleReminders(event: Event) {
    // Schedule reminder emails
    await bullQueue.add('send-reminder',
      { eventId: event.id },
      {
        delay: event.startDate.getTime() - Date.now() - (24 * 60 * 60 * 1000) // 1 day before
      }
    )
  }
}
```

#### 4.3 Advanced Analytics (Day 6-7)
```typescript
// /components/admin/analytics/AdvancedAnalytics.tsx
export function AdvancedAnalytics() {
  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value="funnel">Registration Funnel</TabsTrigger>
        <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
        <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
        <TabsTrigger value="engagement">Engagement Metrics</TabsTrigger>
      </TabsList>

      <TabsContent value="funnel">
        <FunnelChart
          stages={[
            'Page View',
            'Registration Started',
            'Form Completed',
            'Payment Initiated',
            'Payment Completed'
          ]}
        />
      </TabsContent>

      <TabsContent value="cohort">
        <CohortAnalysis
          metrics={['retention', 'lifetime_value', 'repeat_rate']}
        />
      </TabsContent>
    </Tabs>
  )
}
```

#### 4.4 Custom Domain Support (Day 8-9)
```typescript
// /lib/custom-domain.ts
export async function verifyCustomDomain(domain: string, orgId: string) {
  // Check DNS records
  const records = await checkDNSRecords(domain)

  if (records.cname?.value === `${orgId}.events.platform.com`) {
    // Update organization
    await prisma.organization.update({
      where: { id: orgId },
      data: {
        customDomain: domain,
        domainVerified: true
      }
    })

    // Request SSL certificate
    await provisionSSL(domain)

    return { success: true }
  }

  return {
    success: false,
    instructions: getDNSInstructions(domain, orgId)
  }
}
```

#### 4.5 Testing & QA (Day 10-12)
```typescript
// /tests/e2e/registration.spec.ts
describe('Event Registration Flow', () => {
  it('should complete registration successfully', async () => {
    // Navigate to event page
    await page.goto('/seoul-ubf/wmc-2026')

    // Click register button
    await page.click('[data-testid="register-button"]')

    // Fill registration form
    await page.fill('[name="name"]', 'John Doe')
    await page.fill('[name="email"]', 'john@example.com')

    // Select programs
    await page.click('[data-program="main-conference"]')

    // Complete payment
    await page.click('[data-testid="pay-button"]')

    // Verify confirmation
    await expect(page).toHaveURL('/registration/success')
    await expect(page).toContainText('Registration Complete')
  })
})
```

### Deliverables
- [ ] Form builder operational
- [ ] Email automation working
- [ ] Advanced analytics available
- [ ] Custom domain support ready
- [ ] E2E tests passing

---

## Deployment Strategy

### Infrastructure Setup
```yaml
Production:
  Platform: Vercel / AWS ECS / Azure App Service
  Database:
    - PostgreSQL: AWS RDS / Azure Database / Supabase
    - Redis: AWS ElastiCache / Azure Cache / Upstash
  Storage: AWS S3 / Cloudflare R2
  CDN: Cloudflare

Staging:
  Platform: Vercel Preview / AWS Dev Environment
  Database: Separate staging instances

Development:
  Local: Docker Compose setup
  Database: Local PostgreSQL + Redis
```

### Environment Configuration
```bash
# .env.production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
NEXTAUTH_URL=https://events.platform.com
NEXTAUTH_SECRET=...

# Payment
TOSS_CLIENT_KEY=...
TOSS_SECRET_KEY=...
PORTONE_KEY=...
PORTONE_SECRET=...

# Email
SENDGRID_API_KEY=...
FROM_EMAIL=noreply@platform.com

# Storage
S3_BUCKET=...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...

# Monitoring
SENTRY_DSN=...
POSTHOG_KEY=...
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx prisma migrate deploy
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          prod: true
```

---

## Migration Plan

### From Existing System
```typescript
// /scripts/migration/migrate-data.ts
async function migrateData() {
  // 1. Migrate Organizations
  const oldOrgs = await fetchOldOrganizations()
  for (const org of oldOrgs) {
    await prisma.organization.create({
      data: mapOrganization(org)
    })
  }

  // 2. Migrate Users
  const oldUsers = await fetchOldUsers()
  for (const user of oldUsers) {
    await prisma.user.create({
      data: mapUser(user)
    })
  }

  // 3. Migrate Events
  const oldEvents = await fetchOldEvents()
  for (const event of oldEvents) {
    await prisma.event.create({
      data: mapEvent(event)
    })
  }

  // 4. Migrate Registrations
  const oldRegistrations = await fetchOldRegistrations()
  for (const reg of oldRegistrations) {
    await prisma.registration.create({
      data: mapRegistration(reg)
    })
  }
}
```

### Rollback Strategy
```sql
-- Backup before migration
pg_dump production_db > backup_$(date +%Y%m%d).sql

-- Rollback script
-- 1. Restore from backup
psql production_db < backup_20240315.sql

-- 2. Or use Prisma migration rollback
npx prisma migrate resolve --rolled-back
```

---

## Performance Optimization

### Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_events_org_status ON events(org_id, status);
CREATE INDEX idx_registrations_event_status ON registrations(event_id, status);
CREATE INDEX idx_payments_status ON payments(status);

-- Materialized views for analytics
CREATE MATERIALIZED VIEW org_metrics AS
SELECT
  org_id,
  COUNT(DISTINCT event_id) as total_events,
  COUNT(DISTINCT registration_id) as total_registrations,
  SUM(amount) as total_revenue
FROM registrations r
JOIN payments p ON p.registration_id = r.id
GROUP BY org_id;

-- Refresh periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY org_metrics;
```

### Caching Strategy
```typescript
// /lib/cache.ts
export class CacheManager {
  async get<T>(key: string): Promise<T | null> {
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached) : null
  }

  async set<T>(key: string, value: T, ttl = 3600): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value))
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern)
    if (keys.length) {
      await redis.del(...keys)
    }
  }
}

// Usage
const events = await cache.get(`org:${orgId}:events`) ||
  await prisma.event.findMany({ where: { orgId } })
```

### Image Optimization
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['cdn.platform.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
}

// Component usage
import Image from 'next/image'

<Image
  src={event.banner}
  alt={event.title}
  width={1200}
  height={600}
  placeholder="blur"
  blurDataURL={event.bannerBlur}
  priority={isAboveFold}
/>
```

---

## Monitoring & Maintenance

### Key Metrics to Track
```typescript
// /lib/monitoring.ts
export const metrics = {
  business: [
    'monthly_recurring_revenue',
    'customer_acquisition_cost',
    'lifetime_value',
    'churn_rate'
  ],

  performance: [
    'page_load_time',
    'api_response_time',
    'error_rate',
    'uptime'
  ],

  usage: [
    'daily_active_users',
    'events_created',
    'registrations_completed',
    'payments_processed'
  ]
}

// Track custom events
posthog.capture('registration_completed', {
  event_id: event.id,
  amount: registration.totalAmount,
  payment_method: payment.method
})
```

### Health Checks
```typescript
// /app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    payment: await checkPaymentGateway(),
    email: await checkEmailService()
  }

  const allHealthy = Object.values(checks).every(c => c.status === 'healthy')

  return NextResponse.json(
    { status: allHealthy ? 'healthy' : 'unhealthy', checks },
    { status: allHealthy ? 200 : 503 }
  )
}
```

---

## 🎯 Success Criteria

### Phase 1 Success
- [ ] Super admin can create organizations
- [ ] Organizations can subscribe to plans
- [ ] Basic billing works

### Phase 2 Success
- [ ] Organizations can create events
- [ ] Participants can register
- [ ] Multi-tenancy routing works

### Phase 3 Success
- [ ] Payments process successfully
- [ ] Refunds work correctly
- [ ] Webhooks handle edge cases

### Phase 4 Success
- [ ] Custom forms save development time
- [ ] Email automation reduces manual work
- [ ] Analytics provide valuable insights

### Overall Success
- [ ] System handles 1000+ concurrent users
- [ ] Page load time < 2 seconds
- [ ] 99.9% uptime achieved
- [ ] Customer satisfaction > 4.5/5