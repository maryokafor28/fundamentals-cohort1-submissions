const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  // Create regular user
  const userPassword = await bcrypt.hash('User123!', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      role: 'USER'
    }
  });

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the task management system',
        userId: user.id,
        completed: false
      },
      {
        title: 'Review security implementation',
        description: 'Audit the JWT implementation and RBAC system',
        userId: admin.id,
        completed: true
      },
      {
        title: 'Setup CI/CD pipeline',
        description: 'Configure automated testing and deployment',
        userId: user.id,
        completed: false
      }
    ]
  });

  console.log('Database seeded successfully!');
  console.log('Test accounts:');
  console.log('Admin: admin@example.com / Admin123!');
  console.log('User: user@example.com / User123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });