import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    events: []
};

const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {

    addEvent: (state, action) => {
            state.events.push(action.payload);
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
    }},
});

export const { addEvent, removeEvent, updateEvent, clearEvents } = eventSlice.actions;
export default eventSlice.reducer;