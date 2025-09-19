import { PrismaClient, UserRole, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data in correct order
  await prisma.webhookLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.waitlist.deleteMany();
  await prisma.programParticipation.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.fileUpload.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.discountCode.deleteMany();
  await prisma.program.deleteMany();
  await prisma.customDomain.deleteMany();
  await prisma.event.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.smsLog.deleteMany();
  await prisma.emailTemplate.deleteMany();
  await prisma.customForm.deleteMany();
  await prisma.paymentAccount.deleteMany();
  await prisma.analytics.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleaned existing data');

  // Create Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@platform.com',
      name: '플랫폼 관리자',
      password: await bcrypt.hash('admin123!', 10),
      role: UserRole.SUPER_ADMIN,
      emailVerified: new Date(),
      phone: '010-1234-5678',
      isActive: true,
    },
  });

  // Organization 1: Seoul UBF
  const org1Owner = await prisma.user.create({
    data: {
      email: 'owner@seoulubf.org',
      name: '김요한',
      password: await bcrypt.hash('seoul123!', 10),
      role: UserRole.ORG_OWNER,
      emailVerified: new Date(),
      phone: '010-2222-3333',
      isActive: true,
    },
  });

  const org1Admin = await prisma.user.create({
    data: {
      email: 'admin@seoulubf.org',
      name: '이사라',
      password: await bcrypt.hash('seoul123!', 10),
      role: UserRole.ORG_ADMIN,
      emailVerified: new Date(),
      phone: '010-3333-4444',
      isActive: true,
    },
  });

  const org1 = await prisma.organization.create({
    data: {
      slug: 'seoul-ubf',
      name: '서울 UBF',
      nameEn: 'Seoul UBF',
      description: '서울 대학생성경읽기선교회',
      ownerId: org1Owner.id,
      email: 'info@seoulubf.org',
      phone: '02-1234-5678',
      address: {
        street: '서울시 종로구 대학로 123',
        city: '서울',
        country: '대한민국',
        postal: '03134',
      },
      timezone: 'Asia/Seoul',
      locale: 'ko',
      primaryColor: '#1a73e8',
      logo: '/logos/seoul-ubf.png',
      isActive: true,
      isVerified: true,
      settings: {
        defaultCurrency: 'KRW',
        emailSender: 'noreply@seoulubf.org',
      },
      features: {
        customDomain: true,
        emailAutomation: true,
        advancedAnalytics: true,
        apiAccess: true,
      },
    },
  });

  // Add members to org1
  await prisma.organizationMember.createMany({
    data: [
      {
        userId: org1Owner.id,
        orgId: org1.id,
        role: UserRole.ORG_OWNER,
        permissions: {
          all: true,
        },
        acceptedAt: new Date(),
        isActive: true,
      },
      {
        userId: org1Admin.id,
        orgId: org1.id,
        role: UserRole.ORG_ADMIN,
        permissions: {
          events: { create: true, edit: true, delete: true, publish: true },
          registrations: { view: true, approve: true, export: true },
          payments: { view: true },
          settings: { team: true },
        },
        acceptedAt: new Date(),
        isActive: true,
      },
    ],
  });

  // Create subscription for org1
  const org1Subscription = await prisma.subscription.create({
    data: {
      orgId: org1.id,
      plan: SubscriptionPlan.PRO,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      maxEvents: 10,
      maxParticipants: 1000,
      maxAdmins: 10,
      storageLimit: BigInt(10 * 1024 * 1024 * 1024), // 10GB
      billingCycle: 'yearly',
      price: 1200000,
      currency: 'KRW',
      features: {
        customDomain: true,
        emailAutomation: true,
        advancedAnalytics: true,
        apiAccess: true,
        whiteLabel: false,
        maxCustomForms: 10,
        maxEmailTemplates: 20,
        supportLevel: 'premium',
      },
    },
  });

  // Organization 2: Incheon UBF
  const org2Owner = await prisma.user.create({
    data: {
      email: 'owner@incheonubf.org',
      name: '박바울',
      password: await bcrypt.hash('incheon123!', 10),
      role: UserRole.ORG_OWNER,
      emailVerified: new Date(),
      phone: '010-5555-6666',
      isActive: true,
    },
  });

  const org2 = await prisma.organization.create({
    data: {
      slug: 'incheon-ubf',
      name: '인천 UBF',
      nameEn: 'Incheon UBF',
      description: '인천 대학생성경읽기선교회',
      ownerId: org2Owner.id,
      email: 'info@incheonubf.org',
      phone: '032-8765-4321',
      address: {
        street: '인천시 남동구 대학로 456',
        city: '인천',
        country: '대한민국',
        postal: '21999',
      },
      timezone: 'Asia/Seoul',
      locale: 'ko',
      primaryColor: '#34a853',
      logo: '/logos/incheon-ubf.png',
      isActive: true,
      isVerified: true,
      settings: {
        defaultCurrency: 'KRW',
        emailSender: 'noreply@incheonubf.org',
      },
      features: {
        customDomain: false,
        emailAutomation: true,
        advancedAnalytics: false,
        apiAccess: false,
      },
    },
  });

  // Add owner to org2
  await prisma.organizationMember.create({
    data: {
      userId: org2Owner.id,
      orgId: org2.id,
      role: UserRole.ORG_OWNER,
      permissions: {
        all: true,
      },
      acceptedAt: new Date(),
      isActive: true,
    },
  });

  // Create subscription for org2
  const org2Subscription = await prisma.subscription.create({
    data: {
      orgId: org2.id,
      plan: SubscriptionPlan.BASIC,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      maxEvents: 3,
      maxParticipants: 200,
      maxAdmins: 5,
      storageLimit: BigInt(2 * 1024 * 1024 * 1024), // 2GB
      billingCycle: 'monthly',
      price: 50000,
      currency: 'KRW',
      features: {
        customDomain: false,
        emailAutomation: true,
        advancedAnalytics: false,
        apiAccess: false,
        whiteLabel: false,
        maxCustomForms: 3,
        maxEmailTemplates: 5,
        supportLevel: 'basic',
      },
    },
  });

  // Create custom form for org1
  const org1Form = await prisma.customForm.create({
    data: {
      orgId: org1.id,
      name: '세계선교대회 등록 폼',
      description: '2026 세계선교대회 참가자 등록을 위한 커스텀 폼',
      fields: [
        {
          id: 'church',
          type: 'text',
          label: '소속 교회',
          labelEn: 'Church Name',
          required: true,
          validation: {
            minLength: 2,
            maxLength: 100,
          },
        },
        {
          id: 'meal',
          type: 'select',
          label: '식사 옵션',
          labelEn: 'Meal Option',
          options: [
            { value: 'regular', label: '일반' },
            { value: 'vegetarian', label: '채식' },
            { value: 'halal', label: '할랄' },
          ],
          required: false,
        },
        {
          id: 'accommodation',
          type: 'checkbox',
          label: '숙박 필요',
          labelEn: 'Need Accommodation',
          required: false,
        },
      ],
      isActive: true,
    },
  });

  // Create Event 1 for org1: 2026 World Mission Conference
  const event1 = await prisma.event.create({
    data: {
      orgId: org1.id,
      slug: 'wmc-2026',
      title: '2026 세계선교대회',
      titleEn: '2026 World Mission Conference',
      description: '전 세계 UBF 선교사와 목자들이 모이는 세계선교대회입니다.',
      descriptionEn: 'World Mission Conference gathering UBF missionaries and shepherds from around the world.',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-08-07'),
      registrationStart: new Date('2026-01-01'),
      registrationEnd: new Date('2026-07-15'),
      earlyBirdEnd: new Date('2026-03-31'),
      venue: '서울 COEX',
      venueAddress: {
        street: '서울시 강남구 영동대로 513',
        city: '서울',
        country: '대한민국',
        postal: '06164',
      },
      maxParticipants: 5000,
      basePrice: 300000,
      earlyBirdPrice: 250000,
      currency: 'KRW',
      status: 'published',
      visibility: 'public',
      requiresApproval: false,
      customFormId: org1Form.id,
      tags: ['conference', 'mission', 'global'],
      createdBy: org1Admin.id,
      metadata: {
        expectedCountries: 95,
        simultaneousTranslation: ['ko', 'en', 'es', 'ru', 'zh'],
      },
    },
  });

  // Create programs for event1
  const program1 = await prisma.program.create({
    data: {
      eventId: event1.id,
      code: 'MAIN',
      title: '메인 컨퍼런스',
      titleEn: 'Main Conference',
      description: '전체 참가자가 함께하는 메인 세션',
      startTime: new Date('2026-08-02T09:00:00'),
      endTime: new Date('2026-08-06T18:00:00'),
      location: 'Grand Ballroom',
      maxCapacity: 5000,
      price: null, // Included in event price
      isRequired: true,
      allowWaitlist: false,
    },
  });

  const program2 = await prisma.program.create({
    data: {
      eventId: event1.id,
      code: 'WORKSHOP',
      title: '선교 워크샵',
      titleEn: 'Mission Workshop',
      description: '지역별 선교 전략 워크샵',
      startTime: new Date('2026-08-03T14:00:00'),
      endTime: new Date('2026-08-03T17:00:00'),
      location: 'Conference Room A-E',
      maxCapacity: 500,
      price: 50000,
      isRequired: false,
      allowWaitlist: true,
    },
  });

  // Create discount codes for event1
  await prisma.discountCode.create({
    data: {
      eventId: event1.id,
      code: 'EARLY2026',
      description: '조기등록 추가 할인',
      discountType: 'percentage',
      discountValue: 10,
      maxUses: 1000,
      currentUses: 0,
      maxUsesPerUser: 1,
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-03-31'),
      isActive: true,
    },
  });

  await prisma.discountCode.create({
    data: {
      eventId: event1.id,
      code: 'STUDENT50',
      description: '학생 50% 할인',
      discountType: 'percentage',
      discountValue: 50,
      maxUses: 500,
      currentUses: 0,
      maxUsesPerUser: 1,
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-07-15'),
      conditions: {
        requiresVerification: true,
        verificationDocument: 'student_id',
      },
      isActive: true,
    },
  });

  // Create Event 2 for org1: Spring Bible Conference
  const event2 = await prisma.event.create({
    data: {
      orgId: org1.id,
      slug: 'spring-2026',
      title: '2026 봄 성경학교',
      titleEn: '2026 Spring Bible Conference',
      description: '봄학기 성경공부 집중 훈련 프로그램',
      descriptionEn: 'Intensive Spring semester Bible study training program',
      startDate: new Date('2026-03-20'),
      endDate: new Date('2026-03-22'),
      registrationStart: new Date('2026-01-15'),
      registrationEnd: new Date('2026-03-10'),
      earlyBirdEnd: new Date('2026-02-20'),
      venue: '서울 UBF 센터',
      venueAddress: {
        street: '서울시 종로구 대학로 123',
        city: '서울',
        country: '대한민국',
        postal: '03134',
      },
      maxParticipants: 300,
      basePrice: 50000,
      earlyBirdPrice: 40000,
      currency: 'KRW',
      status: 'published',
      visibility: 'public',
      requiresApproval: false,
      tags: ['bible', 'training', 'spring'],
      createdBy: org1Admin.id,
    },
  });

  // Create Event 3 for org2: Regional Conference
  const event3 = await prisma.event.create({
    data: {
      orgId: org2.id,
      slug: 'regional-2026',
      title: '2026 인천지역 연합수양회',
      titleEn: '2026 Incheon Regional Conference',
      description: '인천 지역 교회 연합 수양회',
      descriptionEn: 'Incheon regional churches united conference',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-05-03'),
      registrationStart: new Date('2026-02-01'),
      registrationEnd: new Date('2026-04-20'),
      venue: '인천 청소년수련원',
      venueAddress: {
        street: '인천시 서구 검단로 123',
        city: '인천',
        country: '대한민국',
        postal: '22700',
      },
      maxParticipants: 200,
      basePrice: 80000,
      currency: 'KRW',
      status: 'published',
      visibility: 'public',
      requiresApproval: true,
      tags: ['regional', 'conference'],
      createdBy: org2Owner.id,
    },
  });

  // Create programs for event3
  await prisma.program.create({
    data: {
      eventId: event3.id,
      code: 'MAIN',
      title: '주제 강의',
      titleEn: 'Main Lectures',
      description: '연합수양회 주제 강의',
      startTime: new Date('2026-05-01T19:00:00'),
      endTime: new Date('2026-05-03T12:00:00'),
      location: '대강당',
      maxCapacity: 200,
      isRequired: true,
      allowWaitlist: false,
    },
  });

  // Create Event 4 for org2: Youth Camp
  const event4 = await prisma.event.create({
    data: {
      orgId: org2.id,
      slug: 'youth-camp-2026',
      title: '2026 청년 여름 캠프',
      titleEn: '2026 Youth Summer Camp',
      description: '대학생과 청년을 위한 여름 캠프',
      descriptionEn: 'Summer camp for college students and young adults',
      startDate: new Date('2026-07-20'),
      endDate: new Date('2026-07-25'),
      registrationStart: new Date('2026-04-01'),
      registrationEnd: new Date('2026-07-10'),
      earlyBirdEnd: new Date('2026-05-31'),
      venue: '강원도 평창 리조트',
      venueAddress: {
        street: '강원도 평창군 대관령면 올림픽로 715',
        city: '평창',
        country: '대한민국',
        postal: '25354',
      },
      maxParticipants: 150,
      basePrice: 200000,
      earlyBirdPrice: 170000,
      currency: 'KRW',
      status: 'draft',
      visibility: 'private',
      requiresApproval: true,
      tags: ['youth', 'summer', 'camp'],
      createdBy: org2Owner.id,
    },
  });

  // Create some participants
  const participant1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.PARTICIPANT,
      emailVerified: new Date(),
      phone: '010-7777-8888',
      isActive: true,
    },
  });

  const participant2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.PARTICIPANT,
      emailVerified: new Date(),
      phone: '010-8888-9999',
      isActive: true,
    },
  });

  // Create sample registrations for event1
  const registration1 = await prisma.registration.create({
    data: {
      eventId: event1.id,
      userId: participant1.id,
      type: 'individual',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '010-7777-8888',
      baseAmount: 250000, // Early bird price
      discountAmount: 25000, // 10% discount
      discountReason: 'EARLY2026 코드 적용',
      totalAmount: 225000,
      status: 'confirmed',
      requiresApproval: false,
      customFormData: {
        church: 'Seoul Central Church',
        meal: 'regular',
        accommodation: true,
      },
      qrCode: 'QR-WMC2026-001',
    },
  });

  // Create participant details
  await prisma.participant.create({
    data: {
      registrationId: registration1.id,
      firstName: 'John',
      lastName: 'Doe',
      firstNameEn: 'John',
      lastNameEn: 'Doe',
      email: 'john.doe@example.com',
      phone: '010-7777-8888',
      nationality: 'USA',
      organization: 'Seoul Central Church',
      position: 'Member',
      dietaryRestrictions: 'None',
    },
  });

  // Create program participation
  await prisma.programParticipation.create({
    data: {
      programId: program1.id,
      registrationId: registration1.id,
      status: 'registered',
    },
  });

  // Create payment for registration1
  await prisma.payment.create({
    data: {
      registrationId: registration1.id,
      amount: 225000,
      currency: 'KRW',
      method: 'card',
      provider: 'toss',
      providerId: 'toss_payment_001',
      status: 'completed',
      receiptUrl: 'https://receipt.toss.im/001',
      metadata: {
        cardNumber: '**** **** **** 1234',
        cardType: 'VISA',
      },
    },
  });

  // Create email templates for org1
  await prisma.emailTemplate.create({
    data: {
      orgId: org1.id,
      name: '등록 확인 이메일',
      subject: '[{{event_title}}] 등록이 완료되었습니다',
      bodyHtml: `
        <h2>안녕하세요, {{name}}님!</h2>
        <p>{{event_title}} 등록이 성공적으로 완료되었습니다.</p>
        <p>등록번호: {{registration_number}}</p>
        <p>행사 일정: {{event_date}}</p>
        <p>장소: {{venue}}</p>
        <p>감사합니다.</p>
      `,
      bodyText: `
        안녕하세요, {{name}}님!
        {{event_title}} 등록이 성공적으로 완료되었습니다.
        등록번호: {{registration_number}}
        행사 일정: {{event_date}}
        장소: {{venue}}
        감사합니다.
      `,
      type: 'registration_confirmation',
      variables: ['name', 'event_title', 'registration_number', 'event_date', 'venue'],
      isActive: true,
    },
  });

  // Create payment accounts for organizations
  await prisma.paymentAccount.create({
    data: {
      orgId: org1.id,
      provider: 'toss',
      isActive: true,
      isDefault: true,
      merchantId: 'seoul-ubf-merchant',
      apiKey: 'encrypted_api_key_here',
      secretKey: 'encrypted_secret_key_here',
      bankName: '국민은행',
      bankAccount: '123-456-789012',
      accountHolder: '서울UBF',
      settings: {
        autoCapture: true,
        webhookUrl: 'https://api.seoulubf.org/webhooks/toss',
      },
    },
  });

  await prisma.paymentAccount.create({
    data: {
      orgId: org2.id,
      provider: 'portone',
      isActive: true,
      isDefault: true,
      merchantId: 'incheon-ubf-merchant',
      apiKey: 'encrypted_api_key_here',
      secretKey: 'encrypted_secret_key_here',
      bankName: '신한은행',
      bankAccount: '987-654-321098',
      accountHolder: '인천UBF',
      settings: {
        pgProvider: 'nice',
      },
    },
  });

  // Create sample activity logs
  await prisma.activityLog.create({
    data: {
      userId: org1Admin.id,
      orgId: org1.id,
      action: 'create',
      entityType: 'event',
      entityId: event1.id,
      newValues: {
        title: '2026 세계선교대회',
        status: 'published',
      },
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
    },
  });

  // Create sample analytics
  await prisma.analytics.create({
    data: {
      orgId: org1.id,
      eventId: event1.id,
      date: new Date('2026-01-15'),
      pageViews: 1250,
      uniqueVisitors: 423,
      registrationStarts: 87,
      registrationCompletes: 45,
      revenue: 11250000,
      sourceData: {
        direct: 234,
        organic: 156,
        social: 33,
      },
      deviceData: {
        desktop: 267,
        mobile: 145,
        tablet: 11,
      },
    },
  });

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: participant1.id,
      type: 'email',
      title: '등록 완료',
      content: '2026 세계선교대회 등록이 완료되었습니다.',
      isRead: true,
      readAt: new Date(),
      relatedType: 'registration',
      relatedId: registration1.id,
    },
  });

  // Create custom domains
  await prisma.customDomain.create({
    data: {
      orgId: org1.id,
      eventId: event1.id,
      domain: 'wmc2026.org',
      type: 'EVENT',
      isPrimary: true,
      status: 'VERIFIED',
      verifiedAt: new Date(),
      sslEnabled: true,
      sslStatus: 'active',
      forceHttps: true,
      customBranding: {
        logo: 'https://wmc2026.org/logo.png',
        primaryColor: '#FF6B35',
        favicon: 'https://wmc2026.org/favicon.ico',
      },
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('📊 Created:');
  console.log('   - 2 Organizations (Seoul UBF, Incheon UBF)');
  console.log('   - 4 Events (2 per organization)');
  console.log('   - 6 Users (super admin, 2 owners, 1 admin, 2 participants)');
  console.log('   - Sample registrations, payments, and related data');
  console.log('\n🔐 Login credentials:');
  console.log('   Super Admin: admin@platform.com / admin123!');
  console.log('   Seoul UBF Owner: owner@seoulubf.org / seoul123!');
  console.log('   Seoul UBF Admin: admin@seoulubf.org / seoul123!');
  console.log('   Incheon UBF Owner: owner@incheonubf.org / incheon123!');
  console.log('   Participant: john.doe@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });