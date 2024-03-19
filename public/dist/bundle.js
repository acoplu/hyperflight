(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
"use strict";

// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var globalObject = getGlobal();

module.exports = exports = globalObject.fetch;

// Needed for TypeScript and Webpack.
if (globalObject.fetch) {
	exports.default = globalObject.fetch.bind(globalObject);
}

exports.Headers = globalObject.Headers;
exports.Request = globalObject.Request;
exports.Response = globalObject.Response;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
// src/components/MapComponent.js
const getAllFlights = require('../services/OpenSkyService.js');

function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat: 39, lng: 32} // Default center (Ankara)
    });

    // Fetch real flight data
    getAllFlights()
        .then(flightData => {
            // Create markers for each flight
            flightData.states.forEach(flight => {
                // Create a marker for the plane's position
                const planeMarker = new google.maps.Marker({
                    position: { lat: flight.latitude, lng: flight.longitude },
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, // Use a forward arrow as the icon
                        scale: 5,                                          // Set the size of the arrow
                        fillColor: "#FF0000",                              // Set the color of the arrow
                        fillOpacity: 1,                                    // Set the opacity of the arrow
                        strokeWeight: 1,                                   // Set the weight of the arrow's outline
                        rotation: flight.trueTrack,                        // Set the rotation angle of the arrow (in degrees)
                    },
                    title: flight.callsign,                                // Tooltip text for the marker
                });
            });
        })
        .catch(error => {
            console.error('Error fetching flight data:', error);
        });
}

// Export initMap function
module.exports = initMap;
},{"../services/OpenSkyService.js":4}],3:[function(require,module,exports){
// src/models/FlightState.js
class FlightState {
    constructor(icao24, callsign, originCountry, timePosition, lastContact, longitude, latitude, baroAltitude, onGround, velocity, trueTrack, verticalRate, sensors, geoAltitude, squawk, spi, positionSource, category) {
        this.icao24 = icao24;
        this.callsign = callsign;
        this.originCountry = originCountry;
        this.timePosition = timePosition;
        this.lastContact = lastContact;
        this.longitude = longitude;
        this.latitude = latitude;
        this.baroAltitude = baroAltitude;
        this.onGround = onGround;
        this.velocity = velocity;
        this.trueTrack = trueTrack;
        this.verticalRate = verticalRate;
        this.sensors = sensors;
        this.geoAltitude = geoAltitude;
        this.squawk = squawk;
        this.spi = spi;
        this.positionSource = positionSource;
        this.category = category;
    }
}

module.exports = FlightState;
},{}],4:[function(require,module,exports){
// src/services/OpenSkyService.js
const fetch = require("node-fetch");
const FlightState = require('../models/FlightState');

const API_URL = 'https://opensky-network.org/api';

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

        const response = await fetch(url);
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
},{"../models/FlightState":3,"node-fetch":1}]},{},[2]);
