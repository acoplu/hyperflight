import './styles.css';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Overlay from 'ol/Overlay';
import {LineString} from 'ol/geom';
import {Feature} from 'ol';
import {Stroke} from 'ol/style';
import {fromLonLat} from "ol/proj";

// Define a function to create a new style based on the plane's true track
function createAirplaneStyle(feature) {
    const trueTrack = feature.get('true_track');
    return new Style({
        image: new Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: './static/plane.png', // Make sure the path to your plane icon is correct
            scale: 0.1, // Adjust the scale according to your map's scale
            rotation: ((trueTrack-45) * Math.PI) / 180, // Convert true track from degrees to radians and apply as rotation
        }),
    });
}

// Define the vector source without an initial URL because we'll be setting it with a function
const vectorSource = new VectorSource({
    format: new GeoJSON()
});

// Define the vector layer with the source and style
const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: createAirplaneStyle,
});

// Define the map
const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
        vectorLayer
    ],
    view: new View({
        center: [0, 0],
        zoom: 2,
    }),
});

const flightPathSource = new VectorSource();
const flightPathLayer = new VectorLayer({
    source: flightPathSource,
    style: new Style({
        stroke: new Stroke({
            color: '#FF0000', // Path color
            width: 2 // Path width
        })
    })
});
map.addLayer(flightPathLayer);

// Updated drawFlightPath function
function drawFlightPath(icao24) {
    const historyFilePath = `./data/history/${icao24}.json`; // Ensure this path is correct
    console.log(historyFilePath)
    fetch(historyFilePath)
        .then(response => response.json())
        .then(history => {
            // Ensure history data is not empty
            if (!history || history.length === 0) {
                console.error('No history data found for', icao24);
                return;
            }
            console.log(history)
            const coordinates = history.map(pos => fromLonLat([parseFloat(pos.longitude), parseFloat(pos.latitude)]));
            console.log(coordinates)
            const flightPathFeature = new Feature({
                geometry: new LineString(coordinates)
            });

            flightPathSource.clear(); // Clear any existing paths
            flightPathSource.addFeature(flightPathFeature);
        })
        .catch(error => console.error('Error fetching flight path:', error));
}

// Function to create an info box overlay
const infoBoxOverlay = new Overlay({
    element: document.createElement('div'),
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -10],
});
map.addOverlay(infoBoxOverlay);

// Function to update and show the info box
function showInfoBox(feature) {
    const element = infoBoxOverlay.getElement();
    element.innerHTML = `
    <div class="info-box">
      <p><strong>CallSign:</strong> ${feature.get('callsign')}</p>
      <h2>Flight Details</h2>
      <hr style="border: none; border-top: 1px solid #ddd;">
      <p><strong>ICAO24:</strong> ${feature.get('icao24')}</p>
      <p><strong>OriginCountry:</strong> ${feature.get('origin_country')}</p>
      <p><strong>Velocity:</strong> ${feature.get('velocity')} m/s</p>
      <p><strong>TrueTrack:</strong> ${feature.get('true_track')}°</p>
      <p><strong>VerticalRate:</strong> ${feature.get('vertical_rate')} ft/min</p>
    </div>
  `;
    infoBoxOverlay.setPosition(feature.getGeometry().getCoordinates());
}

// Enhance updateFlightData function to include an event listener for clicks on the map
map.on('singleclick', function(evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature;
    });

    if (feature) {
        showInfoBox(feature);
        console.log(feature.get('icao24'))
        drawFlightPath(feature.get('icao24')); // Now also draw the path
    } else {
        infoBoxOverlay.setPosition(undefined); // Hide the info box when clicking elsewhere
        flightPathSource.clear(); // Optionally clear the path when clicking elsewhere
    }
});

// Function to fetch updated flight data and refresh the vector source
function updateFlightData() {
    fetch('./data/flights.json')
        .then(response => response.json())
        .then(json => {
            const features = new GeoJSON().readFeatures(json, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            vectorSource.clear(true);
            vectorSource.addFeatures(features);
        })
        .catch(error => {
            console.error('Error fetching updated flight data:', error);
        });
}

// Update the flight data immediately, and then every 15 seconds
updateFlightData();
setInterval(updateFlightData, 10000);