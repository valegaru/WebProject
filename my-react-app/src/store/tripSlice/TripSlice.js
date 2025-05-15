import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tripId: null,
};

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setTripId: (state, action) => {
      state.tripId = action.payload;
    },
    clearTripId: (state) => {
      state.tripId = null;
    },
  },
});

export const { setTripId, clearTripId } = tripSlice.actions;
export default tripSlice.reducer;
