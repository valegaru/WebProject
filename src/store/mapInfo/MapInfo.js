import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    type: "places",
    markers: []
}

export const MapInfo = createSlice({
    name: 'MapInfo',
    initialState,
    reducers: {
        setMapType:  (state, action) => {
            state.type = action.payload;
    }, 
        setMapMarkers:  (state, action) => {
            state.markers = action.payload;
    }}
        
})

export const { setMapType, setMapMarkers} = MapInfo.actions;
export default MapInfo.reducer;