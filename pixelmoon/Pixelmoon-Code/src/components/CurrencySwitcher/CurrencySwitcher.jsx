import React, { useState, useEffect } from 'react';
// UPDATED 2025-01-27 — Created CurrencySwitcher component for INR/USD switching
import './CurrencySwitcher.css';

const CurrencySwitcher = ({ onCurrencyChange, initialCurrency = 'USD' }) => {
  const [currency, setCurrency] = useState(initialCurrency);
  const [exchangeRate, setExchangeRate] = useState(89); // Default USD to INR rate

  useEffect(() => {
    // Fetch current exchange rate from geo endpoint
    fetch('/geo')
      .then(res => res.json())
      .then(data => {
        if (data.country === 'IN') {
          setCurrency('INR');
          onCurrencyChange && onCurrencyChange('INR');
        }
      })
      .catch(err => console.warn('Could not detect location:', err));
  }, [onCurrencyChange]);

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    onCurrencyChange && onCurrencyChange(newCurrency);
  };

  const formatPrice = (price, targetCurrency) => {
    if (targetCurrency === 'INR') {
      return `₹${(price * exchangeRate).toFixed(2)}`;
    }
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="currency-switcher">
      <div className="currency-buttons">
        <button
          className={`currency-btn ${currency === 'USD' ? 'active' : ''}`}
          onClick={() => handleCurrencyChange('USD')}
        >
          USD
        </button>
        <button
          className={`currency-btn ${currency === 'INR' ? 'active' : ''}`}
          onClick={() => handleCurrencyChange('INR')}
        >
          INR
        </button>
      </div>
      <div className="exchange-rate">
        1 USD = ₹{exchangeRate}
      </div>
    </div>
  );
};

export default CurrencySwitcher;