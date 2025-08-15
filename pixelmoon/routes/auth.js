const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');

function signToken(user){
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'please_change_this_random_secret', { expiresIn: '7d' });
}

router.post('/register', async (req,res)=>{
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ ok:false, msg:'email and password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ ok:false, msg:'email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    const token = signToken(user);
    res.json({ ok:true, token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ ok:false, msg:e.message });
  }
});

router.post('/login', async (req,res)=>{
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ ok:false, msg:'email and password required' });
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ ok:false, msg:'invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ ok:false, msg:'invalid credentials' });
    const token = signToken(user);
    res.json({ ok:true, token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ ok:false, msg:e.message });
  }
});

router.get('/me', authMiddleware, async (req,res)=>{
  const u = req.user;
  res.json({ ok:true, user: { id: u._id, email: u.email, role: u.role, isVip: u.isVip, vipTier: u.vipTier } });
});

module.exports = router;