import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenseId: null,
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    setTripId: (state, action) => {
      state.expenseId = action.payload;
    },
    clearTripId: (state) => {
      state.expenseId = null;
    },
  },
});

export const { setTripId, clearTripId } = expenseSlice.actions;
export default expenseSlice.reducer;
