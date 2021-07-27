const removeDulicates = require('../utils/remove-duplicates.js');
const removePersonalInformation = require('../utils/remove-personal-information.js');

/**
 * Middleware function that builds the list of users that either live in London or
 * that live within (<) 50 miles of london. The list is also sanitised to remove
 * any unnecessary PII information.
 *
 * @param {number} distanceToLondon Used to determine whether the distance
 * of a non-london user is within the specified range in nm.
 * @returns {object} Middleware chain.
 */
const buildAndSendResponseBody = (distanceToLondon) => (req, res, next) => {
  try {
    if (!(req?.data?.londonUsersList && req?.data.closeToLondonList)) {
      throw new TypeError('No valid data is found within the req.data object');
    }
    const closeToLondonFilteredList = removeDulicates(req.data.closeToLondonList);

    /*
     * Concatenate the users that live in London with those that live within 50nm
     * and remove any unnecessary PII data from the response model.
     */
    const userArray = removePersonalInformation([
      ...req.data.londonUsersList,
      ...closeToLondonFilteredList,
    ]);

    req.log.debug(`Total number of users returned: ${req.data.allUsersList.length}`);
    req.log.debug(`Total number of london users filtered by decleared 'city' field: ${req.data.londonUsersList.length}`);
    req.log.debug(`Total number of users living outside of London: ${req.data.outsideLondonUsersList.length}`);
    req.log.debug(`Total number of users living outside of London that live within ${distanceToLondon} miles: ${closeToLondonFilteredList.length}`);
    req.log.info(`Total number of users within (<) ${distanceToLondon}nm or living in London: ${userArray.length}`);

    res.json(userArray);
  } catch (error) {
    req.log.error(`Error found in buildResponseBody: ${error.message}`);
    next(error);
  }
};

module.exports = buildAndSendResponseBody;
