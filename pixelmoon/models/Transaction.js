const mongoose = require('mongoose');
// UPDATED 2025-08-15 — Added indexes for performance on userId and createdAt
const schema = new mongoose.Schema({
  userId: String,
  method: String,
  amount: Number,
  raw: {},
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
schema.index({ userId: 1, createdAt: -1 });
schema.index({ createdAt: -1 });
schema.pre('save', function(next){ this.updatedAt = new Date(); next(); });
module.exports = mongoose.model('Transaction', schema);
