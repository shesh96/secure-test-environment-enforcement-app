const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const EventLog = require('./models/EventLog');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
    try {
        const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/secure-exam';
        await mongoose.connect(connStr);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
    }
};

// Routes
app.post('/api/logs/batch', async (req, res) => {
    const { logs } = req.body;

    if (!logs || !Array.isArray(logs) || logs.length === 0) {
        return res.status(400).json({ message: 'No logs provided' });
    }

    try {
        await EventLog.insertMany(logs);
        console.log(`Received batch of ${logs.length} logs for attempt ${logs[0]?.attemptId}`);
        res.status(200).json({ message: 'Logs synced successfully' });
    } catch (error) {
        console.error('Error saving logs:', error);
        res.status(500).json({ message: 'Server error saving logs' });
    }
});

app.get('/api/logs', async (req, res) => {
    const { attemptId } = req.query;
    try {
        const query = attemptId ? { attemptId } : {};
        // Limit to last 100 logs to prevent payload issues
        const logs = await EventLog.find(query).sort({ timestamp: -1 }).limit(100);
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Error fetching logs' });
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});


// Start Server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});
