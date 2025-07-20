import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test table exists
    const userCount = await prisma.user.count();
    console.log(`✅ User table exists with ${userCount} records`);
    
    const saunaCount = await prisma.sauna.count();
    console.log(`✅ Sauna table exists with ${saunaCount} records`);
    
    const ladiesDayCount = await prisma.ladiesDay.count();
    console.log(`✅ LadiesDay table exists with ${ladiesDayCount} records`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();