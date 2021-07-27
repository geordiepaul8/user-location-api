/**
 * A function that parses the config from an environment.
 *
 * @param {object} config Object from a specified environment.
 * @throws {ReferenceError} ReferenceError.
 * @throws {TypeError} TypeError.
 * @returns {object} A parsed environment object.
 */
const ConfigIngestor = (config = {}) => {
  const parsed = {
    NODE_ENV: config.NODE_ENV || '',
    PORT: config.PORT ? parseInt(config.PORT, 10) : 3000,
    LOG_LEVEL: config.LOG_LEVEL || 'info',
    USER_LOCATION_API_BASE_URL: config.USER_LOCATION_API_BASE_URL || null,
    HTTP_TIMEOUT: config.HTTP_TIMEOUT ? parseInt(config.HTTP_TIMEOUT, 10) : 10,
    DISTANCE_TO_LONDON: config.DISTANCE_TO_LONDON ? parseInt(config.DISTANCE_TO_LONDON, 10) : 50,
  };

  if (!['fatal', 'error', 'warn', 'info', 'debug', 'trace'].includes(parsed.LOG_LEVEL)) {
    throw new ReferenceError(`LOG_LEVEL must be one of: fatal, error, warn, info, debug, trace. Given ${String(parsed.LOG_LEVEL)}`);
  }

  if (typeof parsed.HTTP_TIMEOUT !== 'number' || Number.isNaN(parsed.HTTP_TIMEOUT)) {
    throw new TypeError(`HTTP_TIMEOUT must be a positive integer. Given ${String(config.HTTP_TIMEOUT)}`);
  }

  if (!parsed.USER_LOCATION_API_BASE_URL || typeof parsed.USER_LOCATION_API_BASE_URL !== 'string') {
    throw new TypeError('USER_LOCATION_API_BASE_URL must be a string.');
  }

  if (typeof parsed.DISTANCE_TO_LONDON !== 'number' || Number.isNaN(parsed.DISTANCE_TO_LONDON)) {
    throw new TypeError(`DISTANCE_TO_LONDON must be a positive integer. Given ${String(config.DISTANCE_TO_LONDON)}`);
  }

  Object.freeze(parsed);

  // We need to write all this back to `process.env` because elsewhere in the
  // app `process.env` is being used directly
  Object.keys(parsed).forEach((k) => {
    if (parsed[k] !== null) {
      process.env[k] = parsed[k];
    }
  });

  return parsed;
};

module.exports = ConfigIngestor;
