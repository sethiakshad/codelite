const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
const path = require('path');

// Mongo Connection
const connectMongo = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodlink';
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.log('MongoDB Connection Error:', err.message);
    }
};

// SQL Connection (SQLite)
const sqlitePath = process.env.SQLITE_PATH || path.join(__dirname, 'database.sqlite');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: sqlitePath,
    logging: false
});

const connectSQL = async () => {
    try {
        await sequelize.authenticate();
        console.log('SQLite Connected');
    } catch (err) {
        console.error('SQLite Connection Error:', err);
    }
};

module.exports = { connectMongo, connectSQL, sequelize };
