const express = require('express');
const dwpNodeLogger = require('@dwp/node-logger');
const helmet = require('helmet');
const packageMeta = require('./package.json');

const {
  LOG_LEVEL,
  PORT,
  USER_LOCATION_API_BASE_URL,
  HTTP_TIMEOUT,
  DISTANCE_TO_LONDON,
} = require('./bootstrap/ingest-config.js');
const { userRouter } = require('./routes/user-router.js');

/*
 * Set purposefully to get response from the API
 * Disable TLS verification for dev purposes
 * Do not set this in a production environment.
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const LONDON = 'London';

const app = express();

const logger = dwpNodeLogger('api', {
  logLevel: LOG_LEVEL,
  appName: packageMeta.name,
});

app.use(logger.httpLogger);

/*
 * Using the default configuration for this package.
 * More details found here: https://expressjs.com/en/advanced/best-practice-security.html#use-helmet.
 * Default configuration is outlined here: https://helmetjs.github.io/.
 */
app.use(helmet());

/*
 * Simple health endpoint - would be needed for hosting in
 * environments such as AWS.
 */
app.use('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

/*
 * A user router package which the single request will hang off for now.
 */
const router = express.Router();
userRouter(router, USER_LOCATION_API_BASE_URL, LONDON, DISTANCE_TO_LONDON, HTTP_TIMEOUT);
app.use('/users', router);

/*
* If there is an unrecognised URL, send them to the error handling
* middleware to render the error message.
*/
app.use((req, res, next) => {
  req.log.warn(`Invalid URL selected: ${req.originalUrl}`);
  const error = new Error(`Url: ${req.originalUrl} Not found`);
  error.statusCode = 404;
  next(error);
});

/* eslint-disable-next-line no-unused-vars */
app.use((error, req, res, next) => {
  /*
  * Check whether a HttpError (CustomUIError) has been thrown
  * and if present, use those details. Failing that, it will
  * default to a generic 500 Internal Server Error.
  */
  const status = error?.statusCode || 500;
  const message = error?.message || 'Sorry, there was a problem with the service';

  req.log.error({ stack: error.stack }, message);

  res.status(status).json({ error: message });
});

const server = app.listen(PORT, () => {
  const { address, port } = server.address();

  logger.info(
    'App listening at %s://%s:%s',
    'http',
    address,
    port,
  );
});
