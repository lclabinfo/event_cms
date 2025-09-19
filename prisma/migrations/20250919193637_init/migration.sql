-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'ORG_STAFF', 'PARTICIPANT');

-- CreateEnum
CREATE TYPE "public"."SubscriptionPlan" AS ENUM ('FREE', 'BASIC', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."DomainType" AS ENUM ('ORGANIZATION', 'EVENT');

-- CreateEnum
CREATE TYPE "public"."DomainStatus" AS ENUM ('PENDING', 'VERIFYING', 'VERIFIED', 'FAILED', 'EXPIRED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'PARTICIPANT',
    "emailVerified" TIMESTAMP(3),
    "phone" TEXT,
    "profileImage" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrganizationMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "permissions" JSONB NOT NULL,
    "invitedBy" TEXT,
    "invitedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Organization" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "logo" TEXT,
    "favicon" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#000000',
    "customDomain" TEXT,
    "domainVerified" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" JSONB,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Seoul',
    "locale" TEXT NOT NULL DEFAULT 'ko',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "features" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "storageUsed" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "plan" "public"."SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
    "trialEndsAt" TIMESTAMP(3),
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelledAt" TIMESTAMP(3),
    "maxEvents" INTEGER NOT NULL,
    "maxParticipants" INTEGER NOT NULL,
    "maxAdmins" INTEGER NOT NULL DEFAULT 5,
    "storageLimit" BIGINT NOT NULL,
    "billingCycle" TEXT NOT NULL DEFAULT 'monthly',
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KRW',
    "features" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "description" TEXT,
    "descriptionEn" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "registrationStart" TIMESTAMP(3) NOT NULL,
    "registrationEnd" TIMESTAMP(3) NOT NULL,
    "earlyBirdEnd" TIMESTAMP(3),
    "venue" TEXT,
    "venueAddress" JSONB,
    "onlineUrl" TEXT,
    "maxParticipants" INTEGER,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "earlyBirdPrice" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'KRW',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "customFormId" TEXT,
    "emailTemplateIds" JSONB NOT NULL DEFAULT '[]',
    "tags" TEXT[],
    "customDomain" TEXT,
    "domainVerified" BOOLEAN NOT NULL DEFAULT false,
    "customBranding" JSONB,
    "totalRegistrations" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Program" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "maxCapacity" INTEGER,
    "currentCount" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(10,2),
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "allowWaitlist" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DiscountCode" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discountType" TEXT NOT NULL,
    "discountValue" DECIMAL(10,2) NOT NULL,
    "maxUses" INTEGER,
    "currentUses" INTEGER NOT NULL DEFAULT 0,
    "maxUsesPerUser" INTEGER NOT NULL DEFAULT 1,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "conditions" JSONB,
    "minAmount" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscountCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomDomain" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "eventId" TEXT,
    "domain" TEXT NOT NULL,
    "type" "public"."DomainType" NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."DomainStatus" NOT NULL DEFAULT 'PENDING',
    "verificationToken" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "sslEnabled" BOOLEAN NOT NULL DEFAULT false,
    "sslStatus" TEXT,
    "certificateId" TEXT,
    "sslIssuedAt" TIMESTAMP(3),
    "sslExpiresAt" TIMESTAMP(3),
    "redirectTo" TEXT,
    "redirectType" INTEGER NOT NULL DEFAULT 301,
    "forceHttps" BOOLEAN NOT NULL DEFAULT true,
    "dnsRecords" JSONB,
    "lastDnsCheck" TIMESTAMP(3),
    "customBranding" JSONB,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomDomain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Registration" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT,
    "registrationNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'individual',
    "groupName" TEXT,
    "groupSize" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "baseAmount" DECIMAL(10,2) NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discountReason" TEXT,
    "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "customFormData" JSONB,
    "notes" TEXT,
    "internalNotes" TEXT,
    "qrCode" TEXT,
    "checkedInAt" TIMESTAMP(3),
    "checkedInBy" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Participant" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstNameEn" TEXT,
    "lastNameEn" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "gender" TEXT,
    "nationality" TEXT,
    "organization" TEXT,
    "position" TEXT,
    "passportNumber" TEXT,
    "passportExpiry" TIMESTAMP(3),
    "visaRequired" BOOLEAN NOT NULL DEFAULT false,
    "visaStatus" TEXT,
    "dietaryRestrictions" TEXT,
    "allergies" TEXT,
    "specialNeeds" TEXT,
    "emergencyContact" JSONB,
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProgramParticipation" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'registered',
    "attendedAt" TIMESTAMP(3),

    CONSTRAINT "ProgramParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Waitlist" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "notifiedAt" TIMESTAMP(3),
    "notificationCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invoice" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "tax" DECIMAL(10,2) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KRW',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "taxInvoiceNumber" TEXT,
    "taxInvoiceIssuedAt" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "paymentId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentAccount" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "merchantId" TEXT,
    "apiKey" TEXT,
    "secretKey" TEXT,
    "webhookSecret" TEXT,
    "bankName" TEXT,
    "bankAccount" TEXT,
    "accountHolder" TEXT,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KRW',
    "method" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT,
    "providerResponse" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "refundAmount" DECIMAL(10,2),
    "refundReason" TEXT,
    "refundedAt" TIMESTAMP(3),
    "refundId" TEXT,
    "receiptUrl" TEXT,
    "invoiceNumber" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WebhookLog" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT,
    "provider" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmailTemplate" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "bodyHtml" TEXT NOT NULL,
    "bodyText" TEXT,
    "type" TEXT NOT NULL,
    "variables" JSONB NOT NULL DEFAULT '[]',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomForm" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fields" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "relatedType" TEXT,
    "relatedId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SmsLog" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "recipientName" TEXT,
    "registrationId" TEXT,
    "eventId" TEXT,
    "message" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "templateId" TEXT,
    "provider" TEXT NOT NULL,
    "providerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "cost" DECIMAL(10,2),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmsLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FileUpload" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" BIGINT NOT NULL,
    "storageProvider" TEXT NOT NULL DEFAULT 'local',
    "filePath" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "eventId" TEXT,
    "registrationId" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "virusScanStatus" TEXT,
    "virusScanAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orgId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Analytics" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "eventId" TEXT,
    "date" DATE NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "registrationStarts" INTEGER NOT NULL DEFAULT 0,
    "registrationCompletes" INTEGER NOT NULL DEFAULT 0,
    "revenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "hourlyData" JSONB,
    "sourceData" JSONB,
    "deviceData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "OrganizationMember_orgId_idx" ON "public"."OrganizationMember"("orgId");

-- CreateIndex
CREATE INDEX "OrganizationMember_userId_idx" ON "public"."OrganizationMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_userId_orgId_key" ON "public"."OrganizationMember"("userId", "orgId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "public"."Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "public"."Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_customDomain_key" ON "public"."Organization"("customDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_orgId_key" ON "public"."Subscription"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_customDomain_key" ON "public"."Event"("customDomain");

-- CreateIndex
CREATE INDEX "Event_orgId_idx" ON "public"."Event"("orgId");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "public"."Event"("status");

-- CreateIndex
CREATE INDEX "Event_startDate_idx" ON "public"."Event"("startDate");

-- CreateIndex
CREATE UNIQUE INDEX "Event_orgId_slug_key" ON "public"."Event"("orgId", "slug");

-- CreateIndex
CREATE INDEX "Program_eventId_idx" ON "public"."Program"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Program_eventId_code_key" ON "public"."Program"("eventId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountCode_code_key" ON "public"."DiscountCode"("code");

-- CreateIndex
CREATE INDEX "DiscountCode_eventId_idx" ON "public"."DiscountCode"("eventId");

-- CreateIndex
CREATE INDEX "DiscountCode_code_idx" ON "public"."DiscountCode"("code");

-- CreateIndex
CREATE INDEX "DiscountCode_validFrom_validUntil_idx" ON "public"."DiscountCode"("validFrom", "validUntil");

-- CreateIndex
CREATE UNIQUE INDEX "CustomDomain_domain_key" ON "public"."CustomDomain"("domain");

-- CreateIndex
CREATE INDEX "CustomDomain_orgId_idx" ON "public"."CustomDomain"("orgId");

-- CreateIndex
CREATE INDEX "CustomDomain_eventId_idx" ON "public"."CustomDomain"("eventId");

-- CreateIndex
CREATE INDEX "CustomDomain_domain_idx" ON "public"."CustomDomain"("domain");

-- CreateIndex
CREATE INDEX "CustomDomain_status_idx" ON "public"."CustomDomain"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_registrationNumber_key" ON "public"."Registration"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_qrCode_key" ON "public"."Registration"("qrCode");

-- CreateIndex
CREATE INDEX "Registration_eventId_idx" ON "public"."Registration"("eventId");

-- CreateIndex
CREATE INDEX "Registration_userId_idx" ON "public"."Registration"("userId");

-- CreateIndex
CREATE INDEX "Registration_email_idx" ON "public"."Registration"("email");

-- CreateIndex
CREATE INDEX "Registration_status_idx" ON "public"."Registration"("status");

-- CreateIndex
CREATE INDEX "Participant_registrationId_idx" ON "public"."Participant"("registrationId");

-- CreateIndex
CREATE INDEX "Participant_email_idx" ON "public"."Participant"("email");

-- CreateIndex
CREATE INDEX "ProgramParticipation_programId_idx" ON "public"."ProgramParticipation"("programId");

-- CreateIndex
CREATE INDEX "ProgramParticipation_registrationId_idx" ON "public"."ProgramParticipation"("registrationId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramParticipation_programId_registrationId_key" ON "public"."ProgramParticipation"("programId", "registrationId");

-- CreateIndex
CREATE INDEX "Waitlist_programId_status_position_idx" ON "public"."Waitlist"("programId", "status", "position");

-- CreateIndex
CREATE INDEX "Waitlist_registrationId_idx" ON "public"."Waitlist"("registrationId");

-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_programId_registrationId_key" ON "public"."Waitlist"("programId", "registrationId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "public"."Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "PaymentAccount_orgId_idx" ON "public"."PaymentAccount"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentAccount_orgId_provider_key" ON "public"."PaymentAccount"("orgId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_registrationId_key" ON "public"."Payment"("registrationId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "public"."Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_providerId_idx" ON "public"."Payment"("providerId");

-- CreateIndex
CREATE INDEX "WebhookLog_paymentId_idx" ON "public"."WebhookLog"("paymentId");

-- CreateIndex
CREATE INDEX "WebhookLog_provider_eventType_idx" ON "public"."WebhookLog"("provider", "eventType");

-- CreateIndex
CREATE INDEX "EmailTemplate_orgId_idx" ON "public"."EmailTemplate"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_orgId_type_key" ON "public"."EmailTemplate"("orgId", "type");

-- CreateIndex
CREATE INDEX "CustomForm_orgId_idx" ON "public"."CustomForm"("orgId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "public"."Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_relatedType_relatedId_idx" ON "public"."Notification"("relatedType", "relatedId");

-- CreateIndex
CREATE INDEX "SmsLog_orgId_idx" ON "public"."SmsLog"("orgId");

-- CreateIndex
CREATE INDEX "SmsLog_registrationId_idx" ON "public"."SmsLog"("registrationId");

-- CreateIndex
CREATE INDEX "SmsLog_status_idx" ON "public"."SmsLog"("status");

-- CreateIndex
CREATE INDEX "SmsLog_createdAt_idx" ON "public"."SmsLog"("createdAt");

-- CreateIndex
CREATE INDEX "FileUpload_orgId_idx" ON "public"."FileUpload"("orgId");

-- CreateIndex
CREATE INDEX "FileUpload_entityType_entityId_idx" ON "public"."FileUpload"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "FileUpload_uploadedBy_idx" ON "public"."FileUpload"("uploadedBy");

-- CreateIndex
CREATE INDEX "FileUpload_isDeleted_idx" ON "public"."FileUpload"("isDeleted");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "public"."ActivityLog"("userId");

-- CreateIndex
CREATE INDEX "ActivityLog_orgId_idx" ON "public"."ActivityLog"("orgId");

-- CreateIndex
CREATE INDEX "ActivityLog_entityType_entityId_idx" ON "public"."ActivityLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "public"."ActivityLog"("createdAt");

-- CreateIndex
CREATE INDEX "Analytics_orgId_idx" ON "public"."Analytics"("orgId");

-- CreateIndex
CREATE INDEX "Analytics_eventId_idx" ON "public"."Analytics"("eventId");

-- CreateIndex
CREATE INDEX "Analytics_date_idx" ON "public"."Analytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Analytics_orgId_eventId_date_key" ON "public"."Analytics"("orgId", "eventId", "date");

-- AddForeignKey
ALTER TABLE "public"."OrganizationMember" ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationMember" ADD CONSTRAINT "OrganizationMember_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Organization" ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_customFormId_fkey" FOREIGN KEY ("customFormId") REFERENCES "public"."CustomForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Program" ADD CONSTRAINT "Program_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiscountCode" ADD CONSTRAINT "DiscountCode_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomDomain" ADD CONSTRAINT "CustomDomain_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomDomain" ADD CONSTRAINT "CustomDomain_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Registration" ADD CONSTRAINT "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Registration" ADD CONSTRAINT "Registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Participant" ADD CONSTRAINT "Participant_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "public"."Registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProgramParticipation" ADD CONSTRAINT "ProgramParticipation_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProgramParticipation" ADD CONSTRAINT "ProgramParticipation_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "public"."Registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Waitlist" ADD CONSTRAINT "Waitlist_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Waitlist" ADD CONSTRAINT "Waitlist_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "public"."Registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentAccount" ADD CONSTRAINT "PaymentAccount_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "public"."Registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebhookLog" ADD CONSTRAINT "WebhookLog_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EmailTemplate" ADD CONSTRAINT "EmailTemplate_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomForm" ADD CONSTRAINT "CustomForm_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmsLog" ADD CONSTRAINT "SmsLog_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileUpload" ADD CONSTRAINT "FileUpload_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileUpload" ADD CONSTRAINT "FileUpload_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileUpload" ADD CONSTRAINT "FileUpload_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "public"."Registration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityLog" ADD CONSTRAINT "ActivityLog_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
