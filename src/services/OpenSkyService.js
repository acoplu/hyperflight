// src/services/OpenSkyService.js
const fetch = require("node-fetch");
const FlightState = require('../models/FlightState');
require('dotenv').config();

const API_URL = 'https://opensky-network.org/api';

// OpenSky API credentials
const username = process.env.OPENSKY_USERNAME;
const password = process.env.OPENSKY_PASSWORD;

// Encode your credentials in base64
const base64Credentials = Buffer.from(`${username}:${password}`).toString('base64');

async function getAllFlights(boundingBox) {
    try {
        let url = `${API_URL}/states/all?`;

        if (boundingBox) {
            if (isValidBoundingBox(boundingBox)) {
                url += `lamin=${boundingBox.lamin}&lomin=${boundingBox.lomin}&lamax=${boundingBox.lamax}&lomax=${boundingBox.lomax}`;
            } else {
                throw new Error('Invalid bounding box parameters');
            }
        }

        // Set up the request headers with basic auth
        const headers = {
            'Authorization': `Basic ${base64Credentials}`
        };

        const response = await fetch(url, { headers });
        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);
            console.error('URL:', url);
            if (response.status === 404) {
                throw new Error('Flight data not found');
            } else {
                throw new Error('Error fetching flight data');
            }
        }

        const data = await response.json();
        return { time: data.time, states: data.states.map(state => new FlightState(...state)) }; // Include both time and states in the returned object
    } catch (error) {
        console.error('Error fetching flight data:', error);
        return { time: null, states: [] }; // Return default values if an error occurs
    }
}

function isValidBoundingBox(boundingBox) {
    if (!boundingBox) return false;

    // Check if all required properties are present and valid
    if (!('lamin' in boundingBox && 'lomin' in boundingBox && 'lamax' in boundingBox && 'lomax' in boundingBox)) {
        return false;
    } else if (typeof boundingBox.lamin !== 'number' || typeof boundingBox.lomin !== 'number' || typeof boundingBox.lamax !== 'number' || typeof boundingBox.lomax !== 'number') {
        return false;
    } else if (boundingBox.lamin >= boundingBox.lamax || boundingBox.lomin >= boundingBox.lomax) {
        return false;
    } else return true;
}

module.exports = getAllFlights;