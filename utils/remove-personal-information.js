/**
 * A util method that strips all PII data out of the response body.
 *
 * @param {Array} userArray The user array consisting of users that live
 * in London or within (<) 50 miles.
 * @returns {Array} A sanitised user array with the specified keys removed.
 */
const removePersonalInformation = (userArray) => userArray.map(
  ({
    latitude,
    longitude,
    /* eslint-disable-next-line camelcase */
    ip_address,
    email,
    ...filteredProperties
  }) => filteredProperties,
);

module.exports = removePersonalInformation;
