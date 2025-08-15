const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { nanoid } = require('nanoid');
const ApiKey = require('../models/ApiKey');
const ApiUsage = require('../models/ApiUsage');
const PDFDocument = require('pdfkit');

// Admin guard: ensure req.user is admin
function ensureAdmin(req,res,next){ 
  if (req.user && (req.user.isAdmin || req.user.role === 'master_admin')) return next(); 
  return res.status(403).json({ ok:false, error:'admin only' }); 
}

// Create new API key (returns the raw key once)
router.post('/create', ensureAdmin, async (req,res) => {
  try {
    const { name, scopes, expiresAt, ipMode, ipList } = req.body;
    const raw = nanoid(48);
    const prefix = raw.slice(0,8);
    const hashed = crypto.createHash('sha256').update(raw).digest('hex');
    const keyDoc = await ApiKey.create({ name, hashedKey: hashed, prefix, scopes: scopes||[], expiresAt: expiresAt ? new Date(expiresAt) : null, ipMode: ipMode||'none', ipList: Array.isArray(ipList)?ipList:[] });
    res.json({ ok:true, key: raw, id: keyDoc._id, prefix });
  } catch (e) { res.status(500).json({ ok:false, error: e.message }); }
});

// List keys with usage summary
router.get('/', ensureAdmin, async (req,res)=>{
  const keys = await ApiKey.find().lean();
  // attach last 5 usages for quick view
  for (let k of keys) {
    const usages = await ApiUsage.find({ apiKey: k._id }).sort({ createdAt: -1 }).limit(5).lean();
    k.recentUsage = usages;
  }
  res.json({ ok:true, keys });
});

// Block key
router.post('/:id/block', ensureAdmin, async (req,res)=>{
  await ApiKey.updateOne({ _id:req.params.id }, { revoked: true });
  res.json({ ok:true });
});

// Unblock key
router.post('/:id/unblock', ensureAdmin, async (req,res)=>{
  await ApiKey.updateOne({ _id:req.params.id }, { revoked: false });
  res.json({ ok:true });
});

// Update IP rules
router.post('/:id/ip', ensureAdmin, async (req,res)=>{
  const { ipMode, ipList } = req.body;
  await ApiKey.updateOne({ _id:req.params.id }, { ipMode: ipMode||'none', ipList: Array.isArray(ipList)?ipList:[] });
  res.json({ ok:true });
});

// Generate partner PDF (returns application/pdf)
router.get('/:id/pdf', ensureAdmin, async (req,res)=>{
  const key = await ApiKey.findById(req.params.id).lean();
  if (!key) return res.status(404).json({ ok:false, error: 'Not found' });

  const doc = new PDFDocument();
  res.setHeader('Content-Type','application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="api-key-doc-${key.prefix}.pdf"`);
  doc.fontSize(20).text('PixelMoon API Access', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Partner Name: ${key.name}`);
  doc.text(`Prefix: ${key.prefix}`);
  doc.text(`Scopes: ${(key.scopes||[]).join(', ')}`);
  doc.text(`Status: ${key.revoked ? 'Blocked' : 'Active'}`);
  doc.text(`Created At: ${key.createdAt}`);
  doc.text(`Expires At: ${key.expiresAt || 'Never'}`);
  doc.moveDown();
  doc.text('Usage instructions:', { underline: true });
  doc.text('1) Include your API key in the Authorization header: Authorization: ApiKey <YOUR_KEY>');
  doc.text('2) If IP restrictions are set, ensure your server IP is allowed.');
  doc.text('3) Use /api/products and /api/quote endpoints for product info.');
  doc.moveDown();
  doc.text('Contact: support@yourdomain.com');
  doc.end();
  doc.pipe(res);
});

module.exports = router;
