import { Icon  } from 'leaflet';
import { 
  Marker,
  Popup,
  Polyline
} from 'react-leaflet';

import markerImage from '../assets/marker-icon.png';
import { useState, useEffect } from 'react';


const customIcon = new Icon({
  iconUrl: markerImage,
  iconSize: [38, 38],
  iconAnchor: [22, 30]
});

//fetches the wikipedia info about the metro stations
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

export default function MetroMarkers({route, setActiveStation}) {
  const [wikiData, setWikiData] = useState({});
  const MAXNUMFETCH = 50;

  //gets all the wiki definitions when the route is changed
  useEffect(() => {
    async function fetchAll() {
      const defs = {};
      for (const point of route) {
        //I added this condiditon in order to not overload the server accidentally
        //I couldve added a sleep but it wouldve slowed down my website a lot
        //the number of fetches for this website arent that big so we dont need to add 
        //a set interval or timeout but this condition is there just in case
        if(route.count <= MAXNUMFETCH){
          defs[point.name] = await getWikiDef(point);
        }else{
          return;
        }
        //build the defs with the def of the station wiki using the helper method
        
      }
      //sets the wikidata with the built defs
      setWikiData(defs);
    }
    //if the route isnt 0 it calls that helper method
    if (route.length > 0) fetchAll();
  }, [route]);
  
  const points = route.map(point => [point.coordinates[1], point.coordinates[0]] );
  return (
    <>
      {route.map((point, i) => 
        <Marker
          key={i}
          position={[point.coordinates[1], point.coordinates[0]]} 
          icon={customIcon}
          //when the marker is clicked it sets the active station 
          //which then changes the style of the button
          eventHandlers={{
            click: () => {
              setActiveStation(point.name);
            },
          }}
        >
          <Popup>
            <div 
              onClick={() => {
                setActiveStation(point.name);
              }}
              //cant remove this inline styling since im using the points color
              style={{border:`10px ${point.color} solid`, padding:'10px', borderRadius:'10px'}}>
              <h2>{point.name}</h2>
              {/* if the info is there if appears, if its not it says loading... */}
              <p> {wikiData[point.name] || 'Loading...'}</p>
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