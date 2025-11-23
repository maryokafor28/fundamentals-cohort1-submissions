const UserService = require('../../src/modules/users/users.service');
const UserModel = require('../../src/modules/users/users.model');

//jestConfig.mock('../../src/modules/users/users.model');

describe('UserService (unit)', () => {
  beforeEach(() => UserModel.clear());

  test('creates a user successfully', async () => {
    const data = { email: 'test@example.com', name: 'Test' };
    const user = await UserService.createUser(data);
    expect(user).toMatchObject(data);
  });

  test('throws error for missing email', async () => {
    await expect(UserService.createUser({name: 'NoEmail'})).rejects.toThrow('Email is required');
  });
});
