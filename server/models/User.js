const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  supabase_user_id: { type: String, required: true, unique: true, index: true },
  email: String,
  firstName: String,
  lastName: String,
  currency: { type: String, default: 'USD' },
  timezone: { type: String, default: 'UTC' },
  emailNotifications: { type: Boolean, default: true },
  alertDaysBefore: { type: Number, default: 3 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
