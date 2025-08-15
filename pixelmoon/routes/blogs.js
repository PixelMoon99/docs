const express = require('express');
const router = express.Router();
let Blog;
try { Blog = require('../models/Blog'); } catch(e) { Blog = null; }

// List published blogs
router.get('/published', async (req,res)=>{
  try {
    if (!Blog) return res.json({ success:true, blogs: [] });
    const page = parseInt(req.query.page||'1',10);
    const limit = parseInt(req.query.limit||'9',10);
    const skip = (page-1)*limit;
    const blogs = await Blog.find({ published:true }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    res.json({ success:true, blogs });
  } catch (e) {
    res.status(500).json({ success:false, error: e.message });
  }
});

// Get blog by slug
router.get('/:slug', async (req,res)=>{
  try {
    if (!Blog) return res.json({ success:true, blog: null });
    const blog = await Blog.findOne({ slug: req.params.slug }).lean();
    res.json({ success:true, blog });
  } catch (e) {
    res.status(500).json({ success:false, error: e.message });
  }
});

module.exports = router;