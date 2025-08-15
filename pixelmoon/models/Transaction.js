const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  userId: String,
  method: String,
  amount: Number,
  raw: {},
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
schema.pre('save', function(next){ this.updatedAt = new Date(); next(); });
module.exports = mongoose.model('Transaction', schema);
