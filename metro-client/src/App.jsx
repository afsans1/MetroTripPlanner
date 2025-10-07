import { useState, useEffect } from 'react';
import './App.css';
import MapExample from './components/MapExample';

function App() {
  const [allStations, setAllStations] = useState([]);
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');
  const [routeStations, setRouteStations] = useState([]);

  useEffect(() => {
    fetch('/api/stations').
      then(res => {
        if (!res.ok){
          throw new Error(`Error! ${res.status}`);
        }
        return res.json();
      }).
      then(data => {
        
        // setAllStations(data);
        if(data.length === 73){
          setAllStations(data);
        }else{
          throw new Error(`Error! Didn't get all the stations! Length: ${data.length}`);
        }
      }).
      catch(e => {
        throw new Error(`Error! ${e}`);
        
      });
  }, []);

  function handleStations(startStation, endStation){
    fetch(`/api/${startStation}/${endStation}`).
      then(res => {
        if (!res.ok){
          throw new Error(`Error! ${res.status}`);
        }
        return res.json();
      }).
      then(data => setAllStations(data)).
      catch(e => {
        throw new Error(`Error! ${e.message}`);
      });
  }

  async function handleRouteStations(startStation){
    const stationPosition = allStations.findIndex(station => station.name === startStation);
    const stationRoute = allStations[stationPosition].routeId;
    fetch(`/api/${stationRoute}`).
      then(res => {
        if (!res.ok){
          throw new Error(`Error! ${res.status}`);
        }
        return res.json();
      }).
      then(data => setRouteStations(data)).
      catch(e => {
        throw new Error(`Error! ${e.message}`);
      });
  }

  function dropDownStartStations(stations){
    return(
      <>
        <label>Start Station:</label>
        <select
          id="startStation"
          name="startStation" value={startStation}
          onChange={(e) =>{
            const newStart = e.target.value;
            setStartStation(newStart);
            handleRouteStations(newStart);
          }}
        >
          <option value="" disabled>-- Select A Starting Station --</option>
          {stations.map(station => 
            <option key={station.name} value={station.name}>{station.name}</option>
          )}
        </select>
      </>
    );
  }

  function dropDownEndStations(stations){
    return( <>
      <label htmlFor="EndStation">End Station:</label>
      <select
        id="endStation"
        name="endStation" value={endStation}
        onChange={(e) =>{
          const newEnd = e.target.value; 
          setEndStation(newEnd);
          handleStations(startStation, newEnd);
        }}
      >
        <option value="" disabled>-- Select An Ending Station --</option>
        {stations.map(station => 
          <option key={station.name} value={station.name}>{station.name}</option>
        )}
      </select>
    </>);
  }

  return (
    <div className="App">
      <div>
        <h1>Metro Trip Planner</h1>
        <h2>Select Start and End Stations</h2>
        <form>
          {dropDownStartStations(allStations)}
          {startStation && routeStations ? dropDownEndStations(routeStations) : <div></div>}
        </form>
        
      </div>
      { endStation ? 
        <>
          {allStations.map((station) => 
            <div key={station.name}>
              <button style={{ backgroundColor: station.color,
                padding: '50px', display: 'flex'}}></button>
              <p>{station.name}</p>
            </div>
          )}
          <MapExample allStations={allStations}/>
        </>
        : <div></div>}
    </div>
  );
}

export default App;
