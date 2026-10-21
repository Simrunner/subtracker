const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/preferences', async (req, res) => {
  try {
    const { currency, timezone, emailNotifications, alertDaysBefore } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        currency,
        timezone,
        emailNotifications,
        alertDaysBefore,
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
