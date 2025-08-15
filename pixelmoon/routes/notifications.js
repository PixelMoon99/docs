const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Public active notifications including VIP info when authenticated
router.get('/active', async (req,res)=>{
  try {
    const notifications = [];
    // If token present, attach VIP info
    const auth = req.headers.authorization || '';
    let user = null;
    if (auth.startsWith('Bearer ')) {
      // Soft-verify token using middleware logic is overkill here; keep public for bar
      // Optional: enrich if user is VIP
    }
    // Static promotional message example
    notifications.push({ type:'promotion', message:'Earn VIP status with consistent purchases! Check your dashboard for progress.', link:'/user-dashboard' });
    return res.json({ success:true, notifications });
  } catch (e) {
    res.status(500).json({ success:false, notifications:[], error:e.message });
  }
});

module.exports = router;