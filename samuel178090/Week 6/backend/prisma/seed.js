import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 12);
    const userPassword = await bcrypt.hash('password123', 12);

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@flowserve.com' },
        update: {},
        create: {
            firstName: 'Admin',
            LastName: 'User',
            phone: '01000000000',
            email: 'admin@flowserve.com',
            username: 'admin',
            password: adminPassword,
            nationalID: '00000000000000',
            birthdate: new Date('1980-01-01'),
            balance: 999999.0,
            role: 'ADMIN'
        }
    });

    // Create test users
    const users = [
        {
            firstName: 'John',
            LastName: 'Doe',
            phone: '01234567890',
            email: 'john.doe@example.com',
            username: 'johndoe',
            password: userPassword,
            nationalID: '12345678901234',
            birthdate: new Date('1990-01-01'),
            balance: 1000.0
        },
        {
            firstName: 'Jane',
            LastName: 'Smith',
            phone: '01987654321',
            email: 'jane.smith@example.com',
            username: 'janesmith',
            password: userPassword,
            nationalID: '98765432109876',
            birthdate: new Date('1992-05-15'),
            balance: 750.0
        },
        {
            firstName: 'Bob',
            LastName: 'Johnson',
            phone: '01555666777',
            email: 'bob.johnson@example.com',
            username: 'bobjohnson',
            password: userPassword,
            nationalID: '55566677788899',
            birthdate: new Date('1988-12-03'),
            balance: 1250.0
        }
    ];

    for (const userData of users) {
        await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: userData
        });
    }

    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin: admin@flowserve.com / admin123');
    console.log('👥 Test users created with password: password123');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });