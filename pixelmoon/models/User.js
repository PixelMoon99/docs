const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: String, default: 'user' },
  isAdmin: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  isVip: { type: Boolean, default: false },
  vipTier: { type: String, default: null },
  vipStart: { type: Date, default: null },
  vipEnd: { type: Date, default: null },
  blocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', schema);
