const express = require('express');
const cors = require('cors');
require('dotenv').config();

const subscriptionsRouter = require('./routes/subscriptions');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.use('/api/subscriptions', subscriptionsRouter);

app.listen(PORT, () => {
  console.log(`SubTracker server running on port ${PORT}`);
});
