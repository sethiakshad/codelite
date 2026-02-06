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
    },
    approvalStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'approved' // Admin is auto-approved, others set to pending in registration
    }
});

module.exports = User;
