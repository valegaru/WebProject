import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const locationExample = [
    {key: 'operaHouse', location: { lat: -33.8567844, lng: 151.213108  }},
  {key: 'tarongaZoo', location: { lat: -33.8472767, lng: 151.2188164 }},
  {key: 'manlyBeach', location: { lat: -33.8209738, lng: 151.2563253 }},
  {key: 'hyderPark', location: { lat: -33.8690081, lng: 151.2052393 }},
  {key: 'theRocks', location: { lat: -33.8587568, lng: 151.2058246 }},
  {key: 'circularQuay', location: { lat: -33.858761, lng: 151.2055688 }},
  {key: 'harbourBridge', location: { lat: -33.852228, lng: 151.2038374 }},
  {key: 'kingsCross', location: { lat: -33.8737375, lng: 151.222569 }},
  {key: 'botanicGardens', location: { lat: -33.864167, lng: 151.216387 }},
  {key: 'museumOfSydney', location: { lat: -33.8636005, lng: 151.2092542 }},
  {key: 'maritimeMuseum', location: { lat: -33.869395, lng: 151.198648 }},
  {key: 'kingStreetWharf', location: { lat: -33.8665445, lng: 151.1989808 }},
]


const PoiMarkers = () => {
    return (
        <>
            {locationExample.map((poi) => {
                return (
                    <AdvancedMarker key={poi.key} position={poi.location}>
                        <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                    </AdvancedMarker>
                );
            })}
        </>
    );
}

export default PoiMarkers;