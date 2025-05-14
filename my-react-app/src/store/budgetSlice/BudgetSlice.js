import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    minIndividual: "",
    maxIndividual: "",
    minGroup: "",
    minIndividual: "",
};

export const BudgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        setcurrency: (state, action) => {
            state.currency = action.payload;
        }
    }
})

export const {setcurrency} = BudgetSlice.actions;
export default BudgetSlice.reducer