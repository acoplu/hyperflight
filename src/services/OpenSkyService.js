// src/services/OpenSkyService.js
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
        return await response.json();
    } catch (error) {
        console.error('Error fetching flight data:', error);
        return [];
    }
}

module.exports = getAllFlights;