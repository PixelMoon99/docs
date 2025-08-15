const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  tier: { type: String, enum: ['tier1','tier2','tier3'], required: true },
  name: String,
  ordersRequired: Number,
  windowDays: Number,
  price: Number,
  durationDays: Number,
  badgeColor: String
});
module.exports = mongoose.model('VIPTier', schema);
