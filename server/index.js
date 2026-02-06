const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectMongo, connectSQL, sequelize } = require('./db');
const User = require('./models/User');
const Food = require('./models/Food');

const app = express();
app.use(cors());
app.use(express.json());

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
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

        const certificatePath = req.file ? req.file.path : null;

        if (!certificatePath) {
            return res.status(400).json({ error: 'Certificate/ID upload is required' });
        }

        const user = await User.create({
            username,
            password: hashedPassword,
            role,
            certificate: certificatePath
        });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY);
        res.status(201).json({
            message: 'User created successfully',
            token,
            username: user.username,
            role: user.role
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY);
        res.json({ token, username: user.username, role: user.role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- FOOD (Mongo) ---
app.get('/api/food', async (req, res) => {
    try {
        // Fetch all food
        const foods = await Food.find().sort({ createdAt: -1 });
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

app.post('/api/food', async (req, res) => {
    try {
        // In a real app, verify token middleware would go here
        const food = new Food(req.body);
        await food.save();
        res.status(201).json(food);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // Connect to Databases
    await connectMongo();
    await connectSQL();

    // Sync SQL models
    await sequelize.sync({ alter: true });
    console.log('SQL Database synced');
});
