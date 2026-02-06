const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: [{
        name: String,
        quantity: String,
        isVeg: { type: String, enum: ['Veg', 'Non-Veg'], default: 'Veg' },
        needsRefrigeration: { type: String, enum: ['Yes', 'No'], default: 'No' }
    }],
    location: String,
    description: String,
    postedBy: String, // Username or ID from SQL
    status: { type: String, enum: ['pending', 'available', 'claimed', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', FoodSchema);
