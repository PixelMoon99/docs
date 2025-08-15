module.exports = function parseMatrixSols(payload) {
  return {
    id: payload.id || payload.transaction_id || null,
    status: payload.status || payload.payment_status || null,
    amount: payload.amount || payload.price_amount || 0,
    raw: payload
  };
};
