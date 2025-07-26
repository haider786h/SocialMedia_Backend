const {DataTypes} = require('sequelize')
const sequelize = require('../config/db').sequelize

const User = sequelize.define('User', {
    name : {
        type : DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
      },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      }
      
}, {
    // tableName : 'users',
    timestamps : true
})

module.exports = User;