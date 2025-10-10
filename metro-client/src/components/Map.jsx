import { MapContainer, TileLayer } from 'react-leaflet';
import MetroMarkers from './MetroMarkers';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// See https://www.youtube.com/watch?v=jD6813wGdBA if you want to customize the map
// further (optional)

/**
 * This function creates the map in montreal
 * @param route route of the trip 
 * @param setActiveStation method to set the current selected station
 * @param setError method to set the error in the p elem
 * @returns Map component
 */
export default function Map({ route = [], setActiveStation, setError }) {
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  // TODO this is a demo of react-leaflet.  Feel free to modify the CSS.
  return (
    <div className="ui-container">
      {/* See leaflet-container CSS class */}
      <MapContainer
        center={[45.5, -73.6]}
        zoom={12}
        zoomControl={true}
        updateWhenZooming={false}
        updateWhenIdle={true}
        preferCanvas={true}
        minZoom={10}
        maxZoom={16}
      >
        <TileLayer attribution={attribution} url={tileUrl} />
        <MetroMarkers
          route={route}
          setActiveStation={setActiveStation}
          setError={setError}
        />
      </MapContainer>
    </div>
  );
}
