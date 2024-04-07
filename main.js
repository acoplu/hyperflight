import './styles.css';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import Link from 'ol/interaction/Link';
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
            rotation: (trueTrack * Math.PI) / 180, // Convert true track from degrees to radians and apply as rotation
        }),
    });
}

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
        new VectorLayer({
            source: new VectorSource({
                format: new GeoJSON(),
                url: './data/flights.json',
            }),
            style: createAirplaneStyle, // Her özelliğe uçak stilini uygula
        }),
    ],
    view: new View({
        center: [0, 0],
        zoom: 2,
    }),
});

map.addInteraction(new Link());
