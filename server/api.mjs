import express from 'express';
import fs from 'node:fs/promises';

const app = express();
const port = 3000;

async function getStations() {
  let stations = [];
  const content = await fs.readFile('server/data/stm_arrets_sig.geojson', 'utf-8');
  const jsonStations = JSON.parse(content);
  jsonStations.features.forEach(f => {
    const name = f.properties.stop_name;
    //making sure we are getting a station, trying to not get a 
    //specific exit or zone but just the stations name
    if (name.includes('Station') 
    && !name.includes('Édicule') 
    && !name.includes('(') 
    && !name.includes('Zone')
    && !name.includes('Accès') 
    && !name.includes('/') 
    && !name.includes('REM')
    && !name.includes('Terminus')){
      if(stations.length > 0 ){
        stations.forEach(station => {
          if(!station.name.includes(name) ){
            //adding the rest, making sure there are no duplicates
            const station = new Object();
            station.name = name;
            station.coordinates = f.geometry.coordinates;
            stations.push(station);
          }
        });
      }else{
        //adding the first station
        const station = new Object();
        station.name = f.properties.stop_name;
        station.coordinates = f.geometry.coordinates;
        stations.push(station);
      }
      
    }
  });
  return stations;
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