import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

const TransactionModel = (sequelize, User) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    type: {
      type: DataTypes.ENUM('credit', 'debit'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
      get() {
        const rawValue = this.getDataValue('amount');
        return rawValue !== null ? parseFloat(rawValue) : 0;
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'successful', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'transactions',
    hooks: {
      beforeCreate: (transaction) => {
        if (!transaction.id) {
          transaction.id = uuidv4();
        }
        if (!transaction.timestamp) {
          transaction.timestamp = new Date();
        }
      },
      beforeUpdate: (transaction) => {
        if (typeof transaction.amount === 'number') {
          transaction.amount = transaction.amount.toFixed(2);
        }
      },
    },
  });

  Transaction.associate = () => {
    Transaction.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Transaction;
};

export default TransactionModel;
