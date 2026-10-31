const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/profile', async (req, res) => {
  try {
    let user = await User.findOne({ supabase_user_id: req.userId });
    if (!user) {
      user = new User({
        supabase_user_id: req.userId,
        email: req.userEmail,
        currency: 'USD',
        timezone: 'UTC',
      });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/preferences', async (req, res) => {
  try {
    const { currency, timezone, emailNotifications, alertDaysBefore } = req.body;

    let user = await User.findOne({ supabase_user_id: req.userId });
    if (!user) {
      user = new User({
        supabase_user_id: req.userId,
        email: req.userEmail,
      });
    }

    user.currency = currency || user.currency;
    user.timezone = timezone || user.timezone;
    if (emailNotifications !== undefined) user.emailNotifications = emailNotifications;
    if (alertDaysBefore !== undefined) user.alertDaysBefore = alertDaysBefore;
    user.updatedAt = new Date();

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
