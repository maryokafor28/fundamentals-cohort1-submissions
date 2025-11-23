const userService = require('./users.service');
const UserModel = require('./users.model');

jest.mock('../../src/modules/users/users.model');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should throw an error if email is missing', async () => {
      await expect(userService.createUser({})).rejects.toThrow('Email is required');
    });

    it('should throw an error if user already exists', async () => {
      UserModel.findByEmail.mockResolvedValue({id: 1, email: 'existing@example.com'});
      await expect(userService.createUser({email: 'existing@example.com'}))
        .rejects.toThrow('User already exists');
    });

    it('should create a new user if email does not exist', async () => {
      UserModel.findByEmail.mockResolvedValue(null);
      UserModel.create.mockResolvedValue({id: 2, email: 'new@example.com'});

      const result = await userService.createUser({email: 'new@example.com'});
      expect(result).toEqual({id: 2, email: 'new@example.com'});
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {id: 1, email: 'a@example.com'},
        {id: 2, email: 'b@example.com'},
      ];
      UserModel.findAll.mockResolvedValue(mockUsers);

      const result = await userService.getUsers();

      expect(result).toEqual(mockUsers);
      expect(UserModel.findAll).toHaveBeenCalledTimes(1);
    });
  });
});

module.exports = new userService();