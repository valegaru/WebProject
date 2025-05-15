import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tripsId: null,
};

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    settripsId: (state, action) => {
      state.tripsId = action.payload;
    },
    cleartripsId: (state) => {
      state.tripsId = null;
    },
  },
});

export const { settripsId, cleartripsId } = tripsSlice.actions;
export default tripsSlice.reducer;
