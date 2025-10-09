import { useState, useEffect } from 'react';
import './App.css';
import MapExample from './components/MapExample';
import RouteBlocks from './RouteBlocks';
import DropDownStations from './DropDownStations';

const AMOUNT_OF_STATION = 73;
function App() {
  const [allStartStations, setAllStartStations] = useState([]);
  const [route, setroute] = useState([]);
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');
  const [lineStations, setlineStations] = useState([]);
  const [activeStation, setActiveStation] = useState(null);
  const [error, setError] = useState('');

  //fetching all the stations from api/stations and setting allStartStations with it
  useEffect(() => {
    fetch('/api/stations').
      then((res) => {
        if (!res.ok) {
          throw new Error(`Error! ${res.status}`);
        }
        return res.json();
      }).
      then((data) => {
        if (data.length === AMOUNT_OF_STATION) {
          setAllStartStations(data);
        } else {
          throw new Error(
            `Error! Didn't get all the stations! Length: ${data.length}`,
          );
        }
      }).
      catch((e) => {
        throw new Error(`Error! ${e}`);
      });
  }, []);

  //fetching stations in between a start and an end
  function handleStations(startStation, endStation) {
    setError('');
    if (startStation !== endStation) {
      fetch(`/api/${startStation}/${endStation}`).
        then((res) => {
          if (!res.ok) {
            throw new Error(`Error! ${res.status}`);
          }
          return res.json();
        }).
        then((data) => setroute(data)).
        catch((e) => {
          throw new Error(`Error! ${e.message}`);
        });
    } else {
      setError(
        'No need to plan out a trip to the station that you are already at!'
      );
      setroute([]);
    }
  }

  //fetching stations on a specific line(yellow,orange,blue,green)
  async function handlelineStations(startStation) {
    const stationPosition = allStartStations.findIndex(
      (station) => station.name === startStation,
    );
    const stationRoute = allStartStations[stationPosition].routeId;
    fetch(`/api/${stationRoute}`).
      then((res) => {
        if (!res.ok) {
          throw new Error(`Error! ${res.status}`);
        }
        return res.json();
      }).
      then((data) => setlineStations(data)).
      catch((e) => {
        throw new Error(`Error! ${e.message}`);
      });
  }

  //creating the entire App component, displays components based on certain conditions
  return (
    <div className="App">
      <div className="header">
        <h1>Metro Trip Planner</h1>
        <h2>Select Start and End Stations</h2>
        <p className="error">{error}</p>
        <form>
          <DropDownStations
            stations={allStartStations}
            station={startStation}
            onChange={(e) => {
              const newStart = e.target.value;
              setStartStation(newStart);
              handlelineStations(newStart);
              setEndStation('');
            }}
            label="Start Station:"
          />
          {/* if the start station is selected and we have the stations on that line we display
          the  dropDownEndStations*/}
          {startStation && lineStations.length > 0 ?
            <DropDownStations
              stations={lineStations}
              station={endStation}
              onChange={(e) => {
                const newEnd = e.target.value;
                setEndStation(newEnd);
                handleStations(startStation, newEnd);
              }}
              label="End Station:"
            />
            : <div></div>
          }
        </form>
      </div>
      {/* if we have the endStation and the route of from the start to the end is greater than 0
      we display the RouteBlocks and the MapExample */}
      {endStation && route.length > 0 ? 
        <>
          <h3 style={{ color: route[0].color }}>
            {route[0].color} Line:{route.length} stations
          </h3>
          <div className="routeSection">
            <RouteBlocks route={route} activeStation={activeStation} />
          </div>
          <MapExample
            route={route}
            setActiveStation={setActiveStation}
            setError={setError}
          />
        </>
        : <div></div>
      }
    </div>
  );
}

export default App;
