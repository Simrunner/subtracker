const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  supabase_user_id: { type: String, required: true, index: true },
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  billingCycle: { type: String, enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'], required: true },
  category: { type: String, required: true },
  renewalDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'cancelled', 'paused'], default: 'active' },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
