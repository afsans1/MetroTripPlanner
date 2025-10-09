export default function RouteBlocks({ route, setroute, activeStation }) {

  //   const [selected, setSelected] = useState([]);
  
  function selectButton(selectedStation){
    route = route.map((station) => {
      station.selected = false;
      if(station.name === selectedStation.name){
        station.selected = true;
        return station;
      }else{
        return station;
      }
    });
    setroute(route);
  }

  return (
    <>
      {route.map((station) => (
        <div key={station.name}>
          <button
            onClick={() => selectButton(station)}
            style={{
              backgroundColor: station.color,
              width: station.selected || activeStation === station.name ? '55px' : '40px',
              height: '20px'
            }}
          ></button>
          <p>{station.name}</p>
        </div>
      ))}
    </>
    
  );
}
