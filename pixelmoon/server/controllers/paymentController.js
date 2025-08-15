import { config } from 'dotenv';
import { createPayment } from '../utils/nowpayments.js';
import path from 'path';
config();

export async function createUsdtPayment(req, res) {
  try {
    const { amount, currency = 'USD', orderId } = req.body;
    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'NOWPAYMENTS_API_KEY not set' });

    const successUrl = `${process.env.PUBLIC_URL || 'http://localhost:5173'}/payment/success?orderId=${encodeURIComponent(orderId)}`;
    const cancelUrl = `${process.env.PUBLIC_URL || 'http://localhost:5173'}/payment/cancel?orderId=${encodeURIComponent(orderId)}`;
    const resp = await createPayment(apiKey, amount, currency, orderId, successUrl, cancelUrl);
    return res.json(resp);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function nowpaymentsWebhook(req, res) {
  try {
    // NOTE: In production, validate signature if configured.
    const event = req.body;
    // Upsert order status here (DB or file). For demo, we just log.
    console.log('NOWPayments webhook:', event);
    return res.status(200).json({ received: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
