import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      id: 'test-user-id',
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: '$2a$10$example', // placeholder hash
      trustScore: 4.0,
      contributionCount: 5,
      isVerified: true,
    },
  });

  // Create test sauna
  const sauna = await prisma.sauna.upsert({
    where: { id: 'test-sauna-id' },
    update: {},
    create: {
      id: 'test-sauna-id',
      name: 'テストサウナ',
      address: '東京都渋谷区テスト1-1-1',
      latitude: 35.6762,
      longitude: 139.6503,
      phone: '03-1234-5678',
      website: 'https://example.com',
      description: 'テスト用のサウナです',
      priceRange: '1000-2000円',
      rating: 4.5,
      reviewCount: 10,
    },
  });

  // Create test ladies day
  const ladiesDay = await prisma.ladiesDay.upsert({
    where: { id: 'test-ladies-day-id' },
    update: {},
    create: {
      id: 'test-ladies-day-id',
      saunaId: sauna.id,
      dayOfWeek: new Date().getDay(), // Today's day of week
      startTime: '10:00',
      endTime: '16:00',
      isOfficial: true,
      sourceType: 'OFFICIAL',
      sourceUserId: user.id,
      trustScore: 4.5,
      supportCount: 8,
      oppositionCount: 1,
    },
  });

  console.log('Database seeded successfully');
  console.log('Created user:', user.username);
  console.log('Created sauna:', sauna.name);
  console.log('Created ladies day for day:', ladiesDay.dayOfWeek);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });