import { 
  MapContainer, 
  TileLayer
} from 'react-leaflet';
import MetroMarkers from './MetroMarkers';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// See https://www.youtube.com/watch?v=jD6813wGdBA if you want to customize the map
// further (optional)

export default function MapExample({allStations = []}) {
  let points = [];
  allStations.forEach(station => {
    points.push({
      name: station.name,
      lat: station.coordinates[1],
      lon: station.coordinates[0],
      color: station.color
    });
  });
  
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
        <TileLayer
          attribution={attribution}
          url={tileUrl}
        />
        <MetroMarkers route={points}/> 
      </MapContainer>
    </div>
  );
}