const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Friend = sequelize.define('Friend', {
  userId1: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId2: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Friend;
