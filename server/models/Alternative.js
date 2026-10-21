const mongoose = require('mongoose');

const alternativeSchema = new mongoose.Schema({
  originalService: String,
  alternativeName: String,
  category: String,
  costPerMonth: Number,
  features: [String],
  pros: [String],
  cons: [String],
  yearlySavings: Number,
  url: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Alternative', alternativeSchema);
