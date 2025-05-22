import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const PoiMarkers = ({ locationInfo }) => {
    return (
        <>
            {locationInfo && locationInfo.map((poi, index) => (
                <AdvancedMarker key={index} position={poi.location}>
                    <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
            ))}
        </>
    );
};

export default PoiMarkers;
