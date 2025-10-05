import { useState, useEffect } from 'react';
import './App.css';
import MapExample from './components/MapExample';

function App() {
  const [allStations, setAllStations] = useState([]);
  const [selectedStartStation, setSelectedStartStation] = useState('');
  // const [selectedEndStation, setSelectedEndStation] = useState('');

  useEffect(() => {
    fetch('/stations').
      then(res => {
        if (!res.ok){
          throw new Error(`Error! ${res.status}`);
        }
        return res.json();
      }).
      then(data => {
        console.log('Fetched stations:', data);
        if(data.length == 73){
          setAllStations(data);
        }else{
          throw new Error(`Error! Didn't get all the stations!`);
        }
      });
  }, []);

  function handleStations(e){
    setSelectedStartStation(e.target.value);
  }

  function dropDownStations(stations){
    return(
      <form>
        <label htmlFor="StartStation">Start Station:</label>
        <select
          id="startStation"
          name="startStation" value={selectedStartStation}
          onChange={handleStations}
        >
          <option value="" disabled>-- Select A Starting Station --</option>
          {stations.map(station => {
            <option key={station.name} value={station.name}>{station.name}</option>;
          })}
        

        </select>

        {/* <label htmlFor="EndStation">End Station:</label>
        <select
          id="endStation"
          name="endStation" value={selectedEndStation}
          onChange={handleStations}
        >
          <option value="" disabled>-- Select An Ending Station --</option>
          {stations.map(station => {
            <option key={station.name} value={station.name}>{station.name}</option>;
          })}
        

        </select> */}
        
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
