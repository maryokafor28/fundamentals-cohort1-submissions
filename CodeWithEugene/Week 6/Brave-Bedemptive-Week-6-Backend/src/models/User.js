import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

const UserModel = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
      get() {
        const rawValue = this.getDataValue('balance');
        return rawValue !== null ? parseFloat(rawValue) : 0;
      },
    },
  }, {
    tableName: 'users',
    hooks: {
      beforeCreate: (user) => {
        if (!user.id) {
          user.id = uuidv4();
        }
      },
      beforeUpdate: (user) => {
        if (typeof user.balance === 'number') {
          user.balance = user.balance.toFixed(2);
        }
      },
    },
  });

  return User;
};

export default UserModel;
