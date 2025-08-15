const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// returns top N users by orders in last X days (default 30)
router.get('/top', async (req,res)=>{
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ ok:true, users: [] });
    }
    const days = parseInt(req.query.days || '30',10);
    const since = new Date(Date.now() - days*24*3600*1000);
    const tx = await Transaction.find({createdAt: {$gte: since}}).lean();
    const counts = {};
    const spent = {};
    tx.forEach(t=>{ 
      if(!t.userId) return; 
      counts[t.userId] = (counts[t.userId]||0)+1; 
      spent[t.userId] = (spent[t.userId]||0) + (t.amount||0);
    });
    const entries = Object.entries(counts).sort((a,b)=> {
      // sort primarily by spent desc, then count desc
      const sa = spent[a[0]]||0; const sb = spent[b[0]]||0;
      if (sb !== sa) return sb - sa;
      return b[1]-a[1];
    }).slice(0,50);
    const users = await Promise.all(entries.map(async ([userId, cnt])=>{
      const u = await User.findById(userId).lean();
      return {userId, username: u?.email || (u && u._id && String(u._id)) || 'User', count:cnt, totalSpent: +(spent[userId]||0).toFixed(2)};
    }));
    res.json({ok:true, users});
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message, users: [] });
  }
});

module.exports = router;
