const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  imageUrl: String,
  description: String,
  tags: { type: [String], default: [] },
  meta: {
    title: String,
    description: String,
    keywords: [String]
  },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Blog', schema);