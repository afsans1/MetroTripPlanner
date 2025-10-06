import { useState, useEffect } from 'react';
import './App.css';
import MapExample from './components/MapExample';

function App() {
  const [allStations, setAllStations] = useState([]);
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');

  useEffect(() => {
    fetch('api').
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
          throw new Error(`Error! Didn't get all the stations!`);
        }
      }).
      catch(e => {
        throw new Error(`Error! ${e}`);
        
      });
  }, []);

  function handleStations(startStation, endStation){
    if(startStation === ''){
      setStartStation(allStations[0].name);
    }
    if(endStation === ''){
      setEndStation(allStations[allStations.length - 1].name);
    }
    const startPosition = allStations.indexOf(startStation);
    const endPosition = allStations.indexOf(endStation);
      
    const newStations = allStations.slice(startPosition, endPosition + 1);
    setAllStations(newStations);
  }

  function dropDownStations(stations){
    return(
      <form>
        <label>Start Station:</label>
        <select
          id="startStation"
          name="startStation" value={startStation}
          onChange={(e) =>{
            setStartStation(e.target.value);
            handleStations(startStation, endStation);
          }}
        >
          <option value="" disabled>-- Select A Starting Station --</option>
          {stations.map(station => 
            <option key={station.name} value={station.name}>{station.name}</option>
          )}
        </select>

        <label htmlFor="EndStation">End Station:</label>
        <select
          id="endStation"
          name="endStation" value={endStation}
          onChange={(e) =>{
            setEndStation(e.target.value);
            handleStations();
          }}
        >
          <option value="" disabled>-- Select An Ending Station --</option>
          {stations.map(station => 
            <option key={station.name} value={station.name}>{station.name}</option>
          )}
        

        </select>
        
      </form>

      
    );
  }

  return (
    <div className="App">
      <div>
        <h1>Metro Trip Planner</h1>
        <h2>Select Start and End Stations</h2>
        {dropDownStations(allStations)}
      </div>
      <MapExample />
    </div>
  );
}

export default App;
