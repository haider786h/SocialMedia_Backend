const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Post = sequelize.define('Post', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image : {
    type : DataTypes.STRING,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
   timestamps: true
});

module.exports = Post;
