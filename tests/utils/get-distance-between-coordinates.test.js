const { expect } = require('chai');
const getDistanceBetweenCoordinates = require('../../utils/get-distance-between-coordinates.js');

describe('Get distance in nm from 2 coordinates', () => {
    const validLatLon = 1.00;

    ['a', null, undefined, true].forEach((invalidCoord)  => {
        it(`should throw a ReferenceError when lat1 is not a valid number (NaN): ${invalidCoord}`, () => {
            expect(() => getDistanceBetweenCoordinates(invalidCoord, validLatLon, validLatLon, validLatLon))
              .to.throw(ReferenceError, 'There was a problem parsing the latitude 1 paramteter');
        });
        it(`should throw a ReferenceError when lon1 is not a valid number (NaN): ${invalidCoord}`, () => {
            expect(() => getDistanceBetweenCoordinates(validLatLon, invalidCoord, validLatLon, validLatLon))
              .to.throw(ReferenceError, 'There was a problem parsing the longitude 1 paramteter');
        });
        it(`should throw a ReferenceError when lat2 is not a valid number (NaN): ${invalidCoord}`, () => {
            expect(() => getDistanceBetweenCoordinates(validLatLon, validLatLon, invalidCoord, validLatLon))
              .to.throw(ReferenceError, 'There was a problem parsing the latitude 2 paramteter');
        });
        it(`should throw a ReferenceError when lon2 is not a valid number (NaN): ${invalidCoord}`, () => {
            expect(() => getDistanceBetweenCoordinates(validLatLon, validLatLon, validLatLon, invalidCoord))
              .to.throw(ReferenceError, 'There was a problem parsing the longitude 2 paramteter');
        });
    });
    it('should return 0 when the coordinates are equal', () => {
        expect(getDistanceBetweenCoordinates(0,0,0,0)).to.be.a('Number').and.to.equal(0);
    });
    it('should return a number when latitude and longitude values are minus whole numbers', () => {
        expect(getDistanceBetweenCoordinates(-1,-2,-3,-4)).to.be.a('Number');
    });
    it('should return a number when latitude and longitude values are minus decimal numbers', () => {
        expect(getDistanceBetweenCoordinates(-1.01,-2.222,-3.32323,-4.3232323)).to.be.a('Number');
    });
    it('should return a number when the latitudes and longitudes are a mix of positive and negative numbers', () => {
        expect(getDistanceBetweenCoordinates(1.01,-2.222,-3.32323,4.3232323)).to.be.a('Number');
    });
});
