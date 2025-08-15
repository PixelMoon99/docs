const mongoose = require('mongoose');
const crypto = require('crypto');

const ApiKeySchema = new mongoose.Schema({
  name: { type: String, required: true },
  hashedKey: { type: String, required: true },
  prefix: { type: String, required: true, index: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scopes: [String],
  revoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
  usageCount: { type: Number, default: 0 },
  lastUsedAt: { type: Date, default: null },
  // ip control
  ipMode: { type: String, enum: ['none','whitelist','blacklist'], default: 'none' },
  ipList: { type: [String], default: [] }
});

ApiKeySchema.methods.verify = function(keyPlain) {
  const h = crypto.createHash('sha256').update(keyPlain).digest('hex');
  return h === this.hashedKey && !this.revoked && (!this.expiresAt || this.expiresAt > new Date());
};

module.exports = mongoose.model('ApiKey', ApiKeySchema);
