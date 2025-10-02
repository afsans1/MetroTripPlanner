import express from 'express';
import fs from 'node:fs/promises';

const app = express();
const port = 3000;

async function getStations() {
  const stations = [];
  const namesSeen = {}; 
  // tracks names we already added

  const content = await fs.readFile('server/data/stm_arrets_sig.geojson', 'utf-8');
  const jsonStations = JSON.parse(content);

  jsonStations.features.forEach(f => {
    const name = f.properties.stop_name;

    if (
      name.includes('Station') &&
      !name.includes('Édicule') &&
      !name.includes('(') &&
      !name.includes('Zone') &&
      !name.includes('Accès') &&
      !name.includes('/') &&
      !name.includes('REM') &&
      !name.includes('Terminus')
    ) {
      // Add only if we haven't seen this name yet
      if (!namesSeen[name]) {
        stations.push({
          name,
          coordinates: f.geometry.coordinates
        });
        namesSeen[name] = true; 
        // mark as added
      }
    }
  });

  return stations.length; 
  // now you get exactly 77 unique stations
}


app.use('/stations', async function (req, res) {
  const json = await getStations();
  res.json(json);
});



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