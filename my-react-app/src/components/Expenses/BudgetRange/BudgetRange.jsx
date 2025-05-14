import React from 'react';
import './BudgetRange.css';
import { useSelector } from 'react-redux';


const BudgetRange = ({label, min, max}) => {

  const currency = useSelector((state) => state.currency.currency)
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
