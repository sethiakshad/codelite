const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectMongo } = require('./db');
const User = require('./models/User');
const Food = require('./models/Food');

const app = express();
// Allow all origins temporarily to fix the Network Error
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

// Log all incoming requests for debugging in Vercel Logs
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Note: Disk storage won't work on Vercel's read-only filesystem.
// For production, use Cloudinary or Vercel Blob. 
// Switching to memory storage for now to prevent crashes.
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve static files
app.use('/uploads', express.static('uploads'));

const SECRET_KEY = 'supersecretkey'; // In real app use .env

app.get('/', (req, res) => {
    res.send('FoodLink API Server is running!');
});

// --- AUTH (SQL) ---
app.post('/api/register', upload.single('certificate'), async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Since we switched to memoryStorage for Vercel, req.file.path is undefined.
        // We'll store a placeholder string for now.
        const certificatePath = req.file ? `memory://${req.file.originalname}` : null;

        if (!req.file && role !== 'admin') {
            return res.status(400).json({ error: 'Certificate/ID upload is required for donors and NGOs' });
        }

        // Set approval status: admin is auto-approved, donors and NGOs need approval
        const approvalStatus = role === 'admin' ? 'approved' : 'pending';

        const user = await User.create({
            username,
            password: hashedPassword,
            role,
            certificate: certificatePath,
            approvalStatus
        });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role, approvalStatus: user.approvalStatus }, SECRET_KEY);

        if (role === 'admin') {
            res.status(201).json({
                message: 'User created successfully',
                token,
                username: user.username,
                role: user.role,
                approvalStatus: user.approvalStatus
            });
        } else {
            res.status(201).json({
                message: 'Registration submitted! Your profile is pending admin approval.',
                username: user.username,
                role: user.role,
                approvalStatus: user.approvalStatus
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if user is approved (except admin)
        if (user.approvalStatus === 'pending') {
            return res.status(403).json({ error: 'Your account is pending admin approval. Please wait for approval.' });
        }
        if (user.approvalStatus === 'rejected') {
            return res.status(403).json({ error: 'Your account has been rejected by admin. Please contact support.' });
        }

        const token = jwt.sign({ id: user._id, username: user.username, role: user.role, approvalStatus: user.approvalStatus }, SECRET_KEY);
        res.json({ token, username: user.username, role: user.role, approvalStatus: user.approvalStatus });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- FOOD (Mongo) ---
app.get('/api/food', async (req, res) => {
    try {
        // Fetch all food
        const foods = await Food.find({ status: 'available' }).sort({ createdAt: -1 });
        res.json(foods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get food by specific user
app.get('/api/food/user/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const foods = await Food.find({ postedBy: username }).sort({ createdAt: -1 });
        res.json(foods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADMIN: Get pending users (for approval)
app.get('/api/admin/users/pending', async (req, res) => {
    try {
        const users = await User.find({ approvalStatus: 'pending' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADMIN: Get all users (for management)
app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADMIN: Delete a user
app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADMIN: Approve or reject user
app.put('/api/admin/users/:id/:status', async (req, res) => {
    try {
        const { id, status } = req.params;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.approvalStatus = status;
        await user.save();
        res.json({ message: `User ${status}`, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ADMIN: Get pending food
app.get('/api/admin/food/pending', async (req, res) => {
    try {
        const foods = await Food.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.json(foods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADMIN: Approve/Reject food
app.put('/api/admin/food/:id/:status', async (req, res) => {
    try {
        const { id, status } = req.params;
        const food = await Food.findByIdAndUpdate(id, { status }, { new: true });
        res.json(food);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/food', async (req, res) => {
    try {
        // In a real app, verify token middleware would go here
        // Default status is 'available' - food is directly posted without admin approval
        const food = new Food(req.body);
        await food.save();
        res.status(201).json(food);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;

// Export app for Vercel
module.exports = app;

// Only listen if not in a serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);

        // Connect to Databases
        try {
            await connectMongo();
        } catch (error) {
            console.error('Initial DB connection failed:', error);
        }
    });
}
