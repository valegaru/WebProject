import { configureStore } from '@reduxjs/toolkit';
import  AuthReducer  from './auth/AuthSlice';
import  DateReducer  from './dateSlice/DateSlice';
import  CurrencyReducer  from './currencySlice/CurrencySlice';
import  EventReducer from './eventSlice/EventSlice'
import  BudgetReducer from './budgetSlice/BudgetSlice'
import  TripReducer from './tripSlice/TripSlice'
import  ExpenseReducer from './expenseSlice/ExpenseSlice'

export const store = configureStore({
  reducer: {
    date: DateReducer,
    auth: AuthReducer,
    currency: CurrencyReducer,
    events: EventReducer,
    trip: TripReducer,
    expense: ExpenseReducer,
    budget: BudgetReducer,
  }
});