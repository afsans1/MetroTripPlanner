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

function getWikiDef(station){
  // const encodedStationName = encodeURI(station.name);
  const wikiUrl = 'https://en.wikipedia.org/w/api.php?action=query&'
  + 'format=json&origin=*&list=search&formatversion=2&srsearch=';
  
  return fetch(`${wikiUrl}/${station.name}`).
    then(res => {
      if (!res.ok){
        throw new Error(`Error! ${res.status}`);
      }
      return res.json();
    }).
    then(data => {
      data = data.query.search[0].snippet.replace(/<[^>]*>/g, '');
      return data;
    }).
    catch(e => {
      throw new Error(`Error! ${e.message}`);
    });
}

export default function MetroMarkers({route}) {
  const points = route.map(point => [point.coordinates[1], point.coordinates[0]] );
  // const defs = route.map( (station) =>  getWikiDef(station));
  return (
    <>
      {route.map((point, i) => 
        <Marker
          key={i}
          position={[point.coordinates[1], point.coordinates[0]]} 
          icon={customIcon} 
        >
          <Popup>
            <div style={{border:`10px ${point.color} solid`, padding:'10px'}}>
              <h2>{point.name}</h2>
              <p> {getWikiDef(point).then(data => data)}</p>
              <a href={`https://en.wikipedia.org/wiki/${point.name}`} 
                target="_blank">Read more on Wikipedia</a>
            </div>
          </Popup>
        </Marker>
      )}
      <Polyline pathOptions={{color: route[0]?.color}} positions={points} />
    </>
  );
}