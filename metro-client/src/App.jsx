import { useState, useEffect } from 'react';
import './App.css';
import MapExample from './components/MapExample';
import RouteBlocks from './RouteBlocks';

function App() {
  const [allStartStations, setAllStartStations] = useState([]);
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
          setAllStartStations(data);
        }else{
          throw new Error(`Error! Didn't get all the stations! Length: ${data.length}`);
        }
      }).
      catch(e => {
        throw new Error(`Error! ${e}`);
        
      });
  }, []);

  function handleStations(startStation, endStation){
    if(startStation !== endStation){
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
    }else{
      <p>No trip needed to go to the station you are at already!</p>;
      setAllStations([]);
    }
  }

  async function handleRouteStations(startStation){
    const stationPosition = allStartStations.findIndex(station => station.name === startStation);
    const stationRoute = allStartStations[stationPosition].routeId;
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
          {dropDownStartStations(allStartStations)}
          {startStation && routeStations ? dropDownEndStations(routeStations) : <div></div>}
        </form>
        
      </div>
      { endStation && allStations.length > 0 ? 
        <>
          <h3 style={{ color: allStations[0].color}}>
            {allStations[0].color} Line:{allStations.length} stations
          </h3>
          <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap'}}>
            <RouteBlocks allStations={allStations}/>
          </div>
          <MapExample allStations={allStations}/>
        </>
        : <div></div>}
    </div>
  );
}

export default App;
