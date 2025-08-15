const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ ok:false, error: 'No file' });
    const outDir = path.join(__dirname, '..', 'public', 'uploads');
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, Date.now() + '-' + file.originalname);
    // attempt to resize images; if not image, move file
    const mime = file.mimetype || '';
    if (mime.startsWith('image/')) {
      // keep aspect ratio with width 1200 max
      await sharp(file.path).resize({ width: 1200, withoutEnlargement: true }).toFile(outPath);
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
