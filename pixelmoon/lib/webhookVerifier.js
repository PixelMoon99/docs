const crypto = require('crypto');

function verifyHmac(rawBody, secret, headerSignature, algo = 'sha512') {
  const hmac = crypto.createHmac(algo, secret);
  hmac.update(rawBody);
  const digest = hmac.digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(headerSignature));
  } catch (e) {
    return false;
  }
}

function identifyAndVerify(rawBodyBuffer, headers) {
  const lowerHeaders = {};
  Object.keys(headers || {}).forEach(k => lowerHeaders[k.toLowerCase()] = headers[k]);

  // NOWPayments
  const npSig = lowerHeaders['x-nowpayments-sig'] || lowerHeaders['x-nowpayments-signature'] || lowerHeaders['x-nowpayments-sig'];
  if (npSig && process.env.NOWPAYMENTS_IPN_KEY) {
    const ok = verifyHmac(rawBodyBuffer, process.env.NOWPAYMENTS_IPN_KEY, npSig, 'sha512');
    if (!ok) throw new Error('NOWPayments verification failed');
    let parsed;
    try { parsed = JSON.parse(rawBodyBuffer.toString('utf8')); } catch(e){ parsed = {}; }
    const eventId = parsed.id || parsed.payment_id || parsed.invoice_id || '';
    return { gateway: 'nowpayments', eventId };
  }

  // MatrixSols (example)
  const msSig = lowerHeaders['x-matrixsols-signature'] || lowerHeaders['x-signature'] || lowerHeaders['matrixsols-signature'];
  if (msSig && process.env.MATRIXSOL_API_KEY) {
    // MatrixSols doc mentioned sha256/hmac; using sha256 here
    const ok = verifyHmac(rawBodyBuffer, process.env.MATRIXSOL_API_KEY, msSig, 'sha256');
    if (!ok) throw new Error('MatrixSols verification failed');
    let parsed;
    try { parsed = JSON.parse(rawBodyBuffer.toString('utf8')); } catch(e){ parsed = {}; }
    const eventId = parsed.id || parsed.transaction_id || '';
    return { gateway: 'matrixsols', eventId };
  }

  throw new Error('Unknown or unverifiable gateway');
}

module.exports = { identifyAndVerify, verifyHmac };
