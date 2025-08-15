const express = require('express');
const router = express.Router();
const User = require('../models/User');
const VIPTier = require('../models/VIPTier');

// Admin: define tiers (seed)
router.get('/tiers', async (req,res)=>{
  const tiers = await VIPTier.find().lean();
  res.json({ok:true, tiers});
});

// Admin: create/update tier
router.post('/tiers', async (req,res)=>{
  const data = req.body;
  let t = await VIPTier.findOne({tier:data.tier});
  if(!t) t = new VIPTier(data);
  else Object.assign(t, data);
  await t.save();
  res.json({ok:true,t});
});

// User progress check & auto-upgrade endpoint (can be called after order fulfillment)
router.post('/progress/:userId', async (req,res)=>{
  const userId = req.params.userId;
  const {ordersInWindow} = req.body; // number of orders in relevant window
  // find matching tier
  const tiers = await VIPTier.find().sort({ordersRequired:1});
  let awarded = null;
  for(const tier of tiers){
    if(ordersInWindow >= tier.ordersRequired){
      // award this tier
      const user = await User.findById(userId);
      if(user){
        user.isVip = true;
        user.vipTier = tier.tier;
        user.vipStart = new Date();
        user.vipEnd = new Date(Date.now() + (tier.durationDays||30)*24*3600*1000);
        await user.save();
        awarded = tier;
      }
    }
  }
  res.json({ok:true,awarded});
});

// Admin/manual promote/demote/block
router.post('/set/:userId', async (req,res)=>{
  const {tier,action} = req.body;
  const user = await User.findById(req.params.userId);
  if(!user) return res.status(404).json({ok:false});
  if(action === 'promote'){
    user.isVip = true; user.vipTier = tier; user.vipStart = new Date();
    const t = await VIPTier.findOne({tier});
    user.vipEnd = new Date(Date.now() + (t?.durationDays||30)*24*3600*1000);
  } else if(action === 'demote'){
    user.isVip = false; user.vipTier = null; user.vipStart = null; user.vipEnd = null;
  } else if(action === 'block'){
    user.blocked = true; user.isVip = false; user.vipTier = null; user.vipStart = null; user.vipEnd = null;
  } else if(action === 'unblock'){
    user.blocked = false;
  }
  await user.save();
  res.json({ok:true,user});
});

// Check VIP expiry status for a user
router.get('/status/:userId', async (req,res)=>{
  const user = await User.findById(req.params.userId).lean();
  if(!user) return res.status(404).json({ok:false});
  const now = Date.now();
  const remainingDays = user.vipEnd ? Math.max(0, Math.ceil((new Date(user.vipEnd).getTime()-now)/(24*3600*1000))) : 0;
  const expired = !!(user.vipEnd && new Date(user.vipEnd) < new Date());
  res.json({ok:true, vip: { isVip: !!user.isVip && !expired, tier: user.vipTier||null, remainingDays }});
});

module.exports = router;
