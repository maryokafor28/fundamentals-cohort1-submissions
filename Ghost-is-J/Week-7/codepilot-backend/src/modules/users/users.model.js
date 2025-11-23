const users = [];

class UserModel {
  static async create(user) {
    const id = users.length + 1;
    const newUser = { id, ...user };
    users.push(newUser);
    return newUser;
  }

  static async findAll() {
    return users;
  }

  static async findByEmail(email) {
    return users.find((u) => u.email === email);
  }

  static async clear() {
    users.length = 0;
  }
}

module.exports = UserModel;
