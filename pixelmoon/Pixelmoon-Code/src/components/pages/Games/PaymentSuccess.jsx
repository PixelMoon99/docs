// PaymentSuccess.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Your game purchase has been completed successfully.
        </p>
        <button
          onClick={() => navigate('/games')}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue Gaming
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;