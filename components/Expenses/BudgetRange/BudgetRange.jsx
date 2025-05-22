import React from 'react';
import './BudgetRange.css';
import { useSelector } from 'react-redux';

const BudgetRange = ({ label }) => {
  const events = useSelector((state) => state.events.events);
  const uid = useSelector((state) => state.auth.userId);
  const currency = useSelector((state) => state.currency.currency);

  if (!Array.isArray(events)) {
    return null;
  }

  const individualTotal = events.reduce((sum, event) => {
    const yourParticipation = event.participants
      ? Object.values(event.participants).find(p => p.userID === uid)
      : null;
    return yourParticipation ? sum + Number(yourParticipation.contribution) : sum;
  }, 0);

  const groupTotal = events.reduce((sum, event) => sum + Number(event.amount), 0);
  const amount = label === 'individual' ? individualTotal : groupTotal;

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="budget-container">
      <span className="budget-label">{label.toUpperCase()}:</span>
      <span className="budget-range">
        {formatNumber(amount)} {currency}
      </span>
    </div>
  );
};

export default BudgetRange;
