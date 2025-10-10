import express from 'express';
import fs from 'node:fs/promises';

const app = express();
const port = 3000;
let stations = [];

app.use(express.static('../metro-client/dist'));


/**
 * getting all of the metro stations
 * 
 * @returns all of the stations (should be 73 stations)
 */
async function getStations() {
  if (stations.length > 0) return stations;

  try {
    const content = await fs.readFile('./data/stm_arrets_sig.geojson', 'utf-8');
    const jsonStations = JSON.parse(content);

    stations = [];

    jsonStations.features.forEach((f) => {
      const name = f.properties.stop_name;
      const url = f.properties.stop_url;
      const routeId = f.properties.route_id;
      //making sure we are getting a station by making sure the url includes metro
      if (
        url !== null && url.includes('metro') ||
        routeId === 1 ||
        routeId === 2 ||
        routeId === 4 ||
        routeId === 5
      ) {
        const station = new Object();
        station.name = name;
        station.coordinates = f.geometry.coordinates;
        station.routeId = routeId;
        station.selected = false;
        switch (routeId) {
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


/**
 * getting stations on a specific line(green,yellow,blue,orange)
 * 
 * @param num the number of the specific line
 * @returns the stations on that line
 */
async function getStationsOnLine(num) {
  if (stations.length === 0) {
    stations = await getStations();
  } else {
    const stationsOnLine = stations.filter(
      (station) => station.routeId === num,
    );
    return stationsOnLine;
  }
}


/**
 * getting the stations in between the starting station and the end station
 * 
 * @param startStation the start station of the trip
 * @param endStation the end station of the trip
 * @returns the stations in between those stations (including them)
 */
async function getStationsBetween(startStation, endStation) {
  let newStations;
  if (stations.length === 0) {
    stations = await getStations();
  } else {
    const startPosition = stations.findIndex(
      (station) => station.name === startStation,
    );
    const endPosition = stations.findIndex(
      (station) => station.name === endStation,
    );
    if (startPosition === endPosition) {
      return startPosition[startPosition];
    } else if (startPosition < endPosition) {
      newStations = stations.slice(startPosition, endPosition + 1);
    } else {
      const reversedStations = stations.slice().reverse();
      newStations = reversedStations.slice(
        -1 * (startPosition + 1),
        -1 * (endPosition + 1),
      );
    }
    return newStations;
  }
}

//route to get all of the metro stations
app.get('/api/stations', async function (req, res) {
  const json = await getStations();
  res.json(json);
});

//route to get the metro stations on a specific line
app.get('/api/:num', async (req, res) => {
  const num = req.params.num;

  const lines = ['1', '2', '4', '5'];
  if (!lines.includes(num)) {
    return res.status(400).json({ error: `Invalid line number: ${num}.` });
  }
  try {
    const json = await getStationsOnLine(num);
    if (!json || json.length === 0) {
      return res.status(404).json({ error: 'no stations on this line' });
    }
    res.json(json);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//route to get the stations in between
app.get('/api/:startStation/:endStation', async (req, res) => {
  const { startStation, endStation } = req.params;

  try {
    if (!startStation || !endStation) {
      return res.
        status(400).
        json({ error: 'Start and end stations are required' });
    }

    const allStations = await getStations();
    const startExists = allStations.find((s) => s.name === startStation);
    const endExists = allStations.find((s) => s.name === endStation);

    if (!startExists) {
      return res.
        status(404).
        json({ error: `Start station '${startStation}' not found` });
    }
    if (!endExists) {
      return res.
        status(404).
        json({ error: `End station '${endStation}' not found` });
    }
    if (startStation === endStation) {
      return res.
        status(400).
        json({ error: 'Start and end stations must be different' });
    }

    const json = await getStationsBetween(startStation, endStation);

    if (!json || json.length === 0) {
      return res.
        status(404).
        json({ error: `No route between ${startStation} and ${endStation}` });
    }

    res.json(json);
  } catch (err) {
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

app.listen(port, () => {});

app.use(function (req, res) {
  res.status(404).send(`Sorry can't find that!`);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

process.on('SIGTERM', () => app.close(() => {}));
