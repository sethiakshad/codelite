const mongoose = require('mongoose');
const path = require('path');

// Mongo Connection
const connectMongo = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodlink';
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.log('MongoDB Connection Error. If deployed, check MONGODB_URI env var:', err.message);
    }
};

module.exports = { connectMongo };
