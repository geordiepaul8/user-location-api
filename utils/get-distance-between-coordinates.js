/**
 * Gets the distance from 2 coordinates (latitude / longitude) and returns
 * the number of nautical miles (nm) between them.
 * The body of the method is taken from: https://www.geodatasource.com/developers/javascript.
 *
 * @param {number} lat1 Latitude 1.
 * @param {number} lon1 Longitude 1.
 * @param {number} lat2 Latitude 2.
 * @param {number} lon2 Longitutde 2.
 * @throws {ReferenceError} When the parameters are not valid numbers.
 * @returns {number} Number of nm between the 2 coordinate points.
 */
module.exports = (lat1, lon1, lat2, lon2) => {
  // parse the parameters
  const latitide1 = parseFloat(lat1);
  const longitude1 = parseFloat(lon1);
  const latitude2 = parseFloat(lat2);
  const longitude2 = parseFloat(lon2);

  if (Number.isNaN(latitide1)) {
    throw new ReferenceError('There was a problem parsing the latitude 1 paramteter');
  }
  if (Number.isNaN(longitude1)) {
    throw new ReferenceError('There was a problem parsing the longitude 1 paramteter');
  }
  if (Number.isNaN(latitude2)) {
    throw new ReferenceError('There was a problem parsing the latitude 2 paramteter');
  }
  if (Number.isNaN(longitude2)) {
    throw new ReferenceError('There was a problem parsing the longitude 2 paramteter');
  }

  if ((latitide1 === latitude2) && (longitude1 === longitude2)) {
    return 0;
  }

  const radlatitide1 = (Math.PI * latitide1) / 180;
  const radlatitude2 = (Math.PI * latitude2) / 180;
  const theta = longitude1 - longitude2;
  const radtheta = (Math.PI * theta) / 180;
  let dist = (Math.sin(radlatitide1) * Math.sin(radlatitude2))
    + (Math.cos(radlatitide1) * Math.cos(radlatitude2) * Math.cos(radtheta));
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;

  // calculatle nm
  dist *= 0.8684;
  return dist;
};
