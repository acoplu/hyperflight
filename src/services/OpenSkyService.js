// src/services/OpenSkyService.js
const fetch = require("node-fetch");
const FlightState = require('../models/FlightState');

const API_URL = 'https://opensky-network.org/api';

async function getAllFlights(boundingBox) {
    try {
        let url = `${API_URL}/states/all?`

        if (boundingBox) {
            url += `lamin=${boundingBox.lamin}&lomin=${boundingBox.lomin}&lamax=${boundingBox.lamax}&lomax=${boundingBox.lomax}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            console.error('Response: ', response)
            console.error('URL: ', url)
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.states.map(state => new FlightState(...state));
    } catch (error) {
        console.error('Error fetching flight data:', error);
        return [];
    }
}

module.exports = getAllFlights;