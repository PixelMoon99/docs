const express = require('express');
const router = express.Router();
const multer = require('multer');
const csvParse = require('csv-parse/sync');
const Voucher = require('../models/Voucher');
const upload = multer();

// create voucher (single JSON)
router.post('/create', async (req,res)=>{
  try {
    const {code,name,price,description,expiresAt} = req.body;
    if (!code) return res.status(400).json({ ok:false, message:'code required' });
    const v = new Voucher({code,name,price,description,expiresAt,createdBy:req.body.admin||'admin'});
    await v.save();
    res.json({ok:true,v});
  } catch (e) {
    res.status(500).json({ ok:false, message: e.message });
  }
});

// new create bulk: JSON body or CSV upload per admin UI
router.post('/', upload.single('csvFile'), async (req,res)=>{
  try {
    // if CSV is provided
    if (req.file && req.file.buffer) {
      const content = req.file.buffer.toString('utf8');
      const records = csvParse.parse(content, { columns:true, skip_empty_lines:true });
      const toInsert = [];
      const duplicates = [];
      const invalid = [];
      for (const r of records) {
        const code = (r.code||'').trim();
        const type = (r.type||'').trim() || 'smileone';
        const denomination = Number(r.denomination||0);
        const price = Number(r.price||0);
        if (!code || denomination <= 0 || price <= 0) { invalid.push(r); continue; }
        const exists = await Voucher.findOne({ code });
        if (exists) { duplicates.push(code); continue; }
        toInsert.push({ code, name: type.toUpperCase() + ' ' + denomination, price, description: '', createdBy: req.user ? req.user.email : 'admin' });
      }
      const result = toInsert.length ? await Voucher.insertMany(toInsert) : [];
      return res.json({ success:true, insertedCount: result.length, duplicates, invalid });
    }

    // else JSON vouchers array
    const vouchers = Array.isArray(req.body.vouchers) ? req.body.vouchers : [];
    const toInsert = [];
    const duplicates = [];
    const invalid = [];
    for (const v of vouchers) {
      const code = (v.code||'').trim();
      const type = (v.type||'smileone').trim();
      const denomination = Number(v.denomination||0);
      const price = Number(v.price||0);
      if (!code || denomination <= 0 || price <= 0) { invalid.push(v); continue; }
      const exists = await Voucher.findOne({ code });
      if (exists) { duplicates.push(code); continue; }
      toInsert.push({ code, name: type.toUpperCase() + ' ' + denomination, price, description: '', createdBy: req.user ? req.user.email : 'admin' });
    }
    const result = toInsert.length ? await Voucher.insertMany(toInsert) : [];
    return res.json({ success:true, insertedCount: result.length, duplicates, invalid });
  } catch (e) {
    res.status(500).json({ success:false, message: e.message });
  }
});

// list with pagination and filters
router.get('/', async (req,res)=>{
  try {
    const { type = '', status = 'active', page = 1, limit = 25 } = req.query;
    const q = {};
    if (type) q.name = new RegExp(type, 'i');
    if (status === 'redeemed') q.active = false; else if (status === 'active') q.active = true;
    const skip = (Math.max(1, parseInt(page,10)) - 1) * Math.max(1, parseInt(limit,10));
    const [vouchers, totalCount] = await Promise.all([
      Voucher.find(q).sort({ createdAt:-1 }).skip(skip).limit(Math.max(1, parseInt(limit,10))).lean(),
      Voucher.countDocuments(q)
    ]);
    return res.json({ success:true, vouchers, totalCount, totalPages: Math.ceil(totalCount/Math.max(1, parseInt(limit,10))) });
  } catch (e) {
    res.status(500).json({ success:false, message: e.message });
  }
});

// available (for search)
router.get('/available', async (req,res)=>{
  const now = new Date();
  const v = await Voucher.find({ $or: [ { expiresAt: null }, { expiresAt: { $gte: now } } ] }).sort({ createdAt:-1 }).limit(200).lean();
  res.json({ success:true, vouchers: v });
});

// update price/status
router.put('/:id', async (req,res)=>{
  try {
    const { price, status } = req.body;
    const update = {};
    if (typeof price !== 'undefined') update.price = Number(price);
    if (typeof status === 'string') update.active = status !== 'redeemed';
    const doc = await Voucher.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!doc) return res.status(404).json({ success:false, message:'Not found' });
    res.json({ success:true, voucher: doc });
  } catch (e) {
    res.status(500).json({ success:false, message: e.message });
  }
});

// delete voucher
router.delete('/:id', async (req,res)=>{
  try {
    const doc = await Voucher.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success:false, message:'Not found' });
    res.json({ success:true });
  } catch (e) {
    res.status(500).json({ success:false, message: e.message });
  }
});

module.exports = router;
