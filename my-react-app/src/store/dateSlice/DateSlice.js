import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedDate: "2025-04-07"
};

export const DateSlice = createSlice({
    name: 'date',
    initialState,
    reducers: {
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload;
        }
    }
})

export const {setSelectedDate} = DateSlice.actions;
export default DateSlice.reducer