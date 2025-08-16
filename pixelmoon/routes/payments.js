const express = require('express');
// UPDATED 2025-08-15 — Added Joi validation, HMAC verification with idempotency, safer create logic
const router = express.Router();
const Transaction = require('../models/Transaction');
const axios = require('axios');
const Joi = require('joi');
const WebhookEvent = require('../models/WebhookEvent');
const { identifyAndVerify } = require('../lib/webhookVerifier');

// Create a payment (frontend calls this to create invoice)
// applies 0.5% fee for USDT payments automatically
router.post('/create', async (req, res) => {
  try {
    const schema = Joi.object({
      amount: Joi.number().positive().required(),
      currency: Joi.string().trim().required(),
      description: Joi.string().allow('', null),
      userId: Joi.string().allow('', null),
      orderId: Joi.string().allow('', null),
      methodHint: Joi.string().allow('', null)
    });
    const { value: body, error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { amount, currency, description, userId, orderId, methodHint } = body;

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
          price_currency: 'USDT',
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

    // INR path: MatrixSoul or custom UPI
    if ((upperCur === 'INR' || upperCur === '₹' || methodHint === 'MATRIXSOUL') && process.env.MATRIXSOL_API_KEY) {
      try {
        // placeholder: construct a simple payload; vendor docs may vary
        const payload = {
          amount: finalAmount,
          currency: 'INR',
          order_id: orderId || tx._id.toString(),
          purpose: description || 'PixelMoon Order',
          callback_url: process.env.MATRIXSOL_WEBHOOK_URL || ((process.env.DOMAIN || '') + '/api/matrixsols/webhook')
        };
        const resp = await axios.post('https://api.matrixsoul.example.com/create', payload, {
          headers: { 'Authorization': `Bearer ${process.env.MATRIXSOL_API_KEY}` }
        });
        tx.raw.matrixsoul = resp.data;
        await tx.save();
        return res.json({ ok:true, txId: tx._id, checkout: resp.data });
      } catch (e) {
        console.warn('MatrixSoul create failed:', e.message || e);
      }
    }

    // Fallback simple response
    return res.json({ ok: true, txId: tx._id, amount: finalAmount, fee });
  } catch (e) {
    console.error('create payment error', e);
    return res.status(500).json({ error: 'server error' });
  }
});

// Raw webhook endpoint for NowPayments with signature verification and idempotency
router.post('/webhook/now', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const raw = req.body;
    const headers = req.headers;

    // verify signature
    const { gateway, eventId } = identifyAndVerify(raw, headers);

    // idempotency check
    const existing = await WebhookEvent.findOne({ gateway, eventId }).lean();
    if (existing) return res.status(200).send('ok');

    let parsed = {};
    try { parsed = JSON.parse(raw.toString('utf8')); } catch(e){ parsed = null; }

    const orderId = parsed && (parsed.order_id || parsed.invoice_id || parsed.payment_id || '');

    // record webhook event
    await WebhookEvent.create({ gateway, eventId, payload: parsed, processedAt: new Date() });

    // Try finding a matching transaction by order id captured earlier
    let tx = null;
    if (orderId) {
      tx = await Transaction.findOne({ $or: [ { _id: orderId }, { 'raw.order_id': orderId } ] });
    }
    if (!tx) {
      // fallback: create a record to track
      tx = await Transaction.create({
        userId: null,
        method: 'NOWPAYMENTS',
        amount: parsed && (parsed.price_amount||parsed.price||0),
        raw: { parsed, order_id: orderId },
        status: 'webhook_received'
      });
    }

    if (parsed && (parsed.payment_status === 'finished' || parsed.status === 'finished' || parsed.payment_status === 'success')) {
      tx.status = 'paid';
      await tx.save();
    } else {
      await tx.save();
    }

    res.status(200).send('ok');
  } catch (e) {
    console.error('webhook error', e);
    res.status(400).send('error');
  }
});

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

module.exports = router;
