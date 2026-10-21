const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const subscriptionsRouter = require('./routes/subscriptions');
const authRouter = require('./routes/auth');
const recommendationsRouter = require('./routes/recommendations');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/subtracker';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.use('/api/auth', authRouter);
app.use('/api/subscriptions', authMiddleware, subscriptionsRouter);
app.use('/api/recommendations', authMiddleware, recommendationsRouter);

app.listen(PORT, () => {
  console.log(`SubTracker server running on port ${PORT}`);
});
