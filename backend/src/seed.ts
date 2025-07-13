import { PrismaClient } from './generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test users
  const passwordHash = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.create({
    data: {
      username: 'sauna_lover',
      email: 'sauna@example.com',
      passwordHash,
      trustScore: 4.2,
      contributionCount: 5,
    }
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'onsen_fan',
      email: 'onsen@example.com',
      passwordHash,
      trustScore: 3.8,
      contributionCount: 3,
    }
  });

  // Create notification settings for users
  await prisma.notificationSettings.create({
    data: {
      userId: user1.id,
    }
  });

  await prisma.notificationSettings.create({
    data: {
      userId: user2.id,
    }
  });

  // Create test saunas
  const sauna1 = await prisma.sauna.create({
    data: {
      name: 'スカイスパYOKOHAMA',
      address: '神奈川県横浜市西区高島2-19-12',
      latitude: 35.4658,
      longitude: 139.6201,
      phone: '045-465-2614',
      website: 'https://www.skyspa.co.jp/',
      description: '横浜駅直結の都市型スパリゾート。地上14階からの絶景が楽しめます。',
      priceRange: '2,750円',
      rating: 4.3,
      reviewCount: 125,
      facilities: {
        create: [
          {
            name: '高温サウナ',
            category: 'SAUNA',
            temperature: 90,
            description: '本格フィンランドサウナ',
            isWomenOnly: false
          },
          {
            name: '水風呂',
            category: 'BATH',
            temperature: 16,
            description: '冷たい水風呂でととのう',
            isWomenOnly: false
          },
          {
            name: '外気浴エリア',
            category: 'OTHER',
            description: '横浜の夜景を眺めながらの外気浴',
            isWomenOnly: false
          },
          {
            name: '女性専用エリア',
            category: 'OTHER',
            description: '女性だけの安心空間',
            isWomenOnly: true
          }
        ]
      }
    }
  });

  const sauna2 = await prisma.sauna.create({
    data: {
      name: 'ラクーア',
      address: '東京都文京区春日1-1-1',
      latitude: 35.7056,
      longitude: 139.7520,
      phone: '03-3817-4173',
      website: 'https://www.laqua.jp/',
      description: '東京ドームシティの天然温泉施設。都心のオアシスで癒しのひとときを。',
      priceRange: '2,900円',
      rating: 4.1,
      reviewCount: 98,
      facilities: {
        create: [
          {
            name: '高温サウナ',
            category: 'SAUNA',
            temperature: 85,
            description: 'ドライサウナ',
            isWomenOnly: false
          },
          {
            name: '塩サウナ',
            category: 'SAUNA',
            temperature: 50,
            description: '塩を使った低温サウナ',
            isWomenOnly: false
          },
          {
            name: '水風呂',
            category: 'BATH',
            temperature: 18,
            description: '天然水を使用',
            isWomenOnly: false
          },
          {
            name: 'メイクルーム',
            category: 'AMENITY',
            description: '化粧直し用の設備完備',
            isWomenOnly: true
          }
        ]
      }
    }
  });

  const sauna3 = await prisma.sauna.create({
    data: {
      name: 'おふろの王様 大井町店',
      address: '東京都品川区大井1-50-5',
      latitude: 35.6056,
      longitude: 139.7320,
      phone: '03-3779-7777',
      website: 'https://www.ousama2603.com/',
      description: 'リーズナブルな価格で楽しめる日帰り温泉施設。',
      priceRange: '1,200円',
      rating: 3.8,
      reviewCount: 56,
      facilities: {
        create: [
          {
            name: '遠赤外線サウナ',
            category: 'SAUNA',
            temperature: 80,
            description: '遠赤外線でじんわり温まる',
            isWomenOnly: false
          },
          {
            name: '水風呂',
            category: 'BATH',
            temperature: 20,
            description: '程よい冷たさ',
            isWomenOnly: false
          }
        ]
      }
    }
  });

  // Create ladies days
  await prisma.ladiesDay.create({
    data: {
      saunaId: sauna1.id,
      dayOfWeek: 2, // Tuesday
      startTime: '10:00',
      endTime: '18:00',
      isOfficial: true,
      sourceType: 'OFFICIAL',
      trustScore: 5.0,
      supportCount: 15,
      oppositionCount: 0
    }
  });

  await prisma.ladiesDay.create({
    data: {
      saunaId: sauna2.id,
      dayOfWeek: 0, // Sunday
      startTime: '09:00',
      endTime: '24:00',
      isOfficial: false,
      sourceType: 'USER',
      sourceUserId: user1.id,
      trustScore: 4.2,
      supportCount: 8,
      oppositionCount: 1
    }
  });

  // Create today's ladies day for demo
  const today = new Date();
  await prisma.ladiesDay.create({
    data: {
      saunaId: sauna1.id,
      specificDate: today,
      startTime: '10:00',
      endTime: '22:00',
      isOfficial: false,
      sourceType: 'USER',
      sourceUserId: user2.id,
      trustScore: 3.8,
      supportCount: 5,
      oppositionCount: 0
    }
  });

  // Create some reviews
  await prisma.review.create({
    data: {
      saunaId: sauna1.id,
      userId: user1.id,
      rating: 5,
      title: '最高のレディースデイ体験！',
      content: 'お風呂もサウナも最高でした。女性専用エリアがとても清潔で安心して利用できました。景色も素晴らしく、また来たいと思います。',
      visitDate: new Date('2025-07-10'),
      visibility: 'PUBLIC',
      likeCount: 12
    }
  });

  await prisma.review.create({
    data: {
      saunaId: sauna2.id,
      userId: user2.id,
      rating: 4,
      title: 'アクセス良好',
      content: '駅から近くて便利。サウナの温度もちょうど良く、水風呂も気持ち良かったです。メイクルームが綺麗で助かりました。',
      visitDate: new Date('2025-07-05'),
      visibility: 'PUBLIC',
      likeCount: 7
    }
  });

  // Create favorites
  await prisma.favorite.create({
    data: {
      userId: user1.id,
      saunaId: sauna1.id
    }
  });

  await prisma.favorite.create({
    data: {
      userId: user1.id,
      saunaId: sauna2.id
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${await prisma.user.count()} users`);
  console.log(`Created ${await prisma.sauna.count()} saunas`);
  console.log(`Created ${await prisma.ladiesDay.count()} ladies days`);
  console.log(`Created ${await prisma.review.count()} reviews`);
  console.log(`Created ${await prisma.favorite.count()} favorites`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });