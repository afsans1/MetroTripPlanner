import { Icon  } from 'leaflet';
import { 
  Marker,
  Popup,
  Polyline
} from 'react-leaflet';

import markerImage from '../assets/marker-icon.png';

const customIcon = new Icon({
  iconUrl: markerImage,
  iconSize: [38, 38],
  iconAnchor: [22, 30]
});

export default function MetroMarkers({route}) {
  const points = route.map(point => [point.coordinates[1], point.coordinates[0]] );
  return (
    <>
      {route.map((point, i) => 
        <Marker
          key={i}
          position={[point.coordinates[1], point.coordinates[0]]} 
          icon={customIcon} 
        >
          <Popup><p>{point.name}</p></Popup>
        </Marker>
      )}
      <Polyline pathOptions={{color: route[0]?.color}} positions={points} />
    </>
  );
}