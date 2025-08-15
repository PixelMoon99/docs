const express = require('express');
// UPDATED 2025-08-15 — Safer token handling and VIP remaining days fallback
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Public active notifications including VIP info when authenticated
router.get('/active', async (req,res)=>{
  try {
    const notifications = [];
    // If token present, attach VIP info for expiry and progress bar
    const auth = req.headers.authorization || '';
    if (auth.startsWith('Bearer ')) {
      try {
        const token = auth.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'please_change_this_random_secret');
        const user = await User.findById(payload.id).lean();
        if (user) {
          const now = Date.now();
          const vipEnd = user.vipEnd ? new Date(user.vipEnd).getTime() : null;
          const remainingDays = vipEnd && vipEnd > now ? Math.max(0, Math.ceil((vipEnd - now)/(24*3600*1000))) : 0;
          if (user.isVip && vipEnd) {
            notifications.push({ type: remainingDays <= 3 ? 'warning' : 'info', message: `VIP: ${remainingDays} day(s) remaining`, link: '/user-dashboard' });
          }
          // basic progress hint toward free VIP eligibility (example: 5 orders in 30 days)
          const targetOrders = 5;
          notifications.push({ type:'promotion', message:`Complete ${targetOrders} orders in 30 days to unlock Free VIP!`, link:'/user-dashboard' });
        }
      } catch (_) {}
    }
    // Static promotional message example
    notifications.push({ type:'promotion', message:'Earn VIP status with consistent purchases! Check your dashboard for progress.', link:'/user-dashboard' });
    return res.json({ success:true, notifications });
  } catch (e) {
    res.status(500).json({ success:false, notifications:[], error:e.message });
  }
});

module.exports = router;