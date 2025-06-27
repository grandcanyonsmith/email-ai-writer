const { PrismaClient } = require('@prisma/client');

async function testPrisma() {
  try {
    console.log('Testing Prisma initialization...');
    const prisma = new PrismaClient();
    console.log('Prisma client created successfully');
    
    // Test database connection
    await prisma.$connect();
    console.log('Database connection successful');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
    await prisma.$disconnect();
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Prisma test failed:', error);
  }
}

testPrisma(); 