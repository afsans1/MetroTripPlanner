# A2 Metro Trip Planner

## Requirements
The website should allow the user to create a trip planner based on which station they want to start at and where to end. The website should use the stm stops geojson file, parse it and use that list to display the correct stations. There should be a client and server side. When the client clicks on a marker it should allow them to see the wikipedia definition of the station. 

Express + React app

Description: (briefly describe what the app does)

## Structure

There are two directories in the __root__ of the project.

* The Express server is in `server/`
* The React app is in `metro-client/
* The server responds to API calls and serves the __built__ React app.

There are 3 package.json files -- see what `scripts` they define.

## Setup

To install all the dependencies and build the React app run:

```
npm run build
```

## To run the app
npm run dev to open the client side and node --watch server/api.mjs on two different terminals on vscode then open http://localhost:5173/ to visit the website!


### Just the client

```
cd metro-client
npm run dev
```


### Just the server

node --watch server/api.mjs

### Client and Server


> Fill this in 

