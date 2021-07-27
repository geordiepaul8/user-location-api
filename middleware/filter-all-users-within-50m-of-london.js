const getDistanceBetweenCoordinates = require('../utils/get-distance-between-coordinates.js');

/**
 * Middleware function to filter the list of users that live
 * outside of London whose coordinates are within (<) distanceToLondon nm.
 * These coordinates are taken from the list of known users that live
 * within london.
 *
 * @param {number} distanceToLondon Used to determine whether the distance
 * of a non-london user is within the specified range in nm.
 * @returns {object} Middleware chain.
 */
const filterAllUsersWithin50mOfLondon = (distanceToLondon) => async (req, res, next) => {
  req.log.debug('Calling API to get all users that live in London');

  try {
    if (!(req?.data?.londonUsersList && req?.data?.allUsersList)) {
      throw new TypeError('No valid data is found within the req.data object');
    }

    if (!distanceToLondon || typeof distanceToLondon !== 'number') {
      throw new ReferenceError('The function parameter [distanceToLondon] is invalid');
    }

    // work out who is within distanceToLondon nm
    const closeToLondon = [];

    /*
     * loop through every person that live outside of London and
     * check their coordinates against all of those that live within London.
     * once the distance is < distanceToLondon, that person is deemed
     * to be within the bounds to London and the search for that person stops.
     */
    for (let i = 0; i < req.data.outsideLondonUsersList.length; i++) {
      for (let k = 0; k < req.data.londonUsersList.length; k++) {
        const distance = getDistanceBetweenCoordinates(
          req.data.londonUsersList[k].latitude,
          req.data.londonUsersList[k].longitude,
          req.data.outsideLondonUsersList[i].latitude,
          req.data.outsideLondonUsersList[i].longitude,
        );

        if (distance < distanceToLondon) {
          closeToLondon.push(req.data.outsideLondonUsersList[i]);
          break;
        }
      }
    }

    req.log.debug(`closeToLondon matches length: ${closeToLondon.length}`);

    req.data = Object.assign(req.data, {
      closeToLondonList: closeToLondon,
    });

    next();
  } catch (error) {
    req.log.error(`Error found in filterAllUsersWithin50mOfLondon: ${error.message}`);
    next(error);
  }
};

module.exports = filterAllUsersWithin50mOfLondon;
