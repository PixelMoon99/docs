module.exports = function parseNowPayments(payload) {
  // minimal parser - expand as needed
  return {
    id: payload.id || payload.payment_id || payload.iid,
    status: payload.payment_status || payload.status,
    amount: payload.price_amount || payload.price || 0,
    currency: payload.price_currency || payload.pay_currency || null,
    raw: payload
  };
};
