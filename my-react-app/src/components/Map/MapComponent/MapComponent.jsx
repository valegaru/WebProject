import { APIProvider, Map } from "@vis.gl/react-google-maps";
import PoiMarkers from "../PoiMarker/PoiMarkers";

const MapComponent = () => {
    return(
    <>
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
            style={{width: '100vw', height: '50vh'}}
            defaultCenter={{lat: 22.54992, lng: 0}}
            defaultZoom={3}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            mapId={"3559db7569081dbf973e4ebf"}
        >
            <PoiMarkers></PoiMarkers> 
        </Map>
    </APIProvider>
    </>
    )
}

export default MapComponent;