const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const auth = require('../middlewares/auth');

// List orders for current user
router.get('/', auth, async (req,res)=>{
  const list = await Transaction.find({ userId: String(req.user._id) }).sort({ createdAt:-1 }).limit(100).lean();
  res.json({ success:true, orders: list });
});

// Create order (wallet or phonepe)
router.post('/', auth, async (req,res)=>{
  try {
    const { paymentInfo } = req.body;
    const amount = Number(paymentInfo?.amount||0);
    if (!amount || amount <= 0) return res.status(400).json({ success:false, message:'invalid amount' });
    // wallet
    if ((paymentInfo?.method||'').toLowerCase() === 'wallet') {
      const user = await User.findById(req.user._id);
      if ((user.walletBalance||0) < amount) return res.status(400).json({ success:false, message:'Insufficient wallet balance' });
      user.walletBalance = +(user.walletBalance - amount).toFixed(2);
      await user.save();
      const tx = await Transaction.create({ userId: String(user._id), method: 'ORDER_WALLET', amount: amount, raw: { description:'Order via wallet' }, status:'paid' });
      return res.json({ success:true, id: tx._id });
    }
    // fallback phonepe stub
    const tx = await Transaction.create({ userId: String(req.user._id), method: 'ORDER_UPI', amount: amount, raw: { description:'Order via UPI' }, status:'pending' });
    return res.json({ success:true, id: tx._id, checkoutUrl: null });
  } catch (e) {
    res.status(500).json({ success:false, message: e.message });
  }
});

// Check status
router.get('/check-status/:id', auth, async (req,res)=>{
  const tx = await Transaction.findOne({ _id: req.params.id, userId: String(req.user._id) }).lean();
  if (!tx) return res.status(404).json({ success:false });
  res.json({ success:true, status: tx.status });
});

// Debug payment (returns basic info)
router.get('/debug-payment/:id', auth, async (req,res)=>{
  const tx = await Transaction.findOne({ _id: req.params.id, userId: String(req.user._id) }).lean();
  if (!tx) return res.status(404).json({ success:false });
  res.json({ success:true, tx });
});

module.exports = router;