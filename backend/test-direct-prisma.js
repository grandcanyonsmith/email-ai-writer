const { PrismaClient } = require('@prisma/client');

async function testDirectPrisma() {
  try {
    console.log('Testing direct Prisma initialization...');
    console.log('PrismaClient:', typeof PrismaClient);
    
    const prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
    
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
    console.error('Direct Prisma test failed:', error);
    console.error('Error stack:', error.stack);
  }
}

testDirectPrisma(); 