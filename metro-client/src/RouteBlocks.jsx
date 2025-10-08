export default function RouteBlocks({ allStations }) {
  
  
  return (
    <>
      {allStations.map((station) => (
        <div key={station.name}>
          <button
            style={{
              backgroundColor: station.color,
              width: '40px',
              height: '20px'
            }}
          ></button>
          <p>{station.name}</p>
        </div>
      ))}
    </>
    
  );
}
