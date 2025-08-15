const express = require('express');
const router = express.Router();
const apiAuth = require('../middleware/apiKeyAuth');
let Product;
try { Product = require('../models/Product'); } catch(e) { Product = null; }
const Transaction = require('../models/Transaction');

// Public API: get products (requires read scope)
router.get('/products', apiAuth(['read:products']), async (req, res) => {
  try {
    const q = {};
    if (req.query.q && Product) q.name = new RegExp(req.query.q, 'i');
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit||'50')));
    const products = Product ? await Product.find(q).limit(limit).lean() : [];
    res.json({ ok:true, count: products.length, products });
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message });
  }
});

// Public API: price/quote
router.get('/quote', apiAuth(['read:products']), async (req, res) => {
  try {
    const { productId } = req.query;
    if (!Product) return res.status(501).json({ ok:false, error: 'Product model not available' });
    if (!productId) return res.status(400).json({ ok:false, error: 'productId required' });
    const p = await Product.findById(productId).lean();
    if (!p) return res.status(404).json({ ok:false, error: 'Product not found' });
    res.json({ ok:true, productId: p._id, price: p.retail || p.price || 0, currency: p.currency || 'USD' });
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message });
  }
});

// Username check API (real-time validation)
router.get('/check-username', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username || username.trim().length < 3) return res.status(400).json({ ok:false, valid:false, error:'too_short' });
    // Example rules: alphanumeric and underscores only
    const validFormat = /^[a-zA-Z0-9_]+$/.test(username);
    if (!validFormat) return res.json({ ok:true, valid:false, reason:'invalid_format' });
    // Check reserved names
    const reserved = ['admin','support','pixelmoon'];
    if (reserved.includes(username.toLowerCase())) return res.json({ ok:true, valid:false, reason:'reserved' });
    // TODO: check database for existing usernames if you store them
    return res.json({ ok:true, valid:true });
  } catch (e) {
    res.status(500).json({ ok:false, valid:false, error: e.message });
  }
});

module.exports = router;
