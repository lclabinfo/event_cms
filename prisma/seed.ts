import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.payment.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.program.deleteMany();
  await prisma.event.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  console.log("🗑️  Cleaned existing data");

  // Create organizations
  const ubfKorea = await prisma.organization.create({
    data: {
      id: "org-korea-001",
      slug: "ubf-korea",
      name: "Korea UBF",
      domain: "ubf.or.kr",
      domainVerified: true,
      subscriptionTier: "premium",
      settings: {
        primaryColor: "#1e40af",
        logoUrl: "/logos/ubf-korea.png",
        timezone: "Asia/Seoul",
        currency: "KRW",
      },
    },
  });

  const ubfWorld = await prisma.organization.create({
    data: {
      id: "org-world-001",
      slug: "ubf-world",
      name: "UBF World Mission",
      domain: "ubf.org",
      domainVerified: true,
      subscriptionTier: "enterprise",
      settings: {
        primaryColor: "#059669",
        logoUrl: "/logos/ubf-world.png",
        timezone: "America/Chicago",
        currency: "USD",
      },
    },
  });

  console.log("🏢 Created organizations");

  // Create admin user
  const hashedAdminPassword = await bcrypt.hash("Admin123!", 10);
  const adminUser = await prisma.user.create({
    data: {
      id: "user-admin-001",
      email: "admin@ubf.org",
      name: "System Admin",
      password: hashedAdminPassword,
      role: "admin",
      emailVerified: new Date(),
      orgId: ubfKorea.id,
    },
  });

  // Create staff user
  const hashedStaffPassword = await bcrypt.hash("Staff123!", 10);
  const staffUser = await prisma.user.create({
    data: {
      id: "user-staff-001",
      email: "staff@ubf.org",
      name: "Event Staff",
      password: hashedStaffPassword,
      role: "staff",
      emailVerified: new Date(),
      orgId: ubfKorea.id,
    },
  });

  // Create regular user
  const hashedUserPassword = await bcrypt.hash("User123!", 10);
  const regularUser = await prisma.user.create({
    data: {
      id: "user-regular-001",
      email: "user@example.com",
      name: "John Doe",
      password: hashedUserPassword,
      role: "user",
      emailVerified: new Date(),
      orgId: ubfKorea.id,
    },
  });

  console.log("👤 Created users:");
  console.log("   Admin: admin@ubf.org / Admin123!");
  console.log("   Staff: staff@ubf.org / Staff123!");
  console.log("   User: user@example.com / User123!");

  // Create World Mission Conference event
  const wmcEvent = await prisma.event.create({
    data: {
      id: "event-wmc-2024",
      orgId: ubfKorea.id,
      slug: "wmc-2024",
      nameKo: "2024 세계선교대회",
      nameEn: "2024 World Mission Conference",
      nameEs: "Conferencia Mundial de Misión 2024",
      descriptionKo: "전 세계 UBF 선교사와 목자들이 모이는 세계선교대회",
      descriptionEn: "World Mission Conference gathering UBF missionaries and shepherds from around the world",
      descriptionEs: "Conferencia Mundial de Misión que reúne a misioneros y pastores de UBF de todo el mundo",
      startDate: new Date("2024-08-01"),
      endDate: new Date("2024-08-05"),
      registrationStart: new Date("2024-03-01"),
      registrationEnd: new Date("2024-07-15"),
      maxParticipants: 5000,
      location: "Seoul, Korea",
      status: "published",
      settings: {
        earlyBirdDiscount: 0.2,
        groupDiscount: 0.1,
        requiresApproval: false,
      },
    },
  });

  // Create Missionary Retreat event
  const retreatEvent = await prisma.event.create({
    data: {
      id: "event-retreat-2024",
      orgId: ubfKorea.id,
      slug: "missionary-retreat-2024",
      nameKo: "2024 선교사 수양회",
      nameEn: "2024 Missionary Retreat",
      nameEs: "Retiro Misionero 2024",
      descriptionKo: "선교사들을 위한 특별 수양회",
      descriptionEn: "Special retreat for missionaries",
      descriptionEs: "Retiro especial para misioneros",
      startDate: new Date("2024-07-28"),
      endDate: new Date("2024-07-31"),
      registrationStart: new Date("2024-03-01"),
      registrationEnd: new Date("2024-07-10"),
      maxParticipants: 1000,
      location: "Jeju Island, Korea",
      status: "published",
      settings: {
        earlyBirdDiscount: 0.15,
        requiresApproval: true,
      },
    },
  });

  console.log("📅 Created events");

  // Create programs for WMC
  const wmcFullProgram = await prisma.program.create({
    data: {
      id: "prog-wmc-full",
      eventId: wmcEvent.id,
      code: "WMC-FULL",
      nameKo: "전체 프로그램",
      nameEn: "Full Program",
      nameEs: "Programa Completo",
      descriptionKo: "모든 세션 및 숙박 포함",
      descriptionEn: "All sessions and accommodation included",
      descriptionEs: "Todas las sesiones y alojamiento incluidos",
      price: 500000,
      earlyBirdPrice: 400000,
      earlyBirdDeadline: new Date("2024-05-31"),
      maxCapacity: 3000,
      currentParticipants: 0,
    },
  });

  const wmcDayProgram = await prisma.program.create({
    data: {
      id: "prog-wmc-day",
      eventId: wmcEvent.id,
      code: "WMC-DAY",
      nameKo: "일일 참가",
      nameEn: "Day Pass",
      nameEs: "Pase Diario",
      descriptionKo: "일일 참가권 (숙박 미포함)",
      descriptionEn: "Day pass (accommodation not included)",
      descriptionEs: "Pase diario (alojamiento no incluido)",
      price: 100000,
      earlyBirdPrice: 80000,
      earlyBirdDeadline: new Date("2024-05-31"),
      maxCapacity: 2000,
      currentParticipants: 0,
    },
  });

  const tourProgram = await prisma.program.create({
    data: {
      id: "prog-tour-seoul",
      eventId: wmcEvent.id,
      code: "TOUR-SEOUL",
      nameKo: "서울 투어",
      nameEn: "Seoul Tour",
      nameEs: "Tour de Seúl",
      descriptionKo: "대회 후 서울 관광 프로그램",
      descriptionEn: "Seoul sightseeing tour after conference",
      descriptionEs: "Tour turístico de Seúl después de la conferencia",
      price: 150000,
      maxCapacity: 500,
      currentParticipants: 0,
    },
  });

  // Create programs for Retreat
  const retreatFullProgram = await prisma.program.create({
    data: {
      id: "prog-retreat-full",
      eventId: retreatEvent.id,
      code: "RETREAT-FULL",
      nameKo: "전체 수양회",
      nameEn: "Full Retreat",
      nameEs: "Retiro Completo",
      descriptionKo: "3박 4일 전체 프로그램",
      descriptionEn: "3 nights 4 days full program",
      descriptionEs: "Programa completo de 3 noches y 4 días",
      price: 300000,
      earlyBirdPrice: 250000,
      earlyBirdDeadline: new Date("2024-05-31"),
      maxCapacity: 800,
      currentParticipants: 0,
    },
  });

  console.log("🎯 Created programs");

  // Create sample registrations
  const registration1 = await prisma.registration.create({
    data: {
      id: "reg-001",
      orgId: ubfKorea.id,
      eventId: wmcEvent.id,
      userId: regularUser.id,
      registrationType: "individual",
      totalAmount: 400000,
      discountAmount: 100000,
      status: "confirmed",
      confirmationCode: "WMC2024-001",
      metadata: {
        registeredAt: new Date(),
        earlyBird: true,
      },
    },
  });

  // Create participant for registration
  await prisma.participant.create({
    data: {
      id: "part-001",
      registrationId: registration1.id,
      programId: wmcFullProgram.id,
      nameKo: "홍길동",
      nameEn: "John Doe",
      email: "user@example.com",
      phone: "+82-10-1234-5678",
      birthDate: new Date("1990-01-15"),
      gender: "male",
      nationality: "KR",
      dietaryRestrictions: "None",
      emergencyContact: {
        name: "Jane Doe",
        phone: "+82-10-9876-5432",
        relationship: "Spouse",
      },
    },
  });

  // Create payment for registration
  await prisma.payment.create({
    data: {
      id: "pay-001",
      orgId: ubfKorea.id,
      registrationId: registration1.id,
      amount: 400000,
      currency: "KRW",
      paymentMethod: "card",
      provider: "toss",
      providerPaymentId: "TOSS-2024-001",
      status: "completed",
      metadata: {
        cardLastFour: "1234",
        cardType: "Visa",
      },
    },
  });

  console.log("📝 Created sample registrations and payments");
  console.log("\n✅ Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });