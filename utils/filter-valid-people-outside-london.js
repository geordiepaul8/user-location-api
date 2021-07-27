const getDistanceBetweenCoordinates = require('./get-distance-between-coordinates.js');

/**
 * Returns a list of non-London based users against a London user and
 * checks their coordinates to see if they are within the specified distance.
 *
 * @param {Array} nonLondonUsersList List of non-London based users.
 * @param {object} londonPersonCoordinates Person residing in london to check the distance of
 * their coordinates.
 * @param {number} distance To London.
 * @throws {ReferenceError} When the paramters are not valid types.
 * @returns {Array} List of people that live within the distance value.
 */
module.exports = (nonLondonUsersList, londonPersonCoordinates, distance) => {
  if (!Array.isArray(nonLondonUsersList)) {
    throw new ReferenceError('The nonLondonUsersList parameter is not a valid Array');
  }

  if (!Object.prototype.hasOwnProperty.call(londonPersonCoordinates, 'latitude')
    || (Number.isNaN(parseFloat(londonPersonCoordinates.latitude)))) {
    throw new ReferenceError('The londonPersonCoordinates parameter: latitude is not a valid Object');
  }

  if (!Object.prototype.hasOwnProperty.call(londonPersonCoordinates, 'longitude')
    || (Number.isNaN(parseFloat(londonPersonCoordinates.longitude)))) {
    throw new ReferenceError('The londonPersonCoordinates parameter: longitude is not a valid Object');
  }

  if (Number.isNaN(parseInt(distance, 10))) {
    throw new ReferenceError('The distance parameter is not a valid number');
  }

  return nonLondonUsersList.filter((nonLondonUser) => getDistanceBetweenCoordinates(
    nonLondonUser.latitude,
    nonLondonUser.longitude,
    londonPersonCoordinates.latitude,
    londonPersonCoordinates.longitude,
  ) < distance);
};
