import fetch from 'node-fetch';
const API_BASE = 'https://api.nowpayments.io/v1';

export async function createPayment(apiKey, amount, currency, orderId, successUrl, cancelUrl) {
  const payload = {
    price_amount: Number(amount),
    price_currency: currency.toUpperCase(),
    pay_currency: 'USDT',
    order_id: orderId,
    success_url: successUrl,
    cancel_url: cancelUrl
  };
  const res = await fetch(`${API_BASE}/payment`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NOWPayments createPayment failed: ${res.status} ${text}`);
  }
  return res.json();
}
