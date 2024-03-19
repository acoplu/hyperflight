// Import the OpenSkyService
const getAllFlights = require('../src/services/OpenSkyService');
const fs = require('fs');

// Read the existing flights.json file
fs.readFile('./flights.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading flights.json:', err);
        return;
    }

    // Parse the existing JSON data
    let flightsJson = JSON.parse(data);

    // Call the getAllFlights function and handle the promise
    getAllFlights()
        .then(flightData => {
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
                            "callsign": flight.callsign
                            // Add more properties if needed
                        }
                    };
                    flightsJson.features.push(feature); // Append the new feature to the features array
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
});