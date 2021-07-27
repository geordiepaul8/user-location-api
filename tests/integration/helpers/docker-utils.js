const path = require('path');
/* eslint-disable-next-line import/no-extraneous-dependencies */
const { DockerComposeEnvironment, Wait } = require('testcontainers');

const composeFilePath = path.resolve(__dirname, '../');
const composeFile = 'docker-compose.yml';

/**
 * Start docker compose environment.
 *
 * @returns {object} Docker compose environment details.
 */
async function startEnvironment() {
  return new DockerComposeEnvironment(composeFilePath, composeFile)
    .withWaitStrategy('api-stub_1', Wait.forLogMessage(/Verbose logging enabled/))
    .up();
}

module.exports = {
  startEnvironment,
};
