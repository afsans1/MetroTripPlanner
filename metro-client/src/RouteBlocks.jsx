export default function RouteBlocks({ route, activeStation }) {

  //   const [selected, setSelected] = useState([]);
  


  return (
    <>
      {route.map(station => (
        <div key={station.name}>
          <button
            className={`route-button ${station.selected ? 'selected' : ''} 
            ${activeStation === station.name ? 'active' : ''}`}
            style={{ backgroundColor: station.color }}
          />
          <p>{station.name}</p>
        </div>
      ))}
    </>
  );
}

