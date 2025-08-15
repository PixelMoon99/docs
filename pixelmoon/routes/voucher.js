const express = require('express');
const router = express.Router();
const Voucher = require('../models/Voucher');

// create voucher
router.post('/create', async (req,res)=>{
  const {code,name,price,description,expiresAt} = req.body;
  const v = new Voucher({code,name,price,description,expiresAt,createdBy:req.body.admin||'admin'});
  await v.save();
  res.json({ok:true,v});
});

// list
router.get('/list', async (req,res)=>{
  const v = await Voucher.find().sort({createdAt:-1}).limit(200).lean();
  res.json({ok:true,v});
});

// available (for search)
router.get('/available', async (req,res)=>{
  const now = new Date();
  const v = await Voucher.find({ $or: [ { expiresAt: null }, { expiresAt: { $gte: now } } ] }).sort({ createdAt:-1 }).limit(200).lean();
  res.json({ success:true, vouchers: v });
});

module.exports = router;
