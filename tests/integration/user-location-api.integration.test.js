/* eslint-disable no-console */

/*
 * A simple Integration test suuite for the API. This demonstretsed the use of docker containers for
 * stubbing services. It runs 2 quick integration tests on the getAllUsers & getAllLondonUsers and
 * asserts the response when the API is not available.
 */
const sinon = require('sinon');
const { expect } = require('chai');

const { startEnvironment } = require('./helpers/docker-utils.js');

const getAllUsers = require('../../middleware/get-all-users.js');
const getAllLondonUsers = require('../../middleware/get-all-london-users.js');

const TIMEOUT_TESTS = 90000;

let environment;
let url;
let req;
let res;

beforeEach(() => {
  req = {
    log: {
      info: sinon.spy(),
      error: sinon.spy(),
      debug: sinon.spy(),
    },
  };

  res = {};
});

describe('User location API integration tests', () => {
  before(async () => {
    /*
     * Start the docker-compose script.
     */
    environment = await startEnvironment();

    const stubContainer = environment.getContainer('api-stub_1');

    /*
     *  Build the url from the host and dynamic port that is mapped to 8080.
     */
    url = `http:${stubContainer.getHost()}:${stubContainer.getMappedPort(8080)}/`;

    console.log(`url: ${url}`);
  });
  after(async () => {
    console.log('> Waiting for the services to tear down...');
    try {
      await environment.down();
    } catch (e) {
      console.warn('>  Environment is already down');
    }

    console.log('> *** End of Tests ***');
  });

  it('Get All Users: should return a userArray with only the correct fields', async () => {
    await getAllUsers(url, 10)(req, res, sinon.spy());

    expect(req.data).to.be.an('object').and.have.keys('allUsersList');
    expect(req.data.allUsersList).to.be.an('array').and.to.have.length(28);

    // assert 1 of the fields
    expect(req.data.allUsersList[0]).to.be.an('object').and.to.have.keys('id', 'first_name', 'last_name', 'email', 'ip_address', 'latitude', 'longitude');
  }).timeout(TIMEOUT_TESTS);
  it('Get All London Users: should return only London users (londonUsersList) with only the correct fields', async () => {
    await getAllLondonUsers(url, 'London', 10)(req, res, sinon.spy());

    expect(req.data).to.be.an('object').and.have.keys('londonUsersList');
    expect(req.data.londonUsersList).to.be.an('array').and.to.have.length(6);

    // assert 1 of the fields
    expect(req.data.londonUsersList[0]).to.be.an('object').and.to.have.keys('id', 'first_name', 'last_name', 'email', 'ip_address', 'latitude', 'longitude');
  }).timeout(TIMEOUT_TESTS);
  describe('No Connection to the services', () => {
    before(async () => {
      await environment.stop();
    });
    it('When calling getAllUsers: should set ECONNREFUSED as the API is down', async () => {
      try {
        await getAllUsers(url, 10)(req, res, sinon.spy());
      } catch (err) {
        const { code, name } = err;
        expect(code).to.equal('ECONNREFUSED');
        expect(name).to.equal('RequestError');
      }
    }).timeout(TIMEOUT_TESTS);
    it('When calling getAllLondonUsers: should set ECONNREFUSED as the API is down', async () => {
      try {
        await getAllLondonUsers(url, 'London', 10)(req, res, sinon.spy());
      } catch (err) {
        const { code, name } = err;
        expect(code).to.equal('ECONNREFUSED');
        expect(name).to.equal('RequestError');
      }
    }).timeout(TIMEOUT_TESTS);
  });
});
