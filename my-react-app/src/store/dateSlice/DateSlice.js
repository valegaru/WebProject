import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedDate: null
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