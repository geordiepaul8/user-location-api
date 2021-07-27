const bodyParser = require('body-parser');

const getAllUsers = require('../middleware/get-all-users.js');
const getAllLondonUsers = require('../middleware/get-all-london-users.js');
const filterAllUsersWithin50mOfLondon = require('../middleware/filter-all-users-within-50m-of-london.js');
const filterUsersNotLivingInlondon = require('../middleware/filter-users-not-living-in-london.js');
const buildAndSendResponseBody = require('../middleware/build-and-send-response-body.js');

/**
 * A router that is bound to the /users path in the url.
 *
 * @param {object} router The router instantiated by express.
 * @param {string} baseUrl The base url of the API.
 * @param {string} londonCityDefinition The string definition for London, used as the
 * path parameter.
 * @param {number} distanceToLondon The defined distance that is used to calculate number of
 * miles to London.
 * @param {number} httpTimeout The timeout value for the API request.
 */
const userRouter = (router, baseUrl, londonCityDefinition, distanceToLondon, httpTimeout) => {
  /*
   *  This 'GET' request calls the 'baseUrl' to get a list of all users and a list
   *  of all users living in London. Then the service filters the London users from the
   *  full list. The remainder of that full list is used to calculate the distance against
   *  all of the London users and if they are deemed to be within 50 miles of one of them
   *  then they will be added to the returned list. Finally, the response is filtered to not
   *  include any unnecessary PII.
   */
  router.get('/',
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json(),
    getAllUsers(baseUrl, httpTimeout),
    getAllLondonUsers(baseUrl, londonCityDefinition, httpTimeout),
    filterUsersNotLivingInlondon(),
    filterAllUsersWithin50mOfLondon(distanceToLondon),
    buildAndSendResponseBody(distanceToLondon));
};

module.exports = { userRouter };
