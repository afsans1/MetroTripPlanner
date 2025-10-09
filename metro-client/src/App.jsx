import { useState, useEffect } from 'react';
import './App.css';
import MapExample from './components/MapExample';
import RouteBlocks from './RouteBlocks';

function App() {
  const [allStartStations, setAllStartStations] = useState([]);
  const [route, setroute] = useState([]);
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');
  const [lineStations, setlineStations] = useState([]);
  const [activeStation, setActiveStation] = useState(null);


  //fetching all the stations from api/stations and setting allStartStations with it
  useEffect(() => {
    fetch('/api/stations').
      then(res => {
        if (!res.ok){
          throw new Error(`Error! ${res.status}`);
        }
        return res.json();
      }).
      then(data => {
        
        // setroute(data);
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
  

  //fetching stations in between a start and an end
  function handleStations(startStation, endStation){
    if(startStation !== endStation){
      fetch(`/api/${startStation}/${endStation}`).
        then(res => {
          if (!res.ok){
            throw new Error(`Error! ${res.status}`);
          }
          return res.json();
        }).
        then(data => setroute(data)).
        catch(e => {
          throw new Error(`Error! ${e.message}`);
        });
    }else{
      console.log('No need to plan out a trip to the station that you are already at!');
      setroute([]);
    }
  }

  //fetching stations on a specific line(yellow,orange,blue,green)
  async function handlelineStations(startStation){
    const stationPosition = allStartStations.findIndex(station => station.name === startStation);
    const stationRoute = allStartStations[stationPosition].routeId;
    fetch(`/api/${stationRoute}`).
      then(res => {
        if (!res.ok){
          throw new Error(`Error! ${res.status}`);
        }
        return res.json();
      }).
      then(data => setlineStations(data)).
      catch(e => {
        throw new Error(`Error! ${e.message}`);
      });
  }

  //creating the drop down menu with all the stations
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
            handlelineStations(newStart);
            setEndStation('');
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

  //creating the drop down menu with all the stations on a specfic line
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

  //creating the entire App component, displays components based on certain conditions
  return (
    <div className="App">
      <div className="header">
        <h1>Metro Trip Planner</h1>
        <h2>Select Start and End Stations</h2>
        <form>
          {dropDownStartStations(allStartStations)}
          {startStation && lineStations ? dropDownEndStations(lineStations) : <div></div>}
        </form>
        
      </div>
      { endStation && route.length > 0 ? 
        <>
          <h3 style={{ color: route[0].color}}>
            {route[0].color} Line:{route.length} stations
          </h3>
          <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap'}}>
            <RouteBlocks route={route}  activeStation={activeStation}/>
          </div>
          <MapExample route={route} setActiveStation={setActiveStation}/>
        </>
        : <div></div>}
    </div>
  );
}

export default App;
