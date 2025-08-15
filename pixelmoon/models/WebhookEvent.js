const mongoose = require('mongoose');
// UPDATED 2025-08-15 — Added unique compound index for idempotent webhook processing
const schema = new mongoose.Schema({
  gateway: { type: String, required: true },
  eventId: { type: String, required: true },
  payload: {},
  processedAt: { type: Date, default: Date.now }
});
schema.index({ gateway: 1, eventId: 1 }, { unique: true });
module.exports = mongoose.model('WebhookEvent', schema);
