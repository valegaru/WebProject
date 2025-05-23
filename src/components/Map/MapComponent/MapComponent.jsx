import { APIProvider, InfoWindow, Map } from "@vis.gl/react-google-maps";
import PoiMarkers from "../PoiMarker/PoiMarkers";
import { useState } from "react";

const MapComponent = () => {

    const [selectedLocation, setSelectedLocation] = useState();
    const [showDialog, setShowDialog] = useState(false);
    const [dialogLocation, setDialogLocation] = useState("");

    const onAddLocation = () => {
        console.log("Added")
    }

    const handleMapClick = (mapInfo) => {
        if (mapInfo) {
            const lat = mapInfo.location.lat
            const lng = mapInfo.location.lng
            setDialogLocation(lat,lng);
            setSelectedLocation(lat,lng);
            setShowDialog(true);
        } else {
            console.log("NO LOCATION SPECIFIED")
        }
    }

    return(
    <>
    {showDialog && (

    <InfoWindow position={dialogLocation}>
        <button className="app-button" onClick={onAddLocation}>
        Add this location
        </button>
    </InfoWindow>
    )}

    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
            style={{width: '100vw', height: '50vh'}}
            defaultCenter={{lat: 22.54992, lng: 0}}
            defaultZoom={3}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            mapId={"3559db7569081dbf973e4ebf"}
            onClick={(mapInfo)=>handleMapClick(mapInfo)}
        >
            <PoiMarkers locationInfo={selectedLocation}></PoiMarkers> 
        </Map>
    </APIProvider>
    </>
    )
}

export default MapComponent;