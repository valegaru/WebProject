import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenseId: null,
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    setExpenseId: (state, action) => {
      state.expenseId = action.payload;
    },
    clearExpenseId: (state) => {
      state.expenseId = null;
    },
  },
});

export const { setExpenseIdId, clearExpenseId } = expenseSlice.actions;
export default expenseSlice.reducer;
