import { Icon } from 'leaflet';
import { Marker, Popup, Polyline } from 'react-leaflet';

import markerImage from '../assets/marker-icon.png';
import { useState, useEffect } from 'react';

const customIcon = new Icon({
  iconUrl: markerImage,
  iconSize: [38, 38],
  iconAnchor: [22, 30],
});

/**
 * fetches the wikipedia info about the metro stations
 * @param station the station that we want the wiki info from
 */
function getWikiDef(station) {
  //seperated this because of eslint error
  const wikiUrl =
    'https://en.wikipedia.org/w/api.php?action=query&' +
    'format=json&origin=*&list=search&formatversion=2&srsearch=';
  try {
    return fetch(`${wikiUrl}/${station.name}`).
      then((res) => {
        if (!res.ok) {
          throw new Error(`Error! ${res.status}`);
        }
        return res.json();
      }).
      then((data) => {
        data = data.query.search[0].snippet.replace(/<[^>]*>/g, '');
        return data;
      }).
      catch((e) => {
        throw new Error(`Error! ${e.message}`);
      });
  } catch (e) {
    throw new Error(`Error! ${e.message}`);
  }
}

/**
 * This function creates the metro markers with the popups and the polyline that connects them
 * 
 * @param route the route of the metro trip
 * @param setActiveStation method to set the currently selected station
 * @returns MetroMarkers component
 */
export default function MetroMarkers({ route, setActiveStation }) {
  const [wikiData, setWikiData] = useState({});

  //gets all the wiki definitions when the route is changed
  useEffect(() => {
    async function fetchAll() {
      const defs = {};
      for (const point of route) {
        try {
          defs[point.name] = getWikiDef(point);
        } catch (e) {
          throw new Error(`Error! ${e.message}`);
        }
        //build the defs with the def of the station wiki using the helper method
      }
      //sets the wikidata with the built defs
      setWikiData(defs);
    }
    //if the route isnt 0 it calls that helper method
    if (route.length > 0) fetchAll();
  }, [route]);

  const points = route.map((point) => [
    point.coordinates[1],
    point.coordinates[0],
  ]);
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
              style={{
                border: `10px ${point.color} solid`,
                padding: '10px',
                borderRadius: '10px',
              }}
            >
              <h2>{point.name}</h2>
              {/* if the info is there if appears, if its not it says loading... */}
              <p> {wikiData[point.name] || 'Loading...'}</p>
              <a
                href={`https://en.wikipedia.org/wiki/${point.name}`}
                target="_blank"
              >
                Read more on Wikipedia
              </a>
            </div>
          </Popup>
        </Marker>
      )}
      <Polyline pathOptions={{ color: route[0]?.color }} positions={points} />
    </>
  );
}
