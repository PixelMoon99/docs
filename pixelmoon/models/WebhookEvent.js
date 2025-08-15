const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  gateway: String,
  eventId: String,
  raw: {},
  receivedAt: Date
});
module.exports = mongoose.model('WebhookEvent', schema);
