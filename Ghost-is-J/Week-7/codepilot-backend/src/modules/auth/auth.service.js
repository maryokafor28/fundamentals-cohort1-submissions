const bcrypt = require('bcryptjs');
const jwtUtil = require('../../utils/jwt');
const UserModel = require('../users/users.model');

class AuthService {
  async register(data) {
    if (!data.email || !data.password) throw new Error('Email and password required');
    const exists = await UserModel.findByEmail(data.email);
    if (exists) throw new Error('User already exists');
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await UserModel.create({email: data.email, password: hashed});
    return {id: user.id, email: user.email};
  }

  async login(data) {
    const user = await UserModel.findByEmail(data.email);
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    const token = jwtUtil.signToken({id: user.id, email: user.email});
    return {token};
  }
}

module.exports = new AuthService();
