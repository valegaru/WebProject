import React from 'react';
import './CurrencyToggleButton.css';

const CurrencyToggleButton = ({ currency, setCurrency }) => {
  return (
    <div className="currency-toggle">
      <button
        className={currency === 'COP' ? 'active' : ''}
        onClick={() => setCurrency('COP')}
      >
        COL$
      </button>
      <button
        className={currency === 'EUR' ? 'active' : ''}
        onClick={() => setCurrency('EUR')}
      >
        EUR€
      </button>
    </div>
  );
};

export default CurrencyToggleButton;
