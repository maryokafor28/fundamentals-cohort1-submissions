const authService = require('../../src/modules/auth/auth.service');




beforeEach(() => {
  authService.clearUsers(); 
});

describe('Auth Service', () => {
  test('register() should create a user', async () => {
    const result = await authService.register({
      email: 'alice@example.com',
      password: 'password123',
      name: 'Alice Doe',
    });

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('email', 'alice@example.com');
    expect(authService.getUserCount()).toBe(1);
  });

  test('register() should throw if email already exists', async () => {
    await authService.register({
      email: 'alice@example.com',
      password: 'password123',
      name: 'Alice Doe',
    });

    await expect(
      authService.register({
        email: 'alice@example.com',
        password: 'anotherpass',
        name: 'Alice 2',
      })
    ).rejects.toThrow('User with this email already exists');
  });

  test('login() should return token for valid credentials', async () => {
    await authService.register({
      email: 'bob@example.com',
      password: 'mypassword',
      name: 'Bob Doe',
    });

    const result = await authService.login('bob@example.com', 'mypassword');
    expect(result).toHaveProperty('token');
    expect(result.user).toHaveProperty('email', 'bob@example.com');
  });

  test('login() should throw for invalid credentials', async () => {
    await authService.register({
      email: 'bob@example.com',
      password: 'mypassword',
      name: 'Bob Doe',
    });

    await expect(authService.login('bob@example.com', 'wrongpass')).rejects.toThrow(
      'Invalid credentials'
    );
  });
});
