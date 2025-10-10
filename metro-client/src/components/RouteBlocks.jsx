/**
 * This function creates the routeblock that represent the stations to take for the trip
 * @param route the route for the trip
 * @param activeStation the currently selected station
 */
export default function RouteBlocks({ route, activeStation }) {
  return (
    <>
      {route.map((station) => 
        <div key={station.name}>
          <button
            //defines the class name based on if activeStation is the current station
            className={`route-button ${activeStation === station.name ? 'active' : ''}`}
            style={{ backgroundColor: station.color }}
          />
          <p>{station.name}</p>
        </div>
      )}
    </>
  );
}
