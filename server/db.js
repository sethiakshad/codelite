const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
const path = require('path');

// Mongo Connection
const connectMongo = async () => {
    try {
        // Assuming local mongo or use connection string from env
        // Using a generic local URI. If user doesn't have mongo running, this will fail but catch block catches it.
        await mongoose.connect('mongodb://127.0.0.1:27017/foodlink');
        console.log('MongoDB Connected');
    } catch (err) {
        console.log('MongoDB Connection Error (Ensure MongoDB is running):', err.message);
    }
};

// SQL Connection (SQLite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'), // Store in server dir
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
