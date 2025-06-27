// Set the DATABASE_URL explicitly
process.env.DATABASE_URL = "postgresql://postgres:WaThDbWjbCeMQIIkbNyxMZLBifkTXdfJ@maglev.proxy.rlwy.net:24201/railway";

const { PrismaClient } = require('@prisma/client');

async function testEnvPrisma() {
  try {
    console.log('Testing Prisma with explicit DATABASE_URL...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
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
    console.error('Env Prisma test failed:', error);
    console.error('Error stack:', error.stack);
  }
}

testEnvPrisma(); 