--
-- PostgreSQL database dump
--

\restrict JDLr5isgSo1S22krB3JorIYJtQljpKIzipVj8RH2rXrn8DlwpW3MRS56RnrO7zp

-- Dumped from database version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: peter
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO peter;

--
-- Name: DomainStatus; Type: TYPE; Schema: public; Owner: peter
--

CREATE TYPE public."DomainStatus" AS ENUM (
    'PENDING',
    'VERIFYING',
    'VERIFIED',
    'FAILED',
    'EXPIRED',
    'SUSPENDED'
);


ALTER TYPE public."DomainStatus" OWNER TO peter;

--
-- Name: DomainType; Type: TYPE; Schema: public; Owner: peter
--

CREATE TYPE public."DomainType" AS ENUM (
    'ORGANIZATION',
    'EVENT'
);


ALTER TYPE public."DomainType" OWNER TO peter;

--
-- Name: SubscriptionPlan; Type: TYPE; Schema: public; Owner: peter
--

CREATE TYPE public."SubscriptionPlan" AS ENUM (
    'FREE',
    'BASIC',
    'PRO',
    'ENTERPRISE'
);


ALTER TYPE public."SubscriptionPlan" OWNER TO peter;

--
-- Name: SubscriptionStatus; Type: TYPE; Schema: public; Owner: peter
--

CREATE TYPE public."SubscriptionStatus" AS ENUM (
    'TRIAL',
    'ACTIVE',
    'PAST_DUE',
    'CANCELLED',
    'SUSPENDED'
);


ALTER TYPE public."SubscriptionStatus" OWNER TO peter;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: peter
--

CREATE TYPE public."UserRole" AS ENUM (
    'SUPER_ADMIN',
    'ORG_OWNER',
    'ORG_ADMIN',
    'ORG_STAFF',
    'PARTICIPANT'
);


ALTER TYPE public."UserRole" OWNER TO peter;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO peter;

--
-- Name: ActivityLog; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."ActivityLog" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "orgId" text,
    action text NOT NULL,
    "entityType" text NOT NULL,
    "entityId" text,
    "oldValues" jsonb,
    "newValues" jsonb,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ActivityLog" OWNER TO peter;

--
-- Name: Analytics; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."Analytics" (
    id text NOT NULL,
    "orgId" text NOT NULL,
    "eventId" text,
    date date NOT NULL,
    "pageViews" integer DEFAULT 0 NOT NULL,
    "uniqueVisitors" integer DEFAULT 0 NOT NULL,
    "registrationStarts" integer DEFAULT 0 NOT NULL,
    "registrationCompletes" integer DEFAULT 0 NOT NULL,
    revenue numeric(10,2) DEFAULT 0 NOT NULL,
    "hourlyData" jsonb,
    "sourceData" jsonb,
    "deviceData" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Analytics" OWNER TO peter;

--
-- Name: CustomDomain; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."CustomDomain" (
    id text NOT NULL,
    "orgId" text NOT NULL,
    "eventId" text,
    domain text NOT NULL,
    type public."DomainType" NOT NULL,
    "isPrimary" boolean DEFAULT false NOT NULL,
    status public."DomainStatus" DEFAULT 'PENDING'::public."DomainStatus" NOT NULL,
    "verificationToken" text,
    "verifiedAt" timestamp(3) without time zone,
    "sslEnabled" boolean DEFAULT false NOT NULL,
    "sslStatus" text,
    "certificateId" text,
    "sslIssuedAt" timestamp(3) without time zone,
    "sslExpiresAt" timestamp(3) without time zone,
    "redirectTo" text,
    "redirectType" integer DEFAULT 301 NOT NULL,
    "forceHttps" boolean DEFAULT true NOT NULL,
    "dnsRecords" jsonb,
    "lastDnsCheck" timestamp(3) without time zone,
    "customBranding" jsonb,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CustomDomain" OWNER TO peter;

--
-- Name: CustomForm; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."CustomForm" (
    id text NOT NULL,
    "orgId" text NOT NULL,
    name text NOT NULL,
    description text,
    fields jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CustomForm" OWNER TO peter;

--
-- Name: DiscountCode; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."DiscountCode" (
    id text NOT NULL,
    "eventId" text NOT NULL,
    code text NOT NULL,
    description text,
    "discountType" text NOT NULL,
    "discountValue" numeric(10,2) NOT NULL,
    "maxUses" integer,
    "currentUses" integer DEFAULT 0 NOT NULL,
    "maxUsesPerUser" integer DEFAULT 1 NOT NULL,
    "validFrom" timestamp(3) without time zone NOT NULL,
    "validUntil" timestamp(3) without time zone NOT NULL,
    conditions jsonb,
    "minAmount" numeric(10,2),
    "isActive" boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."DiscountCode" OWNER TO peter;

--
-- Name: EmailTemplate; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."EmailTemplate" (
    id text NOT NULL,
    "orgId" text NOT NULL,
    name text NOT NULL,
    subject text NOT NULL,
    "bodyHtml" text NOT NULL,
    "bodyText" text,
    type text NOT NULL,
    variables jsonb DEFAULT '[]'::jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EmailTemplate" OWNER TO peter;

--
-- Name: Event; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."Event" (
    id text NOT NULL,
    "orgId" text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    "titleEn" text,
    description text,
    "descriptionEn" text,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "registrationStart" timestamp(3) without time zone NOT NULL,
    "registrationEnd" timestamp(3) without time zone NOT NULL,
    "earlyBirdEnd" timestamp(3) without time zone,
    venue text,
    "venueAddress" jsonb,
    "onlineUrl" text,
    "maxParticipants" integer,
    "basePrice" numeric(10,2) NOT NULL,
    "earlyBirdPrice" numeric(10,2),
    currency text DEFAULT 'KRW'::text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    visibility text DEFAULT 'public'::text NOT NULL,
    "requiresApproval" boolean DEFAULT false NOT NULL,
    "customFormId" text,
    "emailTemplateIds" jsonb DEFAULT '[]'::jsonb NOT NULL,
    tags text[],
    "customBranding" jsonb,
    "totalRegistrations" integer DEFAULT 0 NOT NULL,
    "totalRevenue" numeric(10,2) DEFAULT 0 NOT NULL,
    "createdBy" text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "defaultLocale" text DEFAULT 'ko'::text NOT NULL,
    "isMultiLanguage" boolean DEFAULT false NOT NULL,
    "supportedLocales" text[] DEFAULT ARRAY['ko'::text]
);


ALTER TABLE public."Event" OWNER TO peter;

--
-- Name: EventMenu; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."EventMenu" (
    id text NOT NULL,
    "eventId" text NOT NULL,
    title jsonb NOT NULL,
    url text,
    "pageId" text,
    "order" integer DEFAULT 0 NOT NULL,
    "parentId" text,
    "isVisible" boolean DEFAULT true NOT NULL,
    type text DEFAULT 'link'::text NOT NULL,
    icon text,
    target text DEFAULT '_self'::text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EventMenu" OWNER TO peter;

--
-- Name: EventPage; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."EventPage" (
    id text NOT NULL,
    "eventId" text NOT NULL,
    slug text NOT NULL,
    title jsonb NOT NULL,
    content jsonb NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isVisible" boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EventPage" OWNER TO peter;

--
-- Name: FileUpload; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."FileUpload" (
    id text NOT NULL,
    "orgId" text NOT NULL,
    "fileName" text NOT NULL,
    "originalName" text NOT NULL,
    "fileType" text NOT NULL,
    "mimeType" text NOT NULL,
    "fileSize" bigint NOT NULL,
    "storageProvider" text DEFAULT 'local'::text NOT NULL,
    "filePath" text NOT NULL,
    "fileUrl" text NOT NULL,
    "thumbnailUrl" text,
    "entityType" text,
    "entityId" text,
    "eventId" text,
    "registrationId" text,
    "uploadedBy" text NOT NULL,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isPublic" boolean DEFAULT false NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "virusScanStatus" text,
    "virusScanAt" timestamp(3) without time zone,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FileUpload" OWNER TO peter;

--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    "subscriptionId" text NOT NULL,
    "invoiceNumber" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    tax numeric(10,2) NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    currency text DEFAULT 'KRW'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    "paidAt" timestamp(3) without time zone,
    "taxInvoiceNumber" text,
    "taxInvoiceIssuedAt" timestamp(3) without time zone,
    "paymentMethod" text,
    "paymentId" text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Invoice" OWNER TO peter;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    "relatedType" text,
    "relatedId" text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notification" OWNER TO peter;

--
-- Name: Organization; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."Organization" (
    id text NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    "nameEn" text,
    description text,
    "ownerId" text NOT NULL,
    logo text,
    favicon text,
    "primaryColor" text DEFAULT '#000000'::text NOT NULL,
    email text NOT NULL,
    phone text,
    address jsonb,
    timezone text DEFAULT 'Asia/Seoul'::text NOT NULL,
    locale text DEFAULT 'ko'::text NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    features jsonb DEFAULT '{}'::jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    "storageUsed" bigint DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Organization" OWNER TO peter;

--
-- Name: OrganizationMember; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."OrganizationMember" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "orgId" text NOT NULL,
    role public."UserRole" NOT NULL,
    permissions jsonb NOT NULL,
    "invitedBy" text,
    "invitedAt" timestamp(3) without time zone,
    "acceptedAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."OrganizationMember" OWNER TO peter;

--
-- Name: Participant; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."Participant" (
    id text NOT NULL,
    "registrationId" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "firstNameEn" text,
    "lastNameEn" text,
    email text NOT NULL,
    phone text NOT NULL,
    "birthDate" timestamp(3) without time zone,
    gender text,
    nationality text,
    organization text,
    "position" text,
    "passportNumber" text,
    "passportExpiry" timestamp(3) without time zone,
    "visaRequired" boolean DEFAULT false NOT NULL,
    "visaStatus" text,
    "dietaryRestrictions" text,
    allergies text,
    "specialNeeds" text,
    "emergencyContact" jsonb,
    "checkedIn" boolean DEFAULT false NOT NULL,
    "checkedInAt" timestamp(3) without time zone,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Participant" OWNER TO peter;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "registrationId" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'KRW'::text NOT NULL,
    method text NOT NULL,
    provider text NOT NULL,
    "providerId" text,
    "providerResponse" jsonb,
    status text DEFAULT 'pending'::text NOT NULL,
    "refundAmount" numeric(10,2),
    "refundReason" text,
    "refundedAt" timestamp(3) without time zone,
    "refundId" text,
    "receiptUrl" text,
    "invoiceNumber" text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO peter;

--
-- Name: PaymentAccount; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."PaymentAccount" (
    id text NOT NULL,
    "orgId" text NOT NULL,
    provider text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "merchantId" text,
    "apiKey" text,
    "secretKey" text,
    "webhookSecret" text,
    "bankName" text,
    "bankAccount" text,
    "accountHolder" text,
    settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PaymentAccount" OWNER TO peter;

--
-- Name: Program; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."Program" (
    id text NOT NULL,
    "eventId" text NOT NULL,
    code text NOT NULL,
    title text NOT NULL,
    "titleEn" text,
    description text,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    location text,
    "maxCapacity" integer,
    "currentCount" integer DEFAULT 0 NOT NULL,
    price numeric(10,2),
    "isRequired" boolean DEFAULT false NOT NULL,
    "allowWaitlist" boolean DEFAULT false NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Program" OWNER TO peter;

--
-- Name: ProgramParticipation; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."ProgramParticipation" (
    id text NOT NULL,
    "programId" text NOT NULL,
    "registrationId" text NOT NULL,
    status text DEFAULT 'registered'::text NOT NULL,
    "attendedAt" timestamp(3) without time zone
);


ALTER TABLE public."ProgramParticipation" OWNER TO peter;

--
-- Name: Registration; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."Registration" (
    id text NOT NULL,
    "eventId" text NOT NULL,
    "userId" text,
    "registrationNumber" text NOT NULL,
    type text DEFAULT 'individual'::text NOT NULL,
    "groupName" text,
    "groupSize" integer DEFAULT 1 NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    "baseAmount" numeric(10,2) NOT NULL,
    "discountAmount" numeric(10,2) DEFAULT 0 NOT NULL,
    "discountReason" text,
    "taxAmount" numeric(10,2) DEFAULT 0 NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "requiresApproval" boolean DEFAULT false NOT NULL,
    "approvedAt" timestamp(3) without time zone,
    "approvedBy" text,
    "customFormData" jsonb,
    notes text,
    "internalNotes" text,
    "qrCode" text,
    "checkedInAt" timestamp(3) without time zone,
    "checkedInBy" text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Registration" OWNER TO peter;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO peter;

--
-- Name: SmsLog; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."SmsLog" (
    id text NOT NULL,
    "orgId" text NOT NULL,
    recipient text NOT NULL,
    "recipientName" text,
    "registrationId" text,
    "eventId" text,
    message text NOT NULL,
    "messageType" text NOT NULL,
    "templateId" text,
    provider text NOT NULL,
    "providerId" text,
    status text DEFAULT 'pending'::text NOT NULL,
    "sentAt" timestamp(3) without time zone,
    "deliveredAt" timestamp(3) without time zone,
    "failedAt" timestamp(3) without time zone,
    "failureReason" text,
    cost numeric(10,2),
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SmsLog" OWNER TO peter;

--
-- Name: Subscription; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."Subscription" (
    id text NOT NULL,
    "orgId" text NOT NULL,
    plan public."SubscriptionPlan" DEFAULT 'FREE'::public."SubscriptionPlan" NOT NULL,
    status public."SubscriptionStatus" DEFAULT 'TRIAL'::public."SubscriptionStatus" NOT NULL,
    "trialEndsAt" timestamp(3) without time zone,
    "currentPeriodStart" timestamp(3) without time zone NOT NULL,
    "currentPeriodEnd" timestamp(3) without time zone NOT NULL,
    "cancelledAt" timestamp(3) without time zone,
    "maxEvents" integer NOT NULL,
    "maxParticipants" integer NOT NULL,
    "maxAdmins" integer DEFAULT 5 NOT NULL,
    "storageLimit" bigint NOT NULL,
    "billingCycle" text DEFAULT 'monthly'::text NOT NULL,
    price numeric(10,2) NOT NULL,
    currency text DEFAULT 'KRW'::text NOT NULL,
    features jsonb DEFAULT '{}'::jsonb NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Subscription" OWNER TO peter;

--
-- Name: User; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    password text,
    role public."UserRole" DEFAULT 'PARTICIPANT'::public."UserRole" NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    phone text,
    "profileImage" text,
    "lastLoginAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO peter;

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO peter;

--
-- Name: Waitlist; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."Waitlist" (
    id text NOT NULL,
    "programId" text NOT NULL,
    "registrationId" text NOT NULL,
    "position" integer NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    "notifiedAt" timestamp(3) without time zone,
    "notificationCount" integer DEFAULT 0 NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    status text DEFAULT 'waiting'::text NOT NULL,
    "confirmedAt" timestamp(3) without time zone,
    "cancelledAt" timestamp(3) without time zone,
    "cancelReason" text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Waitlist" OWNER TO peter;

--
-- Name: WebhookLog; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public."WebhookLog" (
    id text NOT NULL,
    "paymentId" text,
    provider text NOT NULL,
    "eventType" text NOT NULL,
    payload jsonb NOT NULL,
    processed boolean DEFAULT false NOT NULL,
    "processedAt" timestamp(3) without time zone,
    error text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."WebhookLog" OWNER TO peter;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: peter
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO peter;

--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: ActivityLog; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."ActivityLog" (id, "userId", "orgId", action, "entityType", "entityId", "oldValues", "newValues", "ipAddress", "userAgent", "createdAt") FROM stdin;
53a5e0df-d523-492f-a145-6a86eb3dbec1	fa31f4e7-6f86-451d-82fd-25ebd71a180b	f588a2a7-6c08-4836-8c78-f47888d3d575	create	event	93caad42-fc81-4c1c-be11-270e56b9bde1	\N	{"title": "2026 세계선교대회", "status": "published"}	127.0.0.1	Mozilla/5.0	2025-09-19 19:36:54.07
\.


--
-- Data for Name: Analytics; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."Analytics" (id, "orgId", "eventId", date, "pageViews", "uniqueVisitors", "registrationStarts", "registrationCompletes", revenue, "hourlyData", "sourceData", "deviceData", "createdAt") FROM stdin;
032bb8bf-2a62-4403-b6c3-a4ce8bcdbd17	f588a2a7-6c08-4836-8c78-f47888d3d575	93caad42-fc81-4c1c-be11-270e56b9bde1	2026-01-15	1250	423	87	45	11250000.00	\N	{"direct": 234, "social": 33, "organic": 156}	{"mobile": 145, "tablet": 11, "desktop": 267}	2025-09-19 19:36:54.072
\.


--
-- Data for Name: CustomDomain; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."CustomDomain" (id, "orgId", "eventId", domain, type, "isPrimary", status, "verificationToken", "verifiedAt", "sslEnabled", "sslStatus", "certificateId", "sslIssuedAt", "sslExpiresAt", "redirectTo", "redirectType", "forceHttps", "dnsRecords", "lastDnsCheck", "customBranding", metadata, "createdAt", "updatedAt") FROM stdin;
a409b503-062f-41bf-8247-6fab0bf59c61	f588a2a7-6c08-4836-8c78-f47888d3d575	93caad42-fc81-4c1c-be11-270e56b9bde1	wmc2026.org	EVENT	t	VERIFIED	\N	2025-09-19 19:36:54.077	t	active	\N	\N	\N	\N	301	t	\N	\N	{"logo": "https://wmc2026.org/logo.png", "favicon": "https://wmc2026.org/favicon.ico", "primaryColor": "#FF6B35"}	{}	2025-09-19 19:36:54.078	2025-09-19 19:36:54.078
\.


--
-- Data for Name: CustomForm; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."CustomForm" (id, "orgId", name, description, fields, "isActive", "createdAt", "updatedAt") FROM stdin;
445657b8-6142-4701-9a30-91276292d83f	f588a2a7-6c08-4836-8c78-f47888d3d575	세계선교대회 등록 폼	2026 세계선교대회 참가자 등록을 위한 커스텀 폼	[{"id": "church", "type": "text", "label": "소속 교회", "labelEn": "Church Name", "required": true, "validation": {"maxLength": 100, "minLength": 2}}, {"id": "meal", "type": "select", "label": "식사 옵션", "labelEn": "Meal Option", "options": [{"label": "일반", "value": "regular"}, {"label": "채식", "value": "vegetarian"}, {"label": "할랄", "value": "halal"}], "required": false}, {"id": "accommodation", "type": "checkbox", "label": "숙박 필요", "labelEn": "Need Accommodation", "required": false}]	t	2025-09-19 19:36:53.867	2025-09-19 19:36:53.867
\.


--
-- Data for Name: DiscountCode; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."DiscountCode" (id, "eventId", code, description, "discountType", "discountValue", "maxUses", "currentUses", "maxUsesPerUser", "validFrom", "validUntil", conditions, "minAmount", "isActive", metadata, "createdAt", "updatedAt") FROM stdin;
02a36ffd-e739-4095-a78b-bfbb1ca9b896	93caad42-fc81-4c1c-be11-270e56b9bde1	EARLY2026	조기등록 추가 할인	percentage	10.00	1000	0	1	2026-01-01 00:00:00	2026-03-31 00:00:00	\N	\N	t	{}	2025-09-19 19:36:53.883	2025-09-19 19:36:53.883
2d6ca9cf-de8f-4655-a852-d35131f2129e	93caad42-fc81-4c1c-be11-270e56b9bde1	STUDENT50	학생 50% 할인	percentage	50.00	500	0	1	2026-01-01 00:00:00	2026-07-15 00:00:00	{"requiresVerification": true, "verificationDocument": "student_id"}	\N	t	{}	2025-09-19 19:36:53.886	2025-09-19 19:36:53.886
\.


--
-- Data for Name: EmailTemplate; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."EmailTemplate" (id, "orgId", name, subject, "bodyHtml", "bodyText", type, variables, "isActive", "createdAt", "updatedAt") FROM stdin;
d09345c7-0fa3-4317-9847-938035a0d022	f588a2a7-6c08-4836-8c78-f47888d3d575	등록 확인 이메일	[{{event_title}}] 등록이 완료되었습니다	\n        <h2>안녕하세요, {{name}}님!</h2>\n        <p>{{event_title}} 등록이 성공적으로 완료되었습니다.</p>\n        <p>등록번호: {{registration_number}}</p>\n        <p>행사 일정: {{event_date}}</p>\n        <p>장소: {{venue}}</p>\n        <p>감사합니다.</p>\n      	\n        안녕하세요, {{name}}님!\n        {{event_title}} 등록이 성공적으로 완료되었습니다.\n        등록번호: {{registration_number}}\n        행사 일정: {{event_date}}\n        장소: {{venue}}\n        감사합니다.\n      	registration_confirmation	["name", "event_title", "registration_number", "event_date", "venue"]	t	2025-09-19 19:36:54.064	2025-09-19 19:36:54.064
\.


--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."Event" (id, "orgId", slug, title, "titleEn", description, "descriptionEn", "startDate", "endDate", "registrationStart", "registrationEnd", "earlyBirdEnd", venue, "venueAddress", "onlineUrl", "maxParticipants", "basePrice", "earlyBirdPrice", currency, status, visibility, "requiresApproval", "customFormId", "emailTemplateIds", tags, "customBranding", "totalRegistrations", "totalRevenue", "createdBy", metadata, "createdAt", "updatedAt", "defaultLocale", "isMultiLanguage", "supportedLocales") FROM stdin;
93caad42-fc81-4c1c-be11-270e56b9bde1	f588a2a7-6c08-4836-8c78-f47888d3d575	wmc-2026	2026 세계선교대회	2026 World Mission Conference	전 세계 UBF 선교사와 목자들이 모이는 세계선교대회입니다.	World Mission Conference gathering UBF missionaries and shepherds from around the world.	2026-08-01 00:00:00	2026-08-07 00:00:00	2026-01-01 00:00:00	2026-07-15 00:00:00	2026-03-31 00:00:00	서울 COEX	{"city": "서울", "postal": "06164", "street": "서울시 강남구 영동대로 513", "country": "대한민국"}	\N	5000	300000.00	250000.00	KRW	published	public	f	445657b8-6142-4701-9a30-91276292d83f	[]	{conference,mission,global}	\N	0	0.00	fa31f4e7-6f86-451d-82fd-25ebd71a180b	{"expectedCountries": 95, "simultaneousTranslation": ["ko", "en", "es", "ru", "zh"]}	2025-09-19 19:36:53.87	2025-09-19 19:36:53.87	ko	f	{ko}
07040baf-6aec-4d50-99e7-9b6c2467c0dd	f588a2a7-6c08-4836-8c78-f47888d3d575	spring-2026	2026 봄 성경학교	2026 Spring Bible Conference	봄학기 성경공부 집중 훈련 프로그램	Intensive Spring semester Bible study training program	2026-03-20 00:00:00	2026-03-22 00:00:00	2026-01-15 00:00:00	2026-03-10 00:00:00	2026-02-20 00:00:00	서울 UBF 센터	{"city": "서울", "postal": "03134", "street": "서울시 종로구 대학로 123", "country": "대한민국"}	\N	300	50000.00	40000.00	KRW	published	public	f	\N	[]	{bible,training,spring}	\N	0	0.00	fa31f4e7-6f86-451d-82fd-25ebd71a180b	{}	2025-09-19 19:36:53.889	2025-09-19 19:36:53.889	ko	f	{ko}
fe006145-359e-4bd3-9f35-1bd1ab638bb2	e1e9793f-b188-456b-8081-44d793c06f80	regional-2026	2026 인천지역 연합수양회	2026 Incheon Regional Conference	인천 지역 교회 연합 수양회	Incheon regional churches united conference	2026-05-01 00:00:00	2026-05-03 00:00:00	2026-02-01 00:00:00	2026-04-20 00:00:00	\N	인천 청소년수련원	{"city": "인천", "postal": "22700", "street": "인천시 서구 검단로 123", "country": "대한민국"}	\N	200	80000.00	\N	KRW	published	public	t	\N	[]	{regional,conference}	\N	0	0.00	ce262279-1361-4cfe-ba0d-0f933c2a7c0f	{}	2025-09-19 19:36:53.894	2025-09-19 19:36:53.894	ko	f	{ko}
3ec04003-fc05-4403-8018-0fba9a3ef21d	e1e9793f-b188-456b-8081-44d793c06f80	youth-camp-2026	2026 청년 여름 캠프	2026 Youth Summer Camp	대학생과 청년을 위한 여름 캠프	Summer camp for college students and young adults	2026-07-20 00:00:00	2026-07-25 00:00:00	2026-04-01 00:00:00	2026-07-10 00:00:00	2026-05-31 00:00:00	강원도 평창 리조트	{"city": "평창", "postal": "25354", "street": "강원도 평창군 대관령면 올림픽로 715", "country": "대한민국"}	\N	150	200000.00	170000.00	KRW	draft	private	t	\N	[]	{youth,summer,camp}	\N	0	0.00	ce262279-1361-4cfe-ba0d-0f933c2a7c0f	{}	2025-09-19 19:36:53.899	2025-09-19 19:36:53.899	ko	f	{ko}
\.


--
-- Data for Name: EventMenu; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."EventMenu" (id, "eventId", title, url, "pageId", "order", "parentId", "isVisible", type, icon, target, metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: EventPage; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."EventPage" (id, "eventId", slug, title, content, "order", "isVisible", metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: FileUpload; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."FileUpload" (id, "orgId", "fileName", "originalName", "fileType", "mimeType", "fileSize", "storageProvider", "filePath", "fileUrl", "thumbnailUrl", "entityType", "entityId", "eventId", "registrationId", "uploadedBy", "uploadedAt", "isPublic", "isDeleted", "deletedAt", "virusScanStatus", "virusScanAt", metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."Invoice" (id, "subscriptionId", "invoiceNumber", amount, tax, "totalAmount", currency, status, "dueDate", "paidAt", "taxInvoiceNumber", "taxInvoiceIssuedAt", "paymentMethod", "paymentId", metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."Notification" (id, "userId", type, title, content, "isRead", "readAt", "relatedType", "relatedId", metadata, "createdAt") FROM stdin;
6dcdfc3d-7d4d-4375-9d8c-d51e499ca9f9	c9a2aeb8-3d4c-4495-a88a-01a4e25b066a	email	등록 완료	2026 세계선교대회 등록이 완료되었습니다.	t	2025-09-19 19:36:54.075	registration	110fc014-f049-428d-b3d4-26f0ea035fc7	{}	2025-09-19 19:36:54.076
\.


--
-- Data for Name: Organization; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."Organization" (id, slug, name, "nameEn", description, "ownerId", logo, favicon, "primaryColor", email, phone, address, timezone, locale, settings, features, "isActive", "isVerified", "storageUsed", "createdAt", "updatedAt") FROM stdin;
f588a2a7-6c08-4836-8c78-f47888d3d575	seoul-ubf	서울 UBF	Seoul UBF	서울 대학생성경읽기선교회	210fee3d-c116-4880-b950-b5263cd8a7a7	/logos/seoul-ubf.png	\N	#1a73e8	info@seoulubf.org	02-1234-5678	{"city": "서울", "postal": "03134", "street": "서울시 종로구 대학로 123", "country": "대한민국"}	Asia/Seoul	ko	{"emailSender": "noreply@seoulubf.org", "defaultCurrency": "KRW"}	{"apiAccess": true, "customDomain": true, "emailAutomation": true, "advancedAnalytics": true}	t	t	0	2025-09-19 19:36:53.767	2025-09-19 19:36:53.767
e1e9793f-b188-456b-8081-44d793c06f80	incheon-ubf	인천 UBF	Incheon UBF	인천 대학생성경읽기선교회	ce262279-1361-4cfe-ba0d-0f933c2a7c0f	/logos/incheon-ubf.png	\N	#34a853	info@incheonubf.org	032-8765-4321	{"city": "인천", "postal": "21999", "street": "인천시 남동구 대학로 456", "country": "대한민국"}	Asia/Seoul	ko	{"emailSender": "noreply@incheonubf.org", "defaultCurrency": "KRW"}	{"apiAccess": false, "customDomain": false, "emailAutomation": true, "advancedAnalytics": false}	t	t	0	2025-09-19 19:36:53.857	2025-09-19 19:36:53.857
\.


--
-- Data for Name: OrganizationMember; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."OrganizationMember" (id, "userId", "orgId", role, permissions, "invitedBy", "invitedAt", "acceptedAt", "isActive") FROM stdin;
36d58612-b42e-4359-b2d1-079177cd8a7b	210fee3d-c116-4880-b950-b5263cd8a7a7	f588a2a7-6c08-4836-8c78-f47888d3d575	ORG_OWNER	{"all": true}	\N	\N	2025-09-19 19:36:53.769	t
d2902c5a-eb72-4f83-8b52-3efd11eed183	fa31f4e7-6f86-451d-82fd-25ebd71a180b	f588a2a7-6c08-4836-8c78-f47888d3d575	ORG_ADMIN	{"events": {"edit": true, "create": true, "delete": true, "publish": true}, "payments": {"view": true}, "settings": {"team": true}, "registrations": {"view": true, "export": true, "approve": true}}	\N	\N	2025-09-19 19:36:53.769	t
8d915865-3739-48f3-b326-238a594fd3df	ce262279-1361-4cfe-ba0d-0f933c2a7c0f	e1e9793f-b188-456b-8081-44d793c06f80	ORG_OWNER	{"all": true}	\N	\N	2025-09-19 19:36:53.86	t
\.


--
-- Data for Name: Participant; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."Participant" (id, "registrationId", "firstName", "lastName", "firstNameEn", "lastNameEn", email, phone, "birthDate", gender, nationality, organization, "position", "passportNumber", "passportExpiry", "visaRequired", "visaStatus", "dietaryRestrictions", allergies, "specialNeeds", "emergencyContact", "checkedIn", "checkedInAt", metadata, "createdAt", "updatedAt") FROM stdin;
94f0f687-0819-4f48-a3cb-8ac8072df57e	110fc014-f049-428d-b3d4-26f0ea035fc7	John	Doe	John	Doe	john.doe@example.com	010-7777-8888	\N	\N	USA	Seoul Central Church	Member	\N	\N	f	\N	None	\N	\N	\N	f	\N	{}	2025-09-19 19:36:54.058	2025-09-19 19:36:54.058
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."Payment" (id, "registrationId", amount, currency, method, provider, "providerId", "providerResponse", status, "refundAmount", "refundReason", "refundedAt", "refundId", "receiptUrl", "invoiceNumber", metadata, "createdAt", "updatedAt") FROM stdin;
dceb0fed-6c1a-4ced-8f6b-13d2fed21f67	110fc014-f049-428d-b3d4-26f0ea035fc7	225000.00	KRW	card	toss	toss_payment_001	\N	completed	\N	\N	\N	\N	https://receipt.toss.im/001	\N	{"cardType": "VISA", "cardNumber": "**** **** **** 1234"}	2025-09-19 19:36:54.062	2025-09-19 19:36:54.062
\.


--
-- Data for Name: PaymentAccount; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."PaymentAccount" (id, "orgId", provider, "isActive", "isDefault", "merchantId", "apiKey", "secretKey", "webhookSecret", "bankName", "bankAccount", "accountHolder", settings, "createdAt", "updatedAt") FROM stdin;
dff91765-2ef2-4eee-ac55-07b06e95f52c	f588a2a7-6c08-4836-8c78-f47888d3d575	toss	t	t	seoul-ubf-merchant	encrypted_api_key_here	encrypted_secret_key_here	\N	국민은행	123-456-789012	서울UBF	{"webhookUrl": "https://api.seoulubf.org/webhooks/toss", "autoCapture": true}	2025-09-19 19:36:54.066	2025-09-19 19:36:54.066
0360409a-b258-4aa8-8ee6-5785983a69b1	e1e9793f-b188-456b-8081-44d793c06f80	portone	t	t	incheon-ubf-merchant	encrypted_api_key_here	encrypted_secret_key_here	\N	신한은행	987-654-321098	인천UBF	{"pgProvider": "nice"}	2025-09-19 19:36:54.068	2025-09-19 19:36:54.068
\.


--
-- Data for Name: Program; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."Program" (id, "eventId", code, title, "titleEn", description, "startTime", "endTime", location, "maxCapacity", "currentCount", price, "isRequired", "allowWaitlist", metadata, "createdAt", "updatedAt") FROM stdin;
02270748-53f2-42c5-8667-cf6fff77cb89	93caad42-fc81-4c1c-be11-270e56b9bde1	MAIN	메인 컨퍼런스	Main Conference	전체 참가자가 함께하는 메인 세션	2026-08-02 13:00:00	2026-08-06 22:00:00	Grand Ballroom	5000	0	\N	t	f	{}	2025-09-19 19:36:53.874	2025-09-19 19:36:53.874
6cf07794-03e4-446d-a8e0-68911e30c492	93caad42-fc81-4c1c-be11-270e56b9bde1	WORKSHOP	선교 워크샵	Mission Workshop	지역별 선교 전략 워크샵	2026-08-03 18:00:00	2026-08-03 21:00:00	Conference Room A-E	500	0	50000.00	f	t	{}	2025-09-19 19:36:53.878	2025-09-19 19:36:53.878
44ac7b32-6a0d-45d4-9432-37152cb76392	fe006145-359e-4bd3-9f35-1bd1ab638bb2	MAIN	주제 강의	Main Lectures	연합수양회 주제 강의	2026-05-01 23:00:00	2026-05-03 16:00:00	대강당	200	0	\N	t	f	{}	2025-09-19 19:36:53.897	2025-09-19 19:36:53.897
\.


--
-- Data for Name: ProgramParticipation; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."ProgramParticipation" (id, "programId", "registrationId", status, "attendedAt") FROM stdin;
bb95b3cb-2f85-46b2-a2b3-fdf57239d216	02270748-53f2-42c5-8667-cf6fff77cb89	110fc014-f049-428d-b3d4-26f0ea035fc7	registered	\N
\.


--
-- Data for Name: Registration; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."Registration" (id, "eventId", "userId", "registrationNumber", type, "groupName", "groupSize", name, email, phone, "baseAmount", "discountAmount", "discountReason", "taxAmount", "totalAmount", status, "requiresApproval", "approvedAt", "approvedBy", "customFormData", notes, "internalNotes", "qrCode", "checkedInAt", "checkedInBy", metadata, "createdAt", "updatedAt") FROM stdin;
110fc014-f049-428d-b3d4-26f0ea035fc7	93caad42-fc81-4c1c-be11-270e56b9bde1	c9a2aeb8-3d4c-4495-a88a-01a4e25b066a	cmfr8qoti0001vq21fe2dqwj6	individual	\N	1	John Doe	john.doe@example.com	010-7777-8888	250000.00	25000.00	EARLY2026 코드 적용	0.00	225000.00	confirmed	f	\N	\N	{"meal": "regular", "church": "Seoul Central Church", "accommodation": true}	\N	\N	QR-WMC2026-001	\N	\N	{}	2025-09-19 19:36:54.054	2025-09-19 19:36:54.054
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: SmsLog; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."SmsLog" (id, "orgId", recipient, "recipientName", "registrationId", "eventId", message, "messageType", "templateId", provider, "providerId", status, "sentAt", "deliveredAt", "failedAt", "failureReason", cost, metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."Subscription" (id, "orgId", plan, status, "trialEndsAt", "currentPeriodStart", "currentPeriodEnd", "cancelledAt", "maxEvents", "maxParticipants", "maxAdmins", "storageLimit", "billingCycle", price, currency, features, metadata, "createdAt", "updatedAt") FROM stdin;
acb57f7e-47e3-48a0-b259-57790f5ba4bf	f588a2a7-6c08-4836-8c78-f47888d3d575	PRO	ACTIVE	\N	2025-09-19 19:36:53.772	2026-09-19 19:36:53.772	\N	10	1000	10	10737418240	yearly	1200000.00	KRW	{"apiAccess": true, "whiteLabel": false, "customDomain": true, "supportLevel": "premium", "maxCustomForms": 10, "emailAutomation": true, "advancedAnalytics": true, "maxEmailTemplates": 20}	{}	2025-09-19 19:36:53.773	2025-09-19 19:36:53.773
ec6c7814-e577-4a99-b9e1-51c758068c20	e1e9793f-b188-456b-8081-44d793c06f80	BASIC	ACTIVE	\N	2025-09-19 19:36:53.864	2025-10-19 19:36:53.864	\N	3	200	5	2147483648	monthly	50000.00	KRW	{"apiAccess": false, "whiteLabel": false, "customDomain": false, "supportLevel": "basic", "maxCustomForms": 3, "emailAutomation": true, "advancedAnalytics": false, "maxEmailTemplates": 5}	{}	2025-09-19 19:36:53.865	2025-09-19 19:36:53.865
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."User" (id, email, name, password, role, "emailVerified", phone, "profileImage", "lastLoginAt", "isActive", metadata, "createdAt", "updatedAt") FROM stdin;
b9ab3ed1-72df-4721-86d7-253b36a8e2f5	admin@platform.com	플랫폼 관리자	$2b$10$.hVuRKJYTdEd30wOUBLFe.AaBUnbZYK..n4FFC1iARWsGjb0mWbom	SUPER_ADMIN	2025-09-19 19:36:53.594	010-1234-5678	\N	\N	t	{}	2025-09-19 19:36:53.597	2025-09-19 19:36:53.597
210fee3d-c116-4880-b950-b5263cd8a7a7	owner@seoulubf.org	김요한	$2b$10$qV2YOrRvZLYAgs8nkMebPOnmNarKnofLTJaGjhlEtlZwPh6ot2HNq	ORG_OWNER	2025-09-19 19:36:53.677	010-2222-3333	\N	\N	t	{}	2025-09-19 19:36:53.678	2025-09-19 19:36:53.678
fa31f4e7-6f86-451d-82fd-25ebd71a180b	admin@seoulubf.org	이사라	$2b$10$GZk4284ntsJiffhhmyjjP.pzxRitEYawwi8pHVBLo2GLcPolqZhh2	ORG_ADMIN	2025-09-19 19:36:53.763	010-3333-4444	\N	\N	t	{}	2025-09-19 19:36:53.764	2025-09-19 19:36:53.764
ce262279-1361-4cfe-ba0d-0f933c2a7c0f	owner@incheonubf.org	박바울	$2b$10$L2uLKA5NVRUUhJLCUOuSzeVhl1pPVyiZuxwWQAmv2ONMoqCgZ5BTq	ORG_OWNER	2025-09-19 19:36:53.853	010-5555-6666	\N	\N	t	{}	2025-09-19 19:36:53.854	2025-09-19 19:36:53.854
c9a2aeb8-3d4c-4495-a88a-01a4e25b066a	john.doe@example.com	John Doe	$2b$10$ZA7ZAlG4LtfB9Ty/M8t4K.pnpX7gZKa.ETvX4hWZvsNXe.AuKWI2O	PARTICIPANT	2025-09-19 19:36:53.974	010-7777-8888	\N	\N	t	{}	2025-09-19 19:36:53.975	2025-09-19 19:36:53.975
59e24923-b27f-48e9-9bbf-c9e3eeb341d4	jane.smith@example.com	Jane Smith	$2b$10$fHil.syGgO7QJsXVqoU3guVCbe4UBU0vpJSTrbG65RlGB3mq2OGeu	PARTICIPANT	2025-09-19 19:36:54.05	010-8888-9999	\N	\N	t	{}	2025-09-19 19:36:54.051	2025-09-19 19:36:54.051
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: Waitlist; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."Waitlist" (id, "programId", "registrationId", "position", priority, "notifiedAt", "notificationCount", "expiresAt", status, "confirmedAt", "cancelledAt", "cancelReason", metadata, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: WebhookLog; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public."WebhookLog" (id, "paymentId", provider, "eventType", payload, processed, "processedAt", error, "createdAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: peter
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d38256b8-146c-4aa0-b0ec-8103d1a628b0	81dbf43e7bf9e4df40e9538aacde502ada679d62834f16cef2cc882f6771d48a	2025-09-19 15:36:38.395458-04	20250919193637_init	\N	\N	2025-09-19 15:36:37.635812-04	1
66714932-7021-41a7-8f87-746de1aeb9f2	55272df0974943f2880ca5907f98e28f400244243ac6f0b6b5d60c01c654c276	2025-09-24 11:19:12.260256-04	20250924151912_remove_duplicate_custom_domain_fields	\N	\N	2025-09-24 11:19:12.249096-04	1
27d42f84-aaf2-4b71-869d-2786be45bd75	926eee91c1dfb9aa7c4c26580de86ef7621363dfcb3901f2876da62a92d725fd	2025-09-24 12:01:20.667152-04	20250924160120_add_event_multilang_support	\N	\N	2025-09-24 12:01:20.65381-04	1
\.


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: ActivityLog ActivityLog_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_pkey" PRIMARY KEY (id);


--
-- Name: Analytics Analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Analytics"
    ADD CONSTRAINT "Analytics_pkey" PRIMARY KEY (id);


--
-- Name: CustomDomain CustomDomain_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."CustomDomain"
    ADD CONSTRAINT "CustomDomain_pkey" PRIMARY KEY (id);


--
-- Name: CustomForm CustomForm_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."CustomForm"
    ADD CONSTRAINT "CustomForm_pkey" PRIMARY KEY (id);


--
-- Name: DiscountCode DiscountCode_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."DiscountCode"
    ADD CONSTRAINT "DiscountCode_pkey" PRIMARY KEY (id);


--
-- Name: EmailTemplate EmailTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."EmailTemplate"
    ADD CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY (id);


--
-- Name: EventMenu EventMenu_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."EventMenu"
    ADD CONSTRAINT "EventMenu_pkey" PRIMARY KEY (id);


--
-- Name: EventPage EventPage_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."EventPage"
    ADD CONSTRAINT "EventPage_pkey" PRIMARY KEY (id);


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: FileUpload FileUpload_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."FileUpload"
    ADD CONSTRAINT "FileUpload_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: OrganizationMember OrganizationMember_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."OrganizationMember"
    ADD CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY (id);


--
-- Name: Organization Organization_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "Organization_pkey" PRIMARY KEY (id);


--
-- Name: Participant Participant_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT "Participant_pkey" PRIMARY KEY (id);


--
-- Name: PaymentAccount PaymentAccount_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."PaymentAccount"
    ADD CONSTRAINT "PaymentAccount_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: ProgramParticipation ProgramParticipation_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."ProgramParticipation"
    ADD CONSTRAINT "ProgramParticipation_pkey" PRIMARY KEY (id);


--
-- Name: Program Program_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Program"
    ADD CONSTRAINT "Program_pkey" PRIMARY KEY (id);


--
-- Name: Registration Registration_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Registration"
    ADD CONSTRAINT "Registration_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: SmsLog SmsLog_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."SmsLog"
    ADD CONSTRAINT "SmsLog_pkey" PRIMARY KEY (id);


--
-- Name: Subscription Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Waitlist Waitlist_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Waitlist"
    ADD CONSTRAINT "Waitlist_pkey" PRIMARY KEY (id);


--
-- Name: WebhookLog WebhookLog_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."WebhookLog"
    ADD CONSTRAINT "WebhookLog_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Account_userId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Account_userId_idx" ON public."Account" USING btree ("userId");


--
-- Name: ActivityLog_createdAt_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "ActivityLog_createdAt_idx" ON public."ActivityLog" USING btree ("createdAt");


--
-- Name: ActivityLog_entityType_entityId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "ActivityLog_entityType_entityId_idx" ON public."ActivityLog" USING btree ("entityType", "entityId");


--
-- Name: ActivityLog_orgId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "ActivityLog_orgId_idx" ON public."ActivityLog" USING btree ("orgId");


--
-- Name: ActivityLog_userId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "ActivityLog_userId_idx" ON public."ActivityLog" USING btree ("userId");


--
-- Name: Analytics_date_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Analytics_date_idx" ON public."Analytics" USING btree (date);


--
-- Name: Analytics_eventId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Analytics_eventId_idx" ON public."Analytics" USING btree ("eventId");


--
-- Name: Analytics_orgId_eventId_date_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "Analytics_orgId_eventId_date_key" ON public."Analytics" USING btree ("orgId", "eventId", date);


--
-- Name: Analytics_orgId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Analytics_orgId_idx" ON public."Analytics" USING btree ("orgId");


--
-- Name: CustomDomain_domain_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "CustomDomain_domain_idx" ON public."CustomDomain" USING btree (domain);


--
-- Name: CustomDomain_domain_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "CustomDomain_domain_key" ON public."CustomDomain" USING btree (domain);


--
-- Name: CustomDomain_eventId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "CustomDomain_eventId_idx" ON public."CustomDomain" USING btree ("eventId");


--
-- Name: CustomDomain_orgId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "CustomDomain_orgId_idx" ON public."CustomDomain" USING btree ("orgId");


--
-- Name: CustomDomain_status_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "CustomDomain_status_idx" ON public."CustomDomain" USING btree (status);


--
-- Name: CustomForm_orgId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "CustomForm_orgId_idx" ON public."CustomForm" USING btree ("orgId");


--
-- Name: DiscountCode_code_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "DiscountCode_code_idx" ON public."DiscountCode" USING btree (code);


--
-- Name: DiscountCode_code_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "DiscountCode_code_key" ON public."DiscountCode" USING btree (code);


--
-- Name: DiscountCode_eventId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "DiscountCode_eventId_idx" ON public."DiscountCode" USING btree ("eventId");


--
-- Name: DiscountCode_validFrom_validUntil_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "DiscountCode_validFrom_validUntil_idx" ON public."DiscountCode" USING btree ("validFrom", "validUntil");


--
-- Name: EmailTemplate_orgId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "EmailTemplate_orgId_idx" ON public."EmailTemplate" USING btree ("orgId");


--
-- Name: EmailTemplate_orgId_type_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "EmailTemplate_orgId_type_key" ON public."EmailTemplate" USING btree ("orgId", type);


--
-- Name: EventMenu_eventId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "EventMenu_eventId_idx" ON public."EventMenu" USING btree ("eventId");


--
-- Name: EventMenu_order_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "EventMenu_order_idx" ON public."EventMenu" USING btree ("order");


--
-- Name: EventMenu_parentId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "EventMenu_parentId_idx" ON public."EventMenu" USING btree ("parentId");


--
-- Name: EventPage_eventId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "EventPage_eventId_idx" ON public."EventPage" USING btree ("eventId");


--
-- Name: EventPage_eventId_slug_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "EventPage_eventId_slug_key" ON public."EventPage" USING btree ("eventId", slug);


--
-- Name: EventPage_slug_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "EventPage_slug_idx" ON public."EventPage" USING btree (slug);


--
-- Name: Event_orgId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Event_orgId_idx" ON public."Event" USING btree ("orgId");


--
-- Name: Event_orgId_slug_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "Event_orgId_slug_key" ON public."Event" USING btree ("orgId", slug);


--
-- Name: Event_startDate_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Event_startDate_idx" ON public."Event" USING btree ("startDate");


--
-- Name: Event_status_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Event_status_idx" ON public."Event" USING btree (status);


--
-- Name: FileUpload_entityType_entityId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "FileUpload_entityType_entityId_idx" ON public."FileUpload" USING btree ("entityType", "entityId");


--
-- Name: FileUpload_isDeleted_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "FileUpload_isDeleted_idx" ON public."FileUpload" USING btree ("isDeleted");


--
-- Name: FileUpload_orgId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "FileUpload_orgId_idx" ON public."FileUpload" USING btree ("orgId");


--
-- Name: FileUpload_uploadedBy_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "FileUpload_uploadedBy_idx" ON public."FileUpload" USING btree ("uploadedBy");


--
-- Name: Invoice_invoiceNumber_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON public."Invoice" USING btree ("invoiceNumber");


--
-- Name: Notification_relatedType_relatedId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Notification_relatedType_relatedId_idx" ON public."Notification" USING btree ("relatedType", "relatedId");


--
-- Name: Notification_userId_isRead_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Notification_userId_isRead_idx" ON public."Notification" USING btree ("userId", "isRead");


--
-- Name: OrganizationMember_orgId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "OrganizationMember_orgId_idx" ON public."OrganizationMember" USING btree ("orgId");


--
-- Name: OrganizationMember_userId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "OrganizationMember_userId_idx" ON public."OrganizationMember" USING btree ("userId");


--
-- Name: OrganizationMember_userId_orgId_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "OrganizationMember_userId_orgId_key" ON public."OrganizationMember" USING btree ("userId", "orgId");


--
-- Name: Organization_slug_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "Organization_slug_key" ON public."Organization" USING btree (slug);


--
-- Name: Participant_email_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Participant_email_idx" ON public."Participant" USING btree (email);


--
-- Name: Participant_registrationId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Participant_registrationId_idx" ON public."Participant" USING btree ("registrationId");


--
-- Name: PaymentAccount_orgId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "PaymentAccount_orgId_idx" ON public."PaymentAccount" USING btree ("orgId");


--
-- Name: PaymentAccount_orgId_provider_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "PaymentAccount_orgId_provider_key" ON public."PaymentAccount" USING btree ("orgId", provider);


--
-- Name: Payment_providerId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Payment_providerId_idx" ON public."Payment" USING btree ("providerId");


--
-- Name: Payment_registrationId_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "Payment_registrationId_key" ON public."Payment" USING btree ("registrationId");


--
-- Name: Payment_status_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Payment_status_idx" ON public."Payment" USING btree (status);


--
-- Name: ProgramParticipation_programId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "ProgramParticipation_programId_idx" ON public."ProgramParticipation" USING btree ("programId");


--
-- Name: ProgramParticipation_programId_registrationId_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "ProgramParticipation_programId_registrationId_key" ON public."ProgramParticipation" USING btree ("programId", "registrationId");


--
-- Name: ProgramParticipation_registrationId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "ProgramParticipation_registrationId_idx" ON public."ProgramParticipation" USING btree ("registrationId");


--
-- Name: Program_eventId_code_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "Program_eventId_code_key" ON public."Program" USING btree ("eventId", code);


--
-- Name: Program_eventId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Program_eventId_idx" ON public."Program" USING btree ("eventId");


--
-- Name: Registration_email_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Registration_email_idx" ON public."Registration" USING btree (email);


--
-- Name: Registration_eventId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Registration_eventId_idx" ON public."Registration" USING btree ("eventId");


--
-- Name: Registration_qrCode_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "Registration_qrCode_key" ON public."Registration" USING btree ("qrCode");


--
-- Name: Registration_registrationNumber_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "Registration_registrationNumber_key" ON public."Registration" USING btree ("registrationNumber");


--
-- Name: Registration_status_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Registration_status_idx" ON public."Registration" USING btree (status);


--
-- Name: Registration_userId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Registration_userId_idx" ON public."Registration" USING btree ("userId");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: Session_userId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Session_userId_idx" ON public."Session" USING btree ("userId");


--
-- Name: SmsLog_createdAt_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "SmsLog_createdAt_idx" ON public."SmsLog" USING btree ("createdAt");


--
-- Name: SmsLog_orgId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "SmsLog_orgId_idx" ON public."SmsLog" USING btree ("orgId");


--
-- Name: SmsLog_registrationId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "SmsLog_registrationId_idx" ON public."SmsLog" USING btree ("registrationId");


--
-- Name: SmsLog_status_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "SmsLog_status_idx" ON public."SmsLog" USING btree (status);


--
-- Name: Subscription_orgId_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "Subscription_orgId_key" ON public."Subscription" USING btree ("orgId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Waitlist_programId_registrationId_key; Type: INDEX; Schema: public; Owner: peter
--

CREATE UNIQUE INDEX "Waitlist_programId_registrationId_key" ON public."Waitlist" USING btree ("programId", "registrationId");


--
-- Name: Waitlist_programId_status_position_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Waitlist_programId_status_position_idx" ON public."Waitlist" USING btree ("programId", status, "position");


--
-- Name: Waitlist_registrationId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "Waitlist_registrationId_idx" ON public."Waitlist" USING btree ("registrationId");


--
-- Name: WebhookLog_paymentId_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "WebhookLog_paymentId_idx" ON public."WebhookLog" USING btree ("paymentId");


--
-- Name: WebhookLog_provider_eventType_idx; Type: INDEX; Schema: public; Owner: peter
--

CREATE INDEX "WebhookLog_provider_eventType_idx" ON public."WebhookLog" USING btree (provider, "eventType");


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ActivityLog ActivityLog_orgId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ActivityLog ActivityLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CustomDomain CustomDomain_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."CustomDomain"
    ADD CONSTRAINT "CustomDomain_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CustomDomain CustomDomain_orgId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."CustomDomain"
    ADD CONSTRAINT "CustomDomain_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CustomForm CustomForm_orgId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."CustomForm"
    ADD CONSTRAINT "CustomForm_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DiscountCode DiscountCode_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."DiscountCode"
    ADD CONSTRAINT "DiscountCode_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EmailTemplate EmailTemplate_orgId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."EmailTemplate"
    ADD CONSTRAINT "EmailTemplate_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EventMenu EventMenu_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."EventMenu"
    ADD CONSTRAINT "EventMenu_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EventMenu EventMenu_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."EventMenu"
    ADD CONSTRAINT "EventMenu_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public."EventPage"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EventMenu EventMenu_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."EventMenu"
    ADD CONSTRAINT "EventMenu_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."EventMenu"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EventPage EventPage_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."EventPage"
    ADD CONSTRAINT "EventPage_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Event Event_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Event Event_customFormId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_customFormId_fkey" FOREIGN KEY ("customFormId") REFERENCES public."CustomForm"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Event Event_orgId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FileUpload FileUpload_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."FileUpload"
    ADD CONSTRAINT "FileUpload_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FileUpload FileUpload_orgId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."FileUpload"
    ADD CONSTRAINT "FileUpload_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FileUpload FileUpload_registrationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."FileUpload"
    ADD CONSTRAINT "FileUpload_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES public."Registration"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_subscriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES public."Subscription"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrganizationMember OrganizationMember_orgId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."OrganizationMember"
    ADD CONSTRAINT "OrganizationMember_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrganizationMember OrganizationMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."OrganizationMember"
    ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Organization Organization_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Participant Participant_registrationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Participant"
    ADD CONSTRAINT "Participant_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES public."Registration"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PaymentAccount PaymentAccount_orgId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."PaymentAccount"
    ADD CONSTRAINT "PaymentAccount_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_registrationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES public."Registration"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProgramParticipation ProgramParticipation_programId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."ProgramParticipation"
    ADD CONSTRAINT "ProgramParticipation_programId_fkey" FOREIGN KEY ("programId") REFERENCES public."Program"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProgramParticipation ProgramParticipation_registrationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."ProgramParticipation"
    ADD CONSTRAINT "ProgramParticipation_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES public."Registration"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Program Program_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Program"
    ADD CONSTRAINT "Program_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Registration Registration_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Registration"
    ADD CONSTRAINT "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Registration Registration_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Registration"
    ADD CONSTRAINT "Registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SmsLog SmsLog_orgId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."SmsLog"
    ADD CONSTRAINT "SmsLog_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Subscription Subscription_orgId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Waitlist Waitlist_programId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Waitlist"
    ADD CONSTRAINT "Waitlist_programId_fkey" FOREIGN KEY ("programId") REFERENCES public."Program"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Waitlist Waitlist_registrationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."Waitlist"
    ADD CONSTRAINT "Waitlist_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES public."Registration"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WebhookLog WebhookLog_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peter
--

ALTER TABLE ONLY public."WebhookLog"
    ADD CONSTRAINT "WebhookLog_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public."Payment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict JDLr5isgSo1S22krB3JorIYJtQljpKIzipVj8RH2rXrn8DlwpW3MRS56RnrO7zp

