import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState({
    status: 'checking',
    message: 'Verifying payment...',
    transactionId: null,
    amount: null
  });
  const debugPayment = async (id) => {
  try {
    console.log('🔍 Debug check for ID:', id);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/debug-payment/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    
    if (response.ok) {
      const debug = await response.json();
      console.log('🎯 DEBUG RESULTS:', debug);
    }
  } catch (error) {
    console.log('Debug failed:', error);
  }
};

  useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const transactionId = urlParams.get('transactionId');
  const merchantOrderId = urlParams.get('merchantOrderId');

  console.log('=== PAYMENT CALLBACK DEBUG ===');
  console.log('Full URL:', window.location.href);
  console.log('URL Search:', window.location.search);
  console.log('Parsed params:', {
    transactionId,
    merchantOrderId,
    allParams: Object.fromEntries(urlParams)
  });
  console.log('==============================');

  if (!transactionId && !merchantOrderId) {
    setPaymentStatus({
      status: 'error',
      message: 'Invalid payment callback - missing transaction details',
      transactionId: null,
      amount: null
    });
    return;
  }

  // Use merchantOrderId if available, otherwise transactionId
   const idToCheck = transactionId || merchantOrderId;
  
  // Add debug call first
  debugPayment(idToCheck);
  
  checkPaymentStatus(idToCheck, transactionId);
}, []);


  const checkPaymentStatus = async (idToCheck, originalTransactionId, currentRetryCount = 0) => {
  try {
    console.log(`Checking payment status for: ${idToCheck} (attempt ${currentRetryCount + 1})`);
    
    // Direct order status check
    const directOrderResponse = await fetch(`${import.meta.env.VITE_API_URL}/orders/check-status/${idToCheck}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    if (directOrderResponse.ok) {
      const orderData = await directOrderResponse.json();
      if (orderData.success && orderData.order) {
        const order = orderData.order;
        console.log('Direct order check - Status:', order.status);
        
        // Handle all success states with proper messaging
        if (['completed', 'processing', 'paid'].includes(order.status)) {
          let message = 'Order processed successfully!';
          if (order.status === 'completed') message = 'Order completed successfully!';
          else if (order.status === 'processing') message = 'Order is being processed!';
          else if (order.status === 'paid') message = 'Payment confirmed, processing order!';
          
          setPaymentStatus({
            status: 'success',
            message,
            transactionId: idToCheck
          });
          setTimeout(() => navigate('/user-dashboard/orders'), 3000);
          return;
        } else if (order.status === 'failed') {
          setPaymentStatus({
            status: 'failed',
            message: 'Order failed.',
            transactionId: idToCheck
          });
          return;
        }
        // If awaiting_payment, continue to retry logic
      }
    }

    // Fallback: Check all orders list
    const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    if (orderResponse.ok) {
      const data = await orderResponse.json();
      const order = data.orders?.find(o => 
        o.paymentInfo?.transactionId === idToCheck ||
        o.paymentInfo?.phonepeOrderId === idToCheck ||
        o.orderId === originalTransactionId
      );

      if (order) {
        console.log('Found order in list:', order.orderId, 'Status:', order.status);
        
        if (['completed', 'processing', 'paid'].includes(order.status)) {
          let message = 'Order processed successfully!';
          if (order.status === 'completed') message = 'Order completed successfully!';
          else if (order.status === 'processing') message = 'Order is being processed!';
          else if (order.status === 'paid') message = 'Payment confirmed, processing order!';
          
          setPaymentStatus({
            status: 'success',
            message,
            transactionId: idToCheck
          });
          setTimeout(() => navigate('/user-dashboard/orders'), 3000);
          return;
        } else if (order.status === 'failed') {
          setPaymentStatus({
            status: 'failed',
            message: 'Order failed.',
            transactionId: idToCheck
          });
          return;
        }
      }
    }

    // Check if it's a wallet transaction (only if no order found)
    try {
      const walletResponse = await fetch(`${import.meta.env.VITE_API_URL}/wallet/payment-status/${idToCheck}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (walletResponse.ok) {
        const walletData = await walletResponse.json();
        if (walletData.success) {
          const { status, localStatus } = walletData.data;
          
          if (status === 'checkout.order.completed' || localStatus === 'SUCCESS') {
            setPaymentStatus({
              status: 'success',
              message: 'Wallet top-up completed successfully!',
              transactionId: idToCheck
            });
            setTimeout(() => navigate('/user-dashboard/wallet'), 3000);
            return;
          }
        }
      }
    } catch (walletError) {
      console.log('Not a wallet transaction');
    }

    // Retry logic with reduced attempts
    if (currentRetryCount < 8) {
      setPaymentStatus({
        status: 'pending',
        message: `Verifying payment... (${currentRetryCount + 1}/8)`,
        transactionId: idToCheck
      });
      setTimeout(() => checkPaymentStatus(idToCheck, originalTransactionId, currentRetryCount + 1), 3000);
    } else {
      setPaymentStatus({
        status: 'error',
        message: 'Payment verification timed out. Please check your order history.',
        transactionId: idToCheck
      });
    }
  } catch (error) {
    console.error('Payment status check error:', error);
    setPaymentStatus({
      status: 'error',
      message: 'Failed to verify payment status',
      transactionId: idToCheck
    });
  }
};

  const getStatusIcon = () => {
    switch (paymentStatus.status) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500" />;
      case 'pending':
        return <Clock className="w-16 h-16 text-yellow-500 animate-pulse" />;
      default:
        return <AlertCircle className="w-16 h-16 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus.status) {
      case 'success': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          {getStatusIcon()}
        </div>
        
        <h2 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
          {paymentStatus.status === 'success' && 'Payment Successful!'}
          {paymentStatus.status === 'failed' && 'Payment Failed'}
          {paymentStatus.status === 'pending' && 'Processing Payment'}
          {paymentStatus.status === 'checking' && 'Verifying Payment'}
          {paymentStatus.status === 'error' && 'Payment Error'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {paymentStatus.message}
        </p>
        
        {paymentStatus.transactionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Transaction ID</p>
            <p className="font-mono text-sm break-all">{paymentStatus.transactionId}</p>
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          {paymentStatus.status === 'success' && (
            <p className="text-sm text-gray-500">
              Redirecting in 3 seconds...
            </p>
          )}
          
          {(paymentStatus.status === 'failed' || paymentStatus.status === 'error') && (
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/user-dashboard/orders')}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Orders
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Retry Check
              </button>
            </div>
          )}
          
          {paymentStatus.status === 'pending' && (
            <button
              onClick={() => navigate('/user-dashboard/orders')}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              View Orders
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;