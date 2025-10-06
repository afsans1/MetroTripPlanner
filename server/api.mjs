import express from 'express';
import fs from 'node:fs/promises';

const app = express();
const port = 3000;
let stations = [];

async function getStations() {
  try{
    const content = await fs.readFile('server/data/stm_arrets_sig.geojson', 'utf-8');
    const jsonStations = JSON.parse(content);
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
  const startPosition = stations.indexOf(startStation);
  const endPosition = stations.indexOf(endStation);
  stations.slice(startPosition, endPosition + 1);
}

app.get('/api', async function (req, res) {
  const json = await getStations();
  res.json(json);
});

app.get('/api/:num', async (req, res) => {
  const json = await getStationsOnLine(req.params.num);
  res.json(json);
});

app.get('/api/:startStation/:endStation', async (req, res) => {
  let json = await getStationsBetween(req.params.startStation, req.params.endStation);
  res.json(json);
});

app.use(express.static('../metro-client/public'));

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