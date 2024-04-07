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
setInterval(updateFlightData, 15000);
