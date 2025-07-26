const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const FriendRequest = sequelize.define('FriendRequest', {
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('pending', 'accepted', 'cancelled'),
    defaultValue: 'pending'
  }
  
}, {
  timestamps: true
});

module.exports = FriendRequest;
