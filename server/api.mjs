import express from 'express';
import fs from 'node:fs/promises';

const app = express();
const port = 3000;
let stations = [];

app.use(express.static('../metro-client/dist'));

async function getStations() {
  if (stations.length > 0) return stations;

  try{
    const content = await fs.readFile('server/data/stm_arrets_sig.geojson', 'utf-8');
    const jsonStations = JSON.parse(content);

    stations = [];

    jsonStations.features.forEach(f => {
      const name = f.properties.stop_name;
      const url = f.properties.stop_url;
      const routeId = f.properties.route_id;
      //making sure we are getting a station by making sure the url includes metro
      if (
        url !== null 
        && url.includes('metro') 
        || routeId === 1 
        || routeId === 2 
        || routeId === 4 
        || routeId === 5){
        const station = new Object();
        station.name = name;
        station.coordinates = f.geometry.coordinates;
        station.routeId = routeId;
        station.selected = false;
        switch(routeId){
        case '1':
          station.color = 'green';
          break;
        case '2':
          station.color = 'orange';
          break;
        case '4':
          station.color = 'yellow';
          break;
        case '5':
          station.color = 'blue';
          break;
        default:
          station.color = 'pink';
        }
        
        stations.push(station);
      }
    });
  } catch (e) {
    throw new Error(e);
  }
  return stations;
}

async function getStationsOnLine(num) {
  if(stations.length === 0){
    stations = await getStations();
  }else{
    const stationsOnLine = stations.filter(station => station.routeId === num);
    return stationsOnLine;
  }
}

async function getStationsBetween(startStation, endStation){
  let newStations;
  if(stations.length === 0){
    stations = await getStations();
  }else{
    const startPosition = stations.findIndex(station => station.name === startStation);
    const endPosition = stations.findIndex(station => station.name === endStation);
    if(endPosition === 0){
      const reversedStations = stations.slice().reverse();
      newStations = reversedStations.slice(
        -1 * (startPosition + 1), 
        reversedStations[reversedStations.length]
      );
    }else if(startPosition === endPosition){
      return startPosition[startPosition];
    }else if(startPosition < endPosition && (startPosition !== 0 || endPosition !== 0)){
      newStations = stations.slice(startPosition, endPosition + 1);
    }else if(startPosition > endPosition && (startPosition !== 0 || endPosition !== 0)){
      const reversedStations = stations.slice().reverse();
      newStations = reversedStations.slice(-1 * (startPosition + 1), -1 * (endPosition + 1));
    }
    return newStations;
  }
}

app.get('/api/stations', async function (req, res) {
  const json = await getStations();
  res.json(json);
});

app.get('/api/:num', async (req, res) => {
  const json = await getStationsOnLine(req.params.num);
  res.json(json);
});

app.get('/api/:startStation/:endStation', async (req, res) => {
  const json = await getStationsBetween(req.params.startStation, req.params.endStation);
  res.json(json);
});



app.listen(port, () => {
  console.log(`Example app app listening at http://localhost:${port}`);
});

app.use(function (req, res) {
  res.status(404).send('Sorry can\'t find that!');
});

// const server = app.listen(port);

// // SIGTERM doesn't work on Windows. This works when the server is a Unix process and we `kill` it
// process.on('SIGTERM', () => {
//   console.debug('SIGTERM signal received: closing HTTP server');
//   server.close(() => {
//     console.debug('HTTP server closed');
//   });
// });