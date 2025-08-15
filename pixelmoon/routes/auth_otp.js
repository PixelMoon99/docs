const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTPStore = require('../models/OTPStore');
const { sendMail } = require('../utils/mailer');

// request OTP
router.post('/request', async (req,res)=>{
  const {email} = req.body;
  if(!email) return res.status(400).json({ok:false,error:'email required'});
  const code = Math.floor(100000 + Math.random()*900000).toString();
  const hash = crypto.createHash('sha256').update(code).digest('hex');
  await OTPStore.create({email, codeHash:hash, expiresAt: new Date(Date.now()+10*60*1000)});
  // Send via email if SMTP is configured; otherwise log in dev
  if (process.env.SMTP_USER && process.env.SMTP_HOST) {
    try {
      await sendMail({ to: email, subject: 'Your PixelMoon Login OTP', html: `<p>Your OTP is <b>${code}</b>. It expires in 10 minutes.</p>`, text: `Your OTP is ${code}` });
    } catch (e) {
      console.warn('Failed to send OTP email', e && e.message);
    }
  } else {
    console.log('OTP for',email,':',code);
  }
  res.json({ok:true, message:'OTP generated. Check your email.'});
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
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'please_change_this_random_secret', { expiresIn: '7d' });
  res.json({ok:true, token, user: { id:user._id, email:user.email, role:user.role }});
});

module.exports = router;
