const mongoose = require('mongoose');
const path = require('path');

// Mongo Connection
const connectMongo = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.error('CRITICAL: MONGODB_URI is not defined in environment variables!');
            return;
        }

        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000 // 5 second timeout
        });
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        throw err; // Rethrow to let the caller handle it
    }
};

module.exports = { connectMongo };
