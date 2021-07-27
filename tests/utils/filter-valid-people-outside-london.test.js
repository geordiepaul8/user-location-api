/* eslint-disable sonarjs/no-duplicate-string, no-console */

const { expect } = require('chai');
const filterValidPeopleOutsideLondon = require('../../utils/filter-valid-people-outside-london.js');
// used for debugging the distance
const getDistanceBetweenCoordinates = require('../../utils/get-distance-between-coordinates.js');

describe('Filter people that live outisde of London (<50nm)', () => {
  [null, undefined, 123, '123', true, false, {}].forEach((list) => {
    it(`should throw a ReferenceError when nonLondonUsersList parameter is not a valid Array: ${list}`, () => {
      expect(() => filterValidPeopleOutsideLondon(list, {}, 50))
        .to.throw(ReferenceError, 'The nonLondonUsersList parameter is not a valid Array');
    });
  });

  it('should throw a ReferenceError when londonPersonCoordinates does not contain the key latitide', () => {
    expect(() => filterValidPeopleOutsideLondon([], { longitude: -1.00 }, 50))
      .to.throw(ReferenceError, 'The londonPersonCoordinates parameter: latitude is not a valid Object');

    expect(() => filterValidPeopleOutsideLondon([], { lat: 1.00, longitude: -1.00 }, 50))
      .to.throw(ReferenceError, 'The londonPersonCoordinates parameter: latitude is not a valid Object');
  });

  it('should throw a ReferenceError when londonPersonCoordinates does not contain the key longitude', () => {
    expect(() => filterValidPeopleOutsideLondon([], { latitude: -1.00 }, 50))
      .to.throw(ReferenceError, 'The londonPersonCoordinates parameter: longitude is not a valid Object');

    expect(() => filterValidPeopleOutsideLondon([], { latitude: -1.00, lon: 1.00 }, 50))
      .to.throw(ReferenceError, 'The londonPersonCoordinates parameter: longitude is not a valid Object');
  });

  ['aaa', null, undefined, {}, [], true, false].forEach((invalidLondonPersonCoordinate) => {
    it(`should throw a ReferenceError when londonPersonCoordinates.latitude is not a valid Number: ${invalidLondonPersonCoordinate}`, () => {
      expect(() => filterValidPeopleOutsideLondon([],
        {
          latitude: invalidLondonPersonCoordinate,
          longitude: 1.00,
        }, 50))
        .to.throw(ReferenceError, 'The londonPersonCoordinates parameter: latitude is not a valid Object');
    });
    it(`should throw a ReferenceError when londonPersonCoordinates.longitude is not a valid Number: ${invalidLondonPersonCoordinate}`, () => {
      expect(() => filterValidPeopleOutsideLondon([],
        {
          latitude: 1.00,
          longitude: invalidLondonPersonCoordinate,
        }, 50))
        .to.throw(ReferenceError, 'The londonPersonCoordinates parameter: longitude is not a valid Object');
    });
  });

  [null, undefined, 'aaa', {}, [], true, false].forEach((distance) => {
    it(`should throw a ReferenceError when distance parameter is not a valid Number: ${distance}`, () => {
      expect(() => filterValidPeopleOutsideLondon([],
        {
          latitude: 1.00,
          longitude: -1.00,
        }, distance))
        .to.throw(ReferenceError, 'The distance parameter is not a valid number');
    });
  });

  it('should return an empty list when the nonLondonUsersList is an empty list', () => {
    expect(filterValidPeopleOutsideLondon([], { latitude: 1.00, longitude: -1.00 }, 50))
      .to.be.an('Array').and.to.be.length(0);
  });

  it('should return empty list when the user lives exactly 50nm from a person in London', () => {
    const nonLondonUsersList = [
      {
        latitude: 1.00,
        longitude: 1.00,
      },
    ];

    const londonPersonCoordinates = {
      latitude: 1.84,
      longitude: 1.00,
    };

    // for debugging
    console.log(`distance is: ${getDistanceBetweenCoordinates(
      nonLondonUsersList[0].latitude,
      nonLondonUsersList[0].longitude,
      londonPersonCoordinates.latitude,
      londonPersonCoordinates.longitude,
    )}nm`);

    expect(filterValidPeopleOutsideLondon(nonLondonUsersList, londonPersonCoordinates, 50))
      .to.be.an('Array').and.to.be.length(0);
  });

  it('should return 1 user in the list when the user lives 49m from a person in London', () => {
    const nonLondonUsersList = [
      {
        latitude: 1.00,
        longitude: 1.00,
      },
    ];

    const londonPersonCoordinates = {
      latitude: 1.82,
      longitude: 1.00,
    };

    // for debugging
    console.log(`distance is: ${getDistanceBetweenCoordinates(
      nonLondonUsersList[0].latitude,
      nonLondonUsersList[0].longitude,
      londonPersonCoordinates.latitude,
      londonPersonCoordinates.longitude,
    )}nm`);

    expect(filterValidPeopleOutsideLondon(nonLondonUsersList, londonPersonCoordinates, 50))
      .to.be.an('Array').and.to.be.length(1);
  });
});
