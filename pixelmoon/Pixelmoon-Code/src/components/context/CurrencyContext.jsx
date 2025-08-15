import React, { createContext, useContext, useEffect, useState } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'INR');

  useEffect(() => {
    const detect = async () => {
      try {
        if (!localStorage.getItem('currency')) {
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/geo`);
          if (res.ok) {
            const data = await res.json();
            if (data.country && data.country !== 'IN') setCurrency('USD');
          }
        }
      } catch (_) {}
    };
    detect();
  }, []);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);