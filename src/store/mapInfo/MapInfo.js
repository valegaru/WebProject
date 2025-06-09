import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    type: "places",
    markers: [],
    savedLists: [], 
}

export const MapInfo = createSlice({
    name: 'MapInfo',
    initialState,
    reducers: {
        setMapType: (state, action) => {
            state.type = action.payload;
        }, 
        addMapMarkers: (state, action) => {
            state.markers = [...state.markers, action.payload];
            console.log("markersss", state.markers)
        },
        removeMapMarkers: (state, action) => {
            state.markers = state.markers.filter(marker => marker.id !== action.payload);
            console.log("markersss", state.markers)
        },
        setMapMarkers: (state, action) => {
            state.markers = action.payload;
            console.log("markersss", state.markers)
        },
        clearMapMarkers: (state) => {
            state.markers = [];
            console.log("markersss", state.markers)
        },
        setSavedLists: (state, action) => {
            state.savedLists = action.payload;
        }
    }
})

export const { setSavedLists, setMapType, addMapMarkers, removeMapMarkers, setMapMarkers, clearMapMarkers } = MapInfo.actions;
export default MapInfo.reducer;