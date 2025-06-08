import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    type: "places"
}

export const MapInfo = createSlice({
    name: 'MapInfo',
    initialState,
    reducers: {
        setMapType:  (state, action) => {
            state.type = action.payload;
    }}
})

export const { setMapType } = MapInfo.actions;
export default MapInfo.reducer;