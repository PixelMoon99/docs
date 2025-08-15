const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Simple summaries: weekly, monthly, all-time with optional currency filter
router.get('/summary', async (req,res)=>{
  const currency = (req.query.currency||'').toUpperCase();
  const all = await Transaction.find().lean();
  const filtered = currency ? all.filter(t => (t.method||'').toUpperCase().includes(currency)) : all;
  const now = new Date();
  const weekAgo = new Date(now - 7*24*3600*1000);
  const monthAgo = new Date(now - 30*24*3600*1000);
  const sum = (arr)=> arr.reduce((s,x)=>s + (x.amount||0),0);
  const totalOrders = filtered.length;
  const weekly = filtered.filter(t=> new Date(t.createdAt) >= weekAgo);
  const monthly = filtered.filter(t=> new Date(t.createdAt) >= monthAgo);
  res.json({
    ok:true,
    totalOrders,
    weekly: {count: weekly.length, totalCost: +sum(weekly).toFixed(2)},
    monthly: {count: monthly.length, totalCost: +sum(monthly).toFixed(2)},
    allTime: {count: filtered.length, totalCost: +sum(filtered).toFixed(2)}
  });
});

// Time range and currency-based analysis
router.get('/range', async (req,res)=>{
  try {
    const { from, to } = req.query;
    const q = {};
    if (from || to) {
      q.createdAt = {};
      if (from) q.createdAt.$gte = new Date(from);
      if (to) q.createdAt.$lte = new Date(to);
    }
    const docs = await Transaction.find(q).lean();
    const byCurrency = {};
    docs.forEach(d=>{
      const cur = (d.method||'').toUpperCase();
      if (!byCurrency[cur]) byCurrency[cur] = { count:0, total:0 };
      byCurrency[cur].count += 1;
      byCurrency[cur].total += (d.amount||0);
    });
    Object.keys(byCurrency).forEach(k=>{ byCurrency[k].total = +byCurrency[k].total.toFixed(2); });
    res.json({ ok:true, byCurrency, total: docs.length });
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message });
  }
});

module.exports = router;
