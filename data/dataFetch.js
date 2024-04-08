// Import the OpenSkyService
const getAllFlights = require('../src/services/OpenSkyService');
const fs = require('fs');

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
                }
            });

            // Convert the updated JSON data to a JSON string
            flightsJson = JSON.stringify(flightsJson, null, 2);

            // Write the updated JSON string back to the flights.json file
            fs.writeFileSync('./flights.json', flightsJson);

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
