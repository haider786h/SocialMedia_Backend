const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize; // adjust if needed

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'comments'
});

module.exports = Comment;
