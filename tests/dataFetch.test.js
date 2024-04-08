jest.mock('../src/services/OpenSkyService');
jest.mock('fs', () => require('mock-fs'));
const { fetchData } = require('../data/dataFetch');
const fs = require('fs');
const mockFs = require('mock-fs');
const getAllFlights = require('../src/services/OpenSkyService');

describe('fetchData', () => {
    beforeEach(() => {
        fetch.resetMocks();
        mockFs({
            'data/history': {} // Simulate an empty history directory
        });
    });

    afterEach(() => {
        mockFs.restore();
    });

    it('should fetch data and write to flights.json', async () => {
        getAllFlights.mockResolvedValue({
            states: [[/* Mock flight data */]]
        });

        await fetchData();

        // Verify flights.json was created/updated
        expect(fs.existsSync('data/flights.json')).toBe(true);
    });
});
