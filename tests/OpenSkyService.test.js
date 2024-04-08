// tests/dataFetch.test.js
jest.mock('fs', () => require('mock-fs'));
jest.mock('../src/services/OpenSkyService', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockFs = require('mock-fs');
const { fetchData } = require('../data/dataFetch');
const getAllFlights = require('../src/services/OpenSkyService').default;

beforeEach(() => {
    mockFs({
        'data/history': {}, // Mock an empty history directory
    });
    getAllFlights.mockClear();
});

afterEach(() => {
    mockFs.restore();
});

it('fetches data and updates flight history', async () => {
    getAllFlights.mockResolvedValue({
        states: [
            ['4b8e05', 'some-data', 'more-data', /* more mock data as per FlightState model */],
        ],
    });

    await fetchData();
});
