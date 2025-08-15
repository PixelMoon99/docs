import React from 'react';

export default function Checkout({order}) {
  // Creates a payment by calling backend API which handles API keys server-side.
  const createOrder = async () => {
    try {
      const resp = await fetch('/api/v1/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: order.amount,
          currency: order.currency || 'INR',
          description: order.description || 'Order Payment',
          orderId: order.id || null,
          userId: order.userId || null
        })
      });
      const data = await resp.json();
      if (data && data.nowpayments && data.nowpayments.invoice_url) {
        // redirect to nowpayments checkout if provided
        window.location.href = data.nowpayments.invoice_url;
        return;
      }
      // handle fallback: show transaction id or instructions
      alert('Payment created. TX ID: ' + (data.txId || 'unknown'));
    } catch (e) {
      console.error('Create order error', e);
      alert('Failed to create payment. Check console.');
    }
  };

  return <button onClick={createOrder}>Pay {order.amount} {order.currency}</button>;
}
