import React from 'react';
import './CurrencyToggleButton.css';
import { useDispatch, useSelector } from 'react-redux';
import { setcurrency } from '../../store/currencySlice/CurrencySlice';



const CurrencyToggleButton = () => {
  
  const dispatch = useDispatch()
  const currency = useSelector((state) => state.currency.currency)
  const setCurrency = (currencyName) => {
    dispatch(setcurrency(currencyName))
  }

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
