// Import the OpenSkyService
const getAllFlights = require('../src/services/OpenSkyService');
const fs = require('fs');
const path = require('path');

// This function appends a flight's current position to its history
function appendFlightHistory(flight) {
    const historyFilePath = path.join(__dirname, './history', `${flight.icao24}.json`);

    let history = [];
    if (fs.existsSync(historyFilePath)) {
        history = JSON.parse(fs.readFileSync(historyFilePath));
    }

    history.push({
        latitude: flight.latitude,
        longitude: flight.longitude
    });

    // Limit history size to avoid large files (optional)
    const maxHistorySize = 100; // Example: Keep the last 100 positions
    if (history.length > maxHistorySize) {
        history = history.slice(-maxHistorySize);
    }

    fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));
}

function fetchData() {
    // Call the getAllFlights function and handle the promise
    getAllFlights()
        .then(flightData => {
            let flightsJson = { "type": "FeatureCollection", "features": [] };

            // Loop through each flight and create a GeoJSON Feature for each one
            flightData.states.forEach(flight => {
                // Check if the flight has valid latitude and longitude
                if (flight.latitude !== null && flight.longitude !== null) {
                    const feature = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [flight.longitude, flight.latitude]
                        },
                        "properties": {
                            "icao24": flight.icao24,
                            "callsign": flight.callsign,
                            "origin_country": flight.originCountry,
                            "velocity": flight.velocity,
                            "true_track": flight.trueTrack,
                            "vertical_rate": flight.verticalRate,
                            "on_ground": flight.onGround
                        }
                    };
                    flightsJson.features.push(feature);
                    appendFlightHistory(flight);
                }
            });

            // Convert the updated JSON data to a JSON string
            flightsJson = JSON.stringify(flightsJson, null, 2);

            // Write the updated JSON string back to the flights.json file
            const filePath = path.join(__dirname, './flights.json'); // Construct the absolute path
            fs.writeFileSync(filePath, flightsJson);

            console.log('Flight data appended to flights.json');
        })
        .catch(error => {
            // Handle any errors that occur during the API request
            console.error('Error fetching flight data:', error);
        });
}

// Set an interval to fetch the data every 15 seconds
fetchData()
setInterval(fetchData, 5000);