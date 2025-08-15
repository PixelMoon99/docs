const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  code: { type: String, unique: true },
  name: String,
  price: Number,
  description: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  active: { type: Boolean, default: true }
});
module.exports = mongoose.model('Voucher', schema);
