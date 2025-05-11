import { configureStore } from '@reduxjs/toolkit';
import  AuthReducer  from './auth/AuthSlice';
import  DateReducer  from './dateSlice/DateSlice';
import  CurrencyReducer  from './currencySlice/CurrencySlice';

export const store = configureStore({
  reducer: {
    date: DateReducer,
    auth: AuthReducer,
    currency: CurrencyReducer,
    events: eventReducer,
  }
});