const got = require('got');

const CustomUIError = require('../lib/CustomUIError');

/**
 * Middleware which calls the API to get all of the users.
 *
 * @param {string} url The url of the API.
 * @param {number} httpTimeout The httpTimeout of the request in ms.
 * @returns {object} Middleware chain.
 */
const getAllUsers = (url, httpTimeout) => async (req, res, next) => {
  try {
    req.log.debug('Calling API to get all users');

    if (!req.data) {
      req.data = {};
    }

    if (typeof httpTimeout !== 'number') {
      throw new TypeError('httpTimeout must be a number');
    }

    if (httpTimeout < 1 || httpTimeout > 60) {
      throw new RangeError('httpTimeout must be between 1 and 60 seconds');
    }

    const allUsersList = JSON.parse((await got(`${url}users`, {
      timeout: parseInt(httpTimeout, 10) * 1000, // convert to seconds
    })).body);

    req.data = Object.assign(req.data, {
      allUsersList,
    });

    next();
  } catch (error) {
    req.log.error('Error calling getAllUsers');

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

module.exports = getAllUsers;
