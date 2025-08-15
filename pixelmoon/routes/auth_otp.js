const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const OTPStore = require('../models/OTPStore');

// request OTP
router.post('/request', async (req,res)=>{
  const {email} = req.body;
  if(!email) return res.status(400).json({ok:false,error:'email required'});
  const code = Math.floor(100000 + Math.random()*900000).toString();
  const hash = crypto.createHash('sha256').update(code).digest('hex');
  await OTPStore.create({email, codeHash:hash, expiresAt: new Date(Date.now()+10*60*1000)});
  // In production: send code by email. Here we log it for developer.
  console.log('OTP for',email,':',code);
  res.json({ok:true, message:'OTP generated and (in dev) logged to server console.'});
});

// verify OTP and signin/signup
router.post('/verify', async (req,res)=>{
  const {email,code} = req.body;
  if(!email||!code) return res.status(400).json({ok:false});
  const hash = crypto.createHash('sha256').update(code).digest('hex');
  const rec = await OTPStore.findOne({email, codeHash:hash, used:false, expiresAt: {$gte: new Date()}});
  if(!rec) return res.status(400).json({ok:false,error:'invalid or expired'});
  rec.used = true; await rec.save();
  let user = await User.findOne({email});
  if(!user){
    user = new User({email});
    await user.save();
  }
  // simple token (placeholder)
  const token = crypto.randomBytes(24).toString('hex');
  res.json({ok:true, token, user});
});

module.exports = router;
