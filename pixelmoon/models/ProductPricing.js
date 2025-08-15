const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  productId: String,
  source: { type: String, enum: ['rp','soc','usd'] },
  sourceCost: Number,
  exchangeRateRp: Number,
  exchangeRateUsd: Number,
  costInINR: Number,
  retailPrice: Number,
  resellerPrice: Number,
  tierPrices: { type: Map, of: Number }, // tier1,tier2,tier3
  lastUpdated: Date
});
module.exports = mongoose.model('ProductPricing', schema);
