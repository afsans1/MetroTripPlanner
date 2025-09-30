import express from 'express';
import { stat } from 'node:fs';
import fs from 'node:fs/promises';

const app = express();
const port = 3000;

async function getStations() {
  let stations = [];
  const content = await fs.readFile('server/data/stm_arrets_sig.geojson', 'utf-8');
  const jsonStations = JSON.parse(content);
  jsonStations.features.forEach(f => {
    //making sure we are getting a station, trying to not get a 
    //specific exit or zone but just the stations name
    if (f.properties.stop_name.includes('Station') && !f.properties.stop_name.includes('Édicule') 
    && !f.properties.stop_name.includes('(') && !f.properties.stop_name.includes('Zone')
    && !f.properties.stop_name.includes('Accès') && !stations.includes(f.properties.stop_name)
    && !f.properties.stop_name.includes('/') && !f.properties.stop_name.includes('REM')
    && !f.properties.stop_name.includes('Terminus')){
      stations.push(f.properties.stop_name);
    }
  });
  return stations;
}

const json = await getStations();

console.log(json);

app.use(express.static('public'));
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.listen(port, () => {
  console.log(`Example app app listening at http://localhost:${port}`);
});

app.use(function (req, res) {
  res.status(404).send('Sorry can\'t find that!');
});

// const server = app.listen(port)

// // SIGTERM doesn't work on Windows. This works when the server is a Unix process and we `kill` it
// process.on('SIGTERM', () => {
//   console.debug('SIGTERM signal received: closing HTTP server')
//   server.close(() => {
//     console.debug('HTTP server closed')
//   })
// })