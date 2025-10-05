import { useState } from "react";
import './App.css';
import MapExample from './components/MapExample';

function App() {
  const [allStations, setAllStations] = useState([]);

  useEffect(() => {
    fetch('/stations')
      .then(res => res.json())
      .then(data => setAllStations(data));
  }, []);

  function handleStartStation(){

  }

  return (
    <div className="App">
      <h1>Metro Trip Planner</h1>
      <h2>Select Start and End Stations</h2>
      <form>
        
      </form>
      <MapExample />
    </div>
  );
}

export default App;
