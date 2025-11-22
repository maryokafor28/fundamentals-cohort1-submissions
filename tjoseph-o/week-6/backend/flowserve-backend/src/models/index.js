const User = require('./user');
const Transaction = require('./transaction');

// Set up associations
User.hasMany(Transaction, {
  foreignKey: 'userId',
  as: 'transactions'
});

Transaction.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Transaction.belongsTo(User, {
  foreignKey: 'recipientId',
  as: 'recipient'
});

module.exports = {
  User,
  Transaction
};