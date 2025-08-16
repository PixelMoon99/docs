const mongoose = require('mongoose');
// UPDATED 2025-01-27 — Created Order model for order tracking
const schema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'USD', enum: ['USD', 'INR'] },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed', 'refunded'] },
  transactionId: { type: String, default: null },
  status: { type: String, default: 'pending', enum: ['pending', 'processing', 'completed', 'cancelled'] },
  shippingAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  billingAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  notes: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  paidAt: { type: Date, default: null },
  completedAt: { type: Date, default: null }
});

// Indexes for performance
schema.index({ orderId: 1 });
schema.index({ userId: 1 });
schema.index({ paymentStatus: 1 });
schema.index({ status: 1 });
schema.index({ createdAt: -1 });
schema.index({ transactionId: 1 });

// Update timestamp on save
schema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Order', schema);