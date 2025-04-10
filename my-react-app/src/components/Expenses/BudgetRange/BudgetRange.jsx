import React from 'react';
import './BudgetRange.css';

const BudgetRange = ({ label, min, max, currency }) => {
  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="budget-container">
      <span className="budget-label">{label.toUpperCase()}:</span>
      <span className="budget-range">
        {formatNumber(min)} {currency} - {formatNumber(max)} {currency}
      </span>
    </div>
  );
};

export default BudgetRange;
