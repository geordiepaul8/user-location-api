const got = require('got');

const CustomUIError = require('../lib/CustomUIError');

/**
 * Middleware that calls the API to get all users that live in the
 * city of London.
 *
 * @param {string} url The url of the API.
 * @param {string} city The url parameter of the city.
 * @param {number} httpTimeout The httpTimeout of the request in ms.
 * @returns {object} Middleware chain.
 */
const getAllLondonUsers = (url, city, httpTimeout) => async (req, res, next) => {
  try {
    req.log.debug(`Calling API to get all users that live in ${city}`);

    if (!req.data) {
      req.data = {};
    }

    if (typeof url !== 'string') {
      throw new TypeError('url must be a string');
    }

    if (typeof city !== 'string') {
      throw new TypeError('city must be a string');
    }

    if (typeof httpTimeout !== 'number') {
      throw new TypeError('httpTimeout must be a number');
    }

    if (httpTimeout < 1 || httpTimeout > 60) {
      throw new RangeError('httpTimeout must be between 1 and 60 seconds');
    }

    const londonUsersList = JSON.parse((await got(`${url}city/${city}/users`, {
      timeout: parseInt(httpTimeout, 10) * 1000, // convert to seconds
    })).body);

    req.data = Object.assign(req.data, {
      londonUsersList,
    });

    next();
  } catch (error) {
    req.log.error('Error calling getAllLondonUsers');

    /*
     * If there is an HttpError we will format it into a Custom error handler
     * and forward it on to the error middleware handler.
     */
    if (error?.name === 'HTTPError') {
      next(new CustomUIError('There was a problem sending the request', error?.response?.statusCode));
    } else {
      next(error);
    }
  }
};

module.exports = getAllLondonUsers;
