import sequelize from '../config/database.js';
import UserModel from './User.js';
import TransactionModel from './Transaction.js';

const User = UserModel(sequelize);
const Transaction = TransactionModel(sequelize, User);

User.hasMany(Transaction, {
  foreignKey: 'userId',
  as: 'transactions',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Transaction.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

const db = {
  sequelize,
  Sequelize: sequelize.Sequelize,
  User,
  Transaction,
};

export { sequelize, User, Transaction };
export default db;
