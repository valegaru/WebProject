import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    counter: 0,
}

export const MapInfo = createSlice({
    name: 'MapInfo',
    initialState,
    reducers: {

        setIncrement:  (state) => {
            state.value += 1;
        },

        setIncrement:  (state) => {
            state.value -= 1;
        },
    }
})

