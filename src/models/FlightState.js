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