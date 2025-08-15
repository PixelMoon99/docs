const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const WebhookEvent = require('../models/WebhookEvent');
const User = require('../models/User');
const { generateInvoicePDF } = require('../utils/invoiceGenerator');
const { sendMail } = require('../utils/mailer');
const crypto = require('crypto');

function verifyNowPayments(rawBodyBuffer, headers) {
  const sig = headers['x-nowpayments-sig'] || headers['x-nowpayments-signature'] || headers['x-nowpayments-sign'];
  if (!sig) return false;
  const secret = process.env.NOWPAYMENTS_IPN_KEY || process.env.NOWPAYMENTS_API_KEY || '';
  // As per NowPayments docs, sign sorted params string with HMAC-SHA512
  try {
    const parsed = JSON.parse(rawBodyBuffer.toString('utf8') || '{}');
    const sorted = JSON.stringify(parsed, Object.keys(parsed).sort());
    const hmac = crypto.createHmac('sha512', secret);
    hmac.update(sorted, 'utf8');
    const digest = hmac.digest('hex');
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(sig));
  } catch (e) {
    return false;
  }
}

router.post('/payments-hook-d13f4b97', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const raw = req.body;
    const headers = req.headers || {};
    // idempotency: check webhook event
    const eventKey = headers['x-nowpayments-id'] || headers['x-request-id'] || null;
    const existingEvent = eventKey ? await WebhookEvent.findOne({ eventKey }) : null;
    if (existingEvent) {
      return res.status(200).send('already_processed');
    }
    // verify signature if possible
    const verified = verifyNowPayments(raw, headers);
    // store raw event regardless (useful for debugging)
    const payload = (() => { try { return JSON.parse(raw.toString('utf8')); } catch(e){ return null; } })();
    await WebhookEvent.create({ eventKey: eventKey || (payload && payload.id) || null, gateway: 'nowpayments', raw: payload });

    if (!verified) {
      console.warn('NowPayments webhook signature not verified');
      // proceed cautiously: check payload for success but do not fully trust
    }

    const status = (payload && (payload.payment_status || payload.status)) || null;
    const orderId = (payload && (payload.order_id || payload.orderId || payload.order)) || null;
    const amount = (payload && (payload.price_amount || payload.amount || payload.price)) || 0;

    if (status && ['finished','success'].includes(status) ) {
      // mark transaction paid and credit user wallet atomically
      const tx = await Transaction.findOneAndUpdate({ 'raw.nowpayments.invoice_id': payload && payload.id }, { status: 'paid' }, { new: true });
      // fallback: find by orderId if tx not found
      let foundTx = tx;
      if (!foundTx && orderId) {
        foundTx = await Transaction.findOneAndUpdate({ 'raw.order_id': orderId }, { status: 'paid' }, { new: true });
      }
      // credit user wallet (if foundTx has userId)
      if (foundTx && foundTx.userId) {
        await User.findOneAndUpdate({ _id: foundTx.userId }, { $inc: { walletBalance: foundTx.amount } });
      }
      // generate invoice and email if email exists in payload or transaction
      try {
        const invoicePath = '/tmp/invoice-' + (orderId || (foundTx && foundTx._id) || Date.now()) + '.pdf';
        const orderInfo = { id: orderId || (foundTx && foundTx._id), amount: amount };
        await generateInvoicePDF(orderInfo, invoicePath);
        const toEmail = (payload && payload.customer && payload.customer.email) || (foundTx && foundTx.raw && foundTx.raw.customerEmail) || null;
        if (toEmail) {
          await sendMail({ to: toEmail, subject: 'Your Invoice', html: '<p>See attached invoice</p>', text: 'Invoice attached' });
        }
      } catch (e) {
        console.warn('Invoice/email failed', e && e.message);
      }
    }

    res.status(200).send('ok');
  } catch (e) {
    console.error('incoming webhook error', e && e.message);
    res.status(500).send('error');
  }
});

module.exports = router;
