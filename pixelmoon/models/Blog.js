const mongoose = require('mongoose');
// UPDATED 2025-01-27 — Added content, author, and additional blog fields
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  imageUrl: String,
  description: String,
  tags: { type: [String], default: [] },
  meta: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String,
    canonicalUrl: String
  },
  author: { type: String, default: null },
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date, default: null }
});

// Indexes for performance
schema.index({ slug: 1 });
schema.index({ published: 1, createdAt: -1 });
schema.index({ tags: 1 });
schema.index({ featured: 1 });

// Update timestamp on save
schema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Blog', schema);