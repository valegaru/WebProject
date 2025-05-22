import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currency: 'EUR'
};

export const CurrencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setcurrency: (state, action) => {
            state.currency = action.payload;
        }
    }
})

export const {setcurrency} = CurrencySlice.actions;
export default CurrencySlice.reducer