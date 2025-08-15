const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  filename: String,
  path: String,
  mimetype: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: String
});
module.exports = mongoose.model('Media', schema);
