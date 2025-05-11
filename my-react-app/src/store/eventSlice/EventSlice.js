import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    events: []
};

const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        addEvent: (state, action) => {
            state.push(action.payload);
    },
        removeEvent: (state, action) => {
            return state.filter(event => event.id !== action.payload);
    },
    updateEvent: (state, action) => {
        const index = state.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
            state[index] = action.payload;
        }
    },
},
});

export const { addEvent, removeEvent, updateEvent } = eventSlice.actions;
export default eventSlice.reducer;