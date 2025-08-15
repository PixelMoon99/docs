const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get wallet balance
router.get('/balance', async (req,res)=>{
  const user = req.user;
  res.json({ ok:true, data: { balanceRupees: +(user.walletBalance||0).toFixed(2) } });
});

// Get wallet transactions (map from Transaction model for now)
router.get('/transactions', async (req,res)=>{
  const page = parseInt(req.query.page||'1',10);
  const limit = Math.min(100, parseInt(req.query.limit||'10',10));
  const skip = (page-1)*limit;
  const txs = await Transaction.find({ userId: String(req.user._id) }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
  const mapped = txs.map(t=>({
    _id: t._id,
    description: (t.raw && t.raw.description) || 'Transaction',
    createdAt: t.createdAt,
    amountPaise: Math.round((t.amount||0)*100),
    type: (t.amount||0) >= 0 ? 'CREDIT' : 'DEBIT'
  }));
  res.json({ ok:true, data: { transactions: mapped, page, limit } });
});

// Deposit to wallet (creates a Transaction and returns a redirect if needed)
router.post('/deposit', async (req,res)=>{
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ ok:false, message:'invalid amount' });
    const userId = String(req.user._id);

    // For wallet deposits, store as INR by default
    const tx = await Transaction.create({
      userId,
      method: 'INR_WALLET',
      amount: Number(amount),
      raw: { description: 'Wallet deposit' },
      status: 'pending'
    });

    // In a full integration, return a payment checkout URL. Here we simulate immediate credit for speed.
    await User.updateOne({ _id: userId }, { $inc: { walletBalance: Number(amount) } });
    tx.status = 'paid';
    await tx.save();

    res.json({ ok:true, message: 'Money added successfully!', data: { redirectRequired: false } });
  } catch (e) {
    res.status(500).json({ ok:false, message: e.message });
  }
});

module.exports = router;