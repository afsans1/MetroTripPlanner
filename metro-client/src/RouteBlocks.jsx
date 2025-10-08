export default function RouteBlocks({ allStations, setAllStations }) {
  
  function selectButton(selectedStation){
    allStations = allStations.map((station) => {
      station.selected = false;
      if(station.name === selectedStation.name){
        station.selected = true;
        return station;
      }else{
        return station;
      }
    });
    setAllStations(allStations);
  }

  return (
    <>
      {allStations.map((station) => (
        <div key={station.name}>
          <button
            onClick={() => selectButton(station)}
            style={{
              backgroundColor: station.color,
              width: station.selected ? '55px' : '40px',
              height: '20px'
            }}
          ></button>
          <p>{station.name}</p>
        </div>
      ))}
    </>
    
  );
}
