import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyLanguageContext = createContext();

export const CURRENCIES = {
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, label: 'EUR (€)' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, label: 'USD ($)' },
  INR: { code: 'INR', symbol: '₹', rate: 1.0, label: 'INR (₹)' },
};

export const LANGUAGES = {
  ENG: { code: 'ENG', label: 'ENG', fullName: 'English' },
  FRA: { code: 'FRA', label: 'FRA', fullName: 'Français' },
  DEU: { code: 'DEU', label: 'DEU', fullName: 'Deutsch' },
};

export const CurrencyLanguageProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('watchhub_currency') || 'EUR';
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('watchhub_language') || 'ENG';
  });

  useEffect(() => {
    localStorage.setItem('watchhub_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('watchhub_language', language);
  }, [language]);

  const formatPrice = (inrPrice) => {
    if (typeof inrPrice !== 'number' || isNaN(inrPrice)) {
      return `${CURRENCIES[currency]?.symbol || '€'}0`;
    }

    const cur = CURRENCIES[currency] || CURRENCIES.EUR;
    if (cur.code === 'INR') {
      return `₹${inrPrice.toLocaleString('en-IN')}`;
    }

    const converted = Math.round(inrPrice * cur.rate);
    return `${cur.symbol}${converted.toLocaleString('en-US')}`;
  };

  return (
    <CurrencyLanguageContext.Provider
      value={{
        currency,
        setCurrency,
        language,
        setLanguage,
        currencies: CURRENCIES,
        languages: LANGUAGES,
        formatPrice,
      }}
    >
      {children}
    </CurrencyLanguageContext.Provider>
  );
};

export const useCurrencyLanguage = () => {
  const context = useContext(CurrencyLanguageContext);
  if (!context) {
    return {
      currency: 'EUR',
      setCurrency: () => {},
      language: 'ENG',
      setLanguage: () => {},
      currencies: CURRENCIES,
      languages: LANGUAGES,
      formatPrice: (p) => `€${(p || 0).toLocaleString()}`,
    };
  }
  return context;
};

export default CurrencyLanguageContext;
