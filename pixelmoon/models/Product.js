const mongoose = require('mongoose');
// UPDATED 2025-01-27 — Created Product model for e-commerce functionality
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD', enum: ['USD', 'INR'] },
  originalPrice: { type: Number, default: null },
  discount: { type: Number, default: 0 },
  category: { type: String, required: true },
  tags: [String],
  images: [String],
  mainImage: { type: String, required: true },
  video: { type: String, default: null },
  features: [String],
  systemRequirements: {
    os: String,
    processor: String,
    memory: String,
    graphics: String,
    storage: String
  },
  status: { type: String, default: 'active', enum: ['active', 'inactive', 'draft'] },
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  downloadCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for performance
schema.index({ slug: 1 });
schema.index({ category: 1 });
schema.index({ status: 1 });
schema.index({ featured: 1 });
schema.index({ trending: 1 });
schema.index({ price: 1 });
schema.index({ createdAt: -1 });

// Update timestamp on save
schema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Product', schema);