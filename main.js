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