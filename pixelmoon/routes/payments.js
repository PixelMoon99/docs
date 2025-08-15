const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const axios = require('axios');

// Create a payment (frontend calls this to create invoice)
// applies 0.5% fee for USDT payments automatically
router.post('/create', async (req, res) => {
  try {
    const { amount, currency, description, userId, orderId } = req.body;
    if (!amount || !currency) return res.status(400).json({ error: 'amount and currency required' });

    const upperCur = (currency || '').toUpperCase();
    let fee = 0;
    if (upperCur.includes('USDT')) {
      // Extra 0.50% fee mandated on all USDT transactions
      fee = parseFloat((parseFloat(amount) * 0.005).toFixed(6));
    }
    const finalAmount = parseFloat((parseFloat(amount) + fee).toFixed(6));

    const tx = await Transaction.create({
      userId: userId || null,
      method: upperCur,
      amount: finalAmount,
      raw: { requestedAmount: amount, fee, order_id: orderId || null, description },
      status: 'pending'
    });

    // USDT: NOWPayments path
    if (upperCur.includes('USDT') && process.env.NOWPAYMENTS_API_KEY) {
      try {
        const body = {
          price_amount: finalAmount,
          price_currency: upperCur.includes('USDT') ? 'USDT' : upperCur,
          order_id: orderId || tx._id.toString(),
          success_url: process.env.PAYMENTS_REDIRECT_URL || ((process.env.DOMAIN || '') + '/payment/success'),
          cancel_url: process.env.PAYMENTS_CANCEL_URL || ((process.env.DOMAIN || '') + '/payment/callback'),
          postback_url: process.env.PAYMENTS_WEBHOOK_URL || ((process.env.DOMAIN || '') + '/api/v1/payments/webhook/now')
        };
        const resp = await axios.post('https://api.nowpayments.io/v1/invoice', body, {
          headers: { 'x-api-key': process.env.NOWPAYMENTS_API_KEY, 'Content-Type': 'application/json' }
        });
        tx.raw.nowpayments = resp.data;
        await tx.save();
        return res.json({ ok: true, txId: tx._id, nowpayments: resp.data });
      } catch (e) {
        console.warn('NowPayments create failed:', e.message || e);
      }
    }

    // INR and other currencies path (MatrixSoul/UPI) could be added here
    return res.json({ ok: true, txId: tx._id, amount: finalAmount, fee });
  } catch (e) {
    console.error('create payment error', e);
    return res.status(500).json({ error: 'server error' });
  }
});

// Raw webhook endpoint for NowPayments
router.post('/webhook/now', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const raw = req.body;
    let parsed = {};
    try { parsed = JSON.parse(raw.toString('utf8')); } catch(e){ parsed = null; }

    const tx = await Transaction.create({
      userId: null,
      method: 'webhook',
      amount: parsed && (parsed.price_amount||parsed.price||0),
      raw: { parsed },
      status: 'webhook_received'
    });

    if (parsed && (parsed.payment_status === 'finished' || parsed.status === 'finished' || parsed.payment_status === 'success')) {
      tx.status = 'paid';
      await tx.save();
    } else {
      await tx.save();
    }

    res.status(200).send('ok');
  } catch (e) {
    console.error('webhook error', e);
    res.status(500).send('error');
  }
});

module.exports = router;


// List payments (basic filters)
router.get('/payments', async (req, res) => {
  try {
    const { period, from, to } = req.query;
    const q = {};
    if (from || to) {
      q.createdAt = {};
      if (from) q.createdAt.$gte = new Date(from);
      if (to)   q.createdAt.$lte = new Date(to);
    }
    if (period === '7d') q.createdAt = { $gte: new Date(Date.now() - 7*24*60*60*1000) };
    if (period === '30d') q.createdAt = { $gte: new Date(Date.now() - 30*24*60*60*1000) };

    const payments = await Transaction.find(q).sort({ createdAt: -1 }).limit(500);
    res.json({ ok: true, payments });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});
