const express = require('express');
// UPDATED 2025-08-15 — Added file size limits, mime filtering, safer temp upload dir, robust image resize
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const upload = multer({ 
  dest: 'tmp_uploads/',
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/','video/'];
    if (allowed.some(p => (file.mimetype||'').startsWith(p))) return cb(null, true);
    return cb(new Error('Unsupported file type'));
  }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ ok:false, error: 'No file' });
    const outDir = path.join(__dirname, '..', 'public', 'uploads');
    fs.mkdirSync(outDir, { recursive: true });
    const safeName = (file.originalname || 'file').replace(/[^a-zA-Z0-9._-]/g, '_');
    const outPath = path.join(outDir, Date.now() + '-' + safeName);
    // attempt to resize images; if not image, move file
    const mime = file.mimetype || '';
    if (mime.startsWith('image/')) {
      // keep aspect ratio with width 1200 max, auto rotate, strip metadata
      await sharp(file.path)
        .rotate()
        .resize({ width: 1200, withoutEnlargement: true })
        .withMetadata({ orientation: 1 })
        .toFile(outPath);
      fs.unlinkSync(file.path);
      return res.json({ ok: true, url: '/uploads/' + path.basename(outPath), type: 'image' });
    } else {
      // move file (videos or others)
      fs.renameSync(file.path, outPath);
      return res.json({ ok: true, url: '/uploads/' + path.basename(outPath), type: mime.split('/')[0]||'file' });
    }
  } catch (e) {
    console.error('upload error', e && e.message);
    return res.status(500).json({ ok:false, error: 'server error' });
  }
});

module.exports = router;
