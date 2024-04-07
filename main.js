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

// Uçak özellikleri için yeni bir stil tanımlayın
const airplaneStyle = new Style({
    image: new Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: './static/plane.png', // Uçak ikonunuzun yolunu buraya girin
        scale: 0.05, // Haritanın ölçeğine uygun şekilde ayarlayın
    }),
});

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
            style: airplaneStyle, // Her özelliğe uçak stilini uygula
        }),
    ],
    view: new View({
        center: [0, 0],
        zoom: 2,
    }),
});

map.addInteraction(new Link());
