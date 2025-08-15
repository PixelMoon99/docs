const mongoose = require('mongoose');
const ApiUsageSchema = new mongoose.Schema({
  apiKey: { type: mongoose.Schema.Types.ObjectId, ref: 'ApiKey' },
  route: String,
  method: String,
  ip: String,
  userAgent: String,
  status: Number,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ApiUsage', ApiUsageSchema);
