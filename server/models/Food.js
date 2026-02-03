const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    title: { type: String, required: true },
    quantity: String,
    location: String,
    description: String,
    postedBy: String, // Username or ID from SQL
    status: { type: String, enum: ['available', 'claimed'], default: 'available' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', FoodSchema);
