import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expensesId: null,
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setexpensesId: (state, action) => {
      state.expensesId = action.payload;
    },
    clearexpensesId: (state) => {
      state.expensesId = null;
    },
  },
});

export const { setexpensesIdId, clearexpensesId } = expensesSlice.actions;
export default expensesSlice.reducer;
