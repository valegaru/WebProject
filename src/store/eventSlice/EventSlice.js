import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
  loading: false,
  error: null
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    
    setEvents: (state, action) => {
      state.events = action.payload;
      console.log(action.payload, "eventss")
    },
    
    removeEvent: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    
    clearEvents: (state) => {
      state.events = [];
    },
    
    updateEvent: (state, action) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    }
  },
});

export const { 
  addEvent, 
  setEvents, 
  removeEvent, 
  updateEvent, 
  clearEvents, 
  setLoading, 
  setError 
} = eventSlice.actions;

export default eventSlice.reducer;