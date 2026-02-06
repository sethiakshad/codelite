const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('donor', 'ngo', 'admin'),
        defaultValue: 'donor'
    },
    certificate: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = User;
