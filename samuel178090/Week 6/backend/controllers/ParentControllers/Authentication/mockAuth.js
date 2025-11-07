import bcrypt from 'bcrypt';
import { createJWT, comparePassword } from '../../../helpers.js';
import logger from '../../../middleware/logger.js';

// Mock authentication for development
const mockUsers = new Map();

// Add admin user
const adminUser = {
    UID: 'admin-001',
    firstName: 'Admin',
    LastName: 'User',
    phone: '01000000000',
    email: 'admin@flowserve.com',
    username: 'admin',
    password: '$2b$12$DkHn41bgTZZegv1KWZE3eOLnnKiegC4tCWVAppplV.KzM3FC0Gj2m', // 'admin123'
    nationalID: '00000000000000',
    birthdate: new Date('1980-01-01'),
    balance: 999999.0,
    role: 'ADMIN',
    createdAt: new Date(),
    updatedAt: new Date()
};

// Add sample user
const sampleUser = {
    UID: 'user-123',
    firstName: 'John',
    LastName: 'Doe',
    phone: '01234567890',
    email: 'john.doe@example.com',
    username: 'johndoe',
    password: '$2b$12$YIrG8T3WNA19no1YqcdaEeMIReKCCYxND6QlhtFvQn5p7LL4fzeY6', // 'password123'
    nationalID: '12345678901234',
    birthdate: new Date('1990-01-01'),
    balance: 1000.0,
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date()
};

// Add more test users
const testUsers = [
    {
        UID: 'user-456',
        firstName: 'Jane',
        LastName: 'Smith',
        phone: '01987654321',
        email: 'jane.smith@example.com',
        username: 'janesmith',
        password: '$2b$12$YIrG8T3WNA19no1YqcdaEeMIReKCCYxND6QlhtFvQn5p7LL4fzeY6', // 'password123'
        nationalID: '98765432109876',
        birthdate: new Date('1992-05-15'),
        balance: 750.0,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        UID: 'user-789',
        firstName: 'Bob',
        LastName: 'Johnson',
        phone: '01555666777',
        email: 'bob.johnson@example.com',
        username: 'bobjohnson',
        password: '$2b$12$YIrG8T3WNA19no1YqcdaEeMIReKCCYxND6QlhtFvQn5p7LL4fzeY6', // 'password123'
        nationalID: '55566677788899',
        birthdate: new Date('1988-12-03'),
        balance: 1250.0,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

// Store admin user
mockUsers.set(adminUser.phone, adminUser);
mockUsers.set(adminUser.email, adminUser);
mockUsers.set(adminUser.username, adminUser);

// Store sample user
mockUsers.set(sampleUser.phone, sampleUser);
mockUsers.set(sampleUser.username, sampleUser);
mockUsers.set(sampleUser.email, sampleUser);

// Store test users
testUsers.forEach(user => {
    mockUsers.set(user.phone, user);
    mockUsers.set(user.email, user);
    mockUsers.set(user.username, user);
});

export async function mockLogin(req, res) {
    try {
        const { phone, email, password } = req.body;
        const identifier = phone || email;

        if (!identifier || !password) {
            return res.status(400).json({
                error: 'Phone/email and password are required'
            });
        }

        // Find user by phone or email
        const user = mockUsers.get(identifier);
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Check password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Create JWT token
        const token = createJWT({
            id: user.UID,
            username: user.username,
            role: user.role || 'USER'
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        logger.info('Mock login successful', { userId: user.UID, username: user.username });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        logger.error('Mock login error', { error: error.message });
        return res.status(500).json({
            error: 'Login failed. Please try again.'
        });
    }
}

export async function mockRegister(req, res) {
    try {
        const userData = req.body;

        // Simple validation
        if (!userData.phone || !userData.password || !userData.firstName) {
            return res.status(400).json({
                error: 'Phone, password, and first name are required'
            });
        }

        // Check if user already exists
        if (mockUsers.has(userData.phone)) {
            return res.status(409).json({
                error: 'User already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create new user
        const newUser = {
            UID: `user-${Date.now()}`,
            firstName: userData.firstName,
            LastName: userData.LastName || '',
            phone: userData.phone,
            email: userData.email || `${userData.phone}@example.com`,
            username: userData.username || `user${Date.now()}`,
            password: hashedPassword,
            nationalID: userData.nationalID || '00000000000000',
            birthdate: new Date(userData.birthdate || '1990-01-01'),
            balance: 0.0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Store user
        mockUsers.set(newUser.phone, newUser);
        mockUsers.set(newUser.username, newUser);
        mockUsers.set(newUser.email, newUser);

        // Create JWT token
        const token = createJWT({
            id: newUser.UID,
            username: newUser.username,
            role: 'USER'
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        logger.info('Mock registration successful', { userId: newUser.UID, username: newUser.username });

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        logger.error('Mock registration error', { error: error.message });
        return res.status(500).json({
            error: 'Registration failed. Please try again.'
        });
    }
}