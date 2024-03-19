// tests/OpenSkyService.test.js

// Import the function to be tested
const { fetchFlights } = require('../src/services/OpenSkyService');

// Mocking the fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ /* mock response data */ }),
    })
);

describe('OpenSkyService', () => {
    test('fetchFlights function should fetch flight data from the OpenSky API', async () => {
        // Arrange
        const boundingBox = {
            lamin: 45.8389,
            lomin: 5.9962,
            lamax: 47.8229,
            lomax: 10.5226
        };

        // Act
        const flightData = await fetchFlights(boundingBox);

        // Assert
        expect(global.fetch).toHaveBeenCalledTimes(1);
        //expect(global.fetch).toHaveBeenCalledWith(/* expected API endpoint with boundingBox */);
    });
});
