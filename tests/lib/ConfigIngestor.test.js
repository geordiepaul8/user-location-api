const { expect } = require('chai');

const ConfigIngestor = require('../../lib/ConfigIngestor.js');

const requiredVars = {
  USER_LOCATION_API_BASE_URL: 'http://localhost:8080/as/',
};

describe('ConfigIngestor', () => {
  it('should return an Object', () => {
    const ci = ConfigIngestor(requiredVars);
    expect(ci).to.be.an('object');
  });

  it('should return an Object with frozen properties', () => {
    const ci = ConfigIngestor(requiredVars);
    const setPort = ci.PORT;
    try {
      ci.PORT = 'TEST';
      ci._test_prop = true;
    } catch (e) {
      //
    }

    expect(ci.PORT).equals(setPort);
    return expect(ci._test_prop).to.be.undefined;
  });

  it('ConfigIngestor should throw if invalid LOG_LEVEL given', () => {
    expect(() => {
      ConfigIngestor({
        ...requiredVars,
        LOG_LEVEL: 'invalid-test',
      });
    }).to.throw(ReferenceError, /^LOG_LEVEL must be one of: fatal, error, warn, info, debug, trace. Given invalid-test$/);
  });

  it('USER_LOCATION_API_BASE_URL should throw a TypeError if not a string', () => {
    expect(() => ConfigIngestor({
      ...requiredVars,
      USER_LOCATION_API_BASE_URL: undefined,
    })).to.throw(TypeError, /^USER_LOCATION_API_BASE_URL must be a string.$/);

    expect(() => ConfigIngestor({
      ...requiredVars,
      USER_LOCATION_API_BASE_URL: 5,
    })).to.throw(TypeError, /^USER_LOCATION_API_BASE_URL must be a string.$/);
  });

  it('HTTP_TIMEOUT should throw a TypeError if not a string', () => {
    expect(() => ConfigIngestor({
      ...requiredVars,
      HTTP_TIMEOUT: ['string'],
    })).to.throw(TypeError, /^HTTP_TIMEOUT must be a positive integer. Given string$/);

    expect(() => ConfigIngestor({
      ...requiredVars,
      HTTP_TIMEOUT: 'a123',
    })).to.throw(TypeError, /^HTTP_TIMEOUT must be a positive integer. Given a123$/);
  });

  it('DISTANCE_TO_LONDON should throw a TypeError if not a string', () => {
    expect(() => ConfigIngestor({
      ...requiredVars,
      DISTANCE_TO_LONDON: ['string'],
    })).to.throw(TypeError, /^DISTANCE_TO_LONDON must be a positive integer. Given string$/);

    expect(() => ConfigIngestor({
      ...requiredVars,
      DISTANCE_TO_LONDON: 'a123',
    })).to.throw(TypeError, /^DISTANCE_TO_LONDON must be a positive integer. Given a123$/);
  });
});
