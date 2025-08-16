const mongoose = require('mongoose');
// UPDATED 2025-01-27 — Added VIP tiers, milestones, username, and additional user fields
const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: false },
  role: { type: String, default: 'user', enum: ['user', 'admin', 'master'] },
  isAdmin: { type: Boolean, default: false },
  isMasterAdmin: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  isVip: { type: Boolean, default: false },
  vipTier: { type: String, default: null, enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] },
  vipStart: { type: Date, default: null },
  vipEnd: { type: Date, default: null },
  vipDuration: { type: Number, default: 0 }, // days
  vipMilestone: { type: Number, default: 0 }, // milestone progress
  vipMilestoneThreshold: { type: Number, default: 1000 },
  blocked: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  lastLogin: { type: Date, default: null },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for performance
schema.index({ email: 1 });
schema.index({ username: 1 });
schema.index({ isVip: 1, vipEnd: 1 });
schema.index({ vipMilestone: 1 });
schema.index({ createdAt: -1 });

// Update timestamp on save
schema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', schema);
