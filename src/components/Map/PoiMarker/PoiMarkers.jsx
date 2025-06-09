import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const PoiMarkers = ({ locationInfo }) => {

    if (!locationInfo) return null;
    
    return (
        <AdvancedMarker position={locationInfo}>
            <Pin background={'#c34040'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
    );
};

export default PoiMarkers;
