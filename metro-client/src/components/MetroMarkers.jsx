import { Icon  } from 'leaflet';
import { 
  Marker,
  Popup,
  // Polyline
} from 'react-leaflet';

import markerImage from '../assets/marker-icon.png';

const customIcon = new Icon({
  iconUrl: markerImage,
  iconSize: [38, 38],
  iconAnchor: [22, 30]
});

export default function MetroMarkers({route}) {
  const points = route.map(position => position);
  //beware, hardcoded!!!
  return (
    <>
      {points.map((point, i) => (
        <Marker key={i} position={[point.coordinates[1], point.coordinates[0]]} icon={customIcon} >
          <Popup><p>{point.name}</p></Popup>
        </Marker>
      ))}
      {/* {console.log(points[0].coordinates[0], points[0].coordinates[1])} */}
      
      {/* <Marker position={route[1].coordinates} icon={customIcon} />
      <Marker position={route[2].coordinates} icon={customIcon} />
      <Polyline pathOptions={{color: route[0].color}} positions={points} /> */}
    </>
  );
}