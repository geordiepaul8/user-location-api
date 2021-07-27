/* eslint-disable no-unused-expressions */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);
chai.use(require('chai-match'));

const proxyquire = require('proxyquire');

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

afterEach(() => {
  sinon.restore();
});

describe('Build and send response body middleware', () => {
  it('Should throw a TypeError when the req.data does not exist', () => {
    /* eslint-disable-next-line global-require */
    const buildAndSendResponseBody = require('../../middleware/build-and-send-response-body.js');

    buildAndSendResponseBody(50)(req, res, (err) => {
      expect(err).to.be.an.instanceOf(TypeError);
      expect(err.message).to.match(/No valid data is found within the req.data object/);
    });
  });
  it('Should throw a TypeError when the req.data.londonUsersList does not exist', () => {
    /* eslint-disable-next-line global-require */
    const buildAndSendResponseBody = require('../../middleware/build-and-send-response-body.js');

    req = Object.assign(req, req.data);

    req.data = {
      closeToLondonUsersList: [],
    };

    buildAndSendResponseBody(50)(req, res, (err) => {
      expect(req).to.include.keys('data');
      expect(req.data).to.include.keys('closeToLondonUsersList');
      expect(err).to.be.an.instanceOf(TypeError);
      expect(err.message).to.match(/No valid data is found within the req.data object/);
    });
  });
  it('Should throw a TypeError when the req.data.closeToLondonList does not exist', () => {
    /* eslint-disable-next-line global-require */
    const buildAndSendResponseBody = require('../../middleware/build-and-send-response-body.js');

    res = sinon.spy();

    req = Object.assign(req, req.data);

    req.data = {
      londonUsersList: [],
    };

    buildAndSendResponseBody(50)(req, res, (err) => {
      expect(req).to.include.keys('data');
      expect(req.data).to.include.keys('londonUsersList');
      expect(err).to.be.an.instanceOf(TypeError);
      expect(err.message).to.match(/No valid data is found within the req.data object/);
    });
  });
  it('should call next(error) when removeDulicates throws a ReferenceError', () => {
    const buildAndSendResponseBody = proxyquire('../../middleware/build-and-send-response-body.js', {
      '../utils/remove-duplicates.js': sinon.stub().throws(() => new ReferenceError('error')),
    });

    req = Object.assign(req, req.data);

    req.data = {
      closeToLondonList: [],
      londonUsersList: [],
    };

    buildAndSendResponseBody(50)(req, res, (err) => {
      expect(req).to.include.keys('data');
      expect(req.data).to.include.keys('londonUsersList', 'closeToLondonList');
      expect(err).to.be.an.instanceOf(ReferenceError);
      expect(err.message).to.match(/error/);
    });
  });
  it('should build the userArray even if the londonUsersList = [] & closeToLondonList = []', () => {
    const buildAndSendResponseBody = proxyquire('../../middleware/build-and-send-response-body.js', {
      '../utils/remove-duplicates.js': sinon.stub().returns([]),
      '../utils/remove-personal-information.js': sinon.stub().returns([]),
    });

    res = Object.assign(res, {
      json: sinon.spy(),
      status: sinon.stub().returns(200)
    });

    const next = sinon.spy();

    req = Object.assign(req, req.data);

    req.data = {
      closeToLondonList: [],
      londonUsersList: [],
      allUsersList: [],
      outsideLondonUsersList: [],
    };

    buildAndSendResponseBody(50)(req, res, next);

    expect(res.json).to.be.calledOnceWithExactly([]);
  });
  it('should build the userArray with 1 user objecs from londonUsersList and 0 from closeToLondonList', () => {
    const buildAndSendResponseBody = proxyquire('../../middleware/build-and-send-response-body.js', {
      '../utils/remove-duplicates.js': sinon.stub().returns([]),
      '../utils/remove-personal-information.js': sinon.stub().returns([{
        id: 1,
        name: 'name',
      }]),
    });

    res = Object.assign(res, {
      json: sinon.spy(),
      status: sinon.stub().returns(200)
    });

    const next = sinon.spy();

    req = Object.assign(req, req.data);

    req.data = {
      closeToLondonList: [],
      londonUsersList: [{
        id: 1,
        name: 'name',
      }],
      allUsersList: [],
      outsideLondonUsersList: [],
    };

    buildAndSendResponseBody(50)(req, res, next);

    expect(res.json).to.be.calledOnceWithExactly([...req.data.londonUsersList]);
  });
  it('should build the userArray with 0 user objecs from londonUsersList and 1 from closeToLondonList', () => {
    const buildAndSendResponseBody = proxyquire('../../middleware/build-and-send-response-body.js', {
      '../utils/remove-duplicates.js': sinon.stub().returns([{
        id: 1,
        name: 'name',
      }]),
      '../utils/remove-personal-information.js': sinon.stub().returns([{
        id: 1,
        name: 'name',
      }]),
    });

    res = Object.assign(res, {
      json: sinon.spy(),
      status: sinon.stub().returns(200)
    });

    const next = sinon.spy();

    req = Object.assign(req, req.data);

    req.data = {
      closeToLondonList: [{
        id: 1,
        name: 'name',
      }],
      londonUsersList: [],
      allUsersList: [],
      outsideLondonUsersList: [],
    };

    buildAndSendResponseBody(50)(req, res, next);

    expect(res.json).to.be.calledOnceWithExactly([...req.data.closeToLondonList]);
  });
  it('should build the userArray with 1 user objecs from londonUsersList and 1 from closeToLondonList', () => {
    const buildAndSendResponseBody = proxyquire('../../middleware/build-and-send-response-body.js', {
      '../utils/remove-duplicates.js': sinon.stub().returns([{
        id: 1,
        name: 'name',
      }]),
      '../utils/remove-personal-information.js': sinon.stub().returns([
        {
          id: 2,
          name: 'name 2',
        }, {
          id: 1,
          name: 'name',
        }]),
    });

    res = Object.assign(res, {
      json: sinon.spy(),
      status: sinon.stub().returns(200),
    });

    const next = sinon.spy();

    req = {};

    req = Object.assign(req,
      {
        log: {
          info: sinon.spy(),
          error: sinon.spy(),
          debug: sinon.spy(),
        },
        data: {},
      });

    req.data = {
      closeToLondonList: [{
        id: 1,
        name: 'name',
      }],
      londonUsersList: [{
        id: 2,
        name: 'name 2',
      }],
      allUsersList: [],
      outsideLondonUsersList: [],
    };

    buildAndSendResponseBody(50)(req, res, next);

    /* eslint-disable-next-line max-len */
    expect(res.json).to.be.calledOnceWithExactly([...req.data.londonUsersList, ...req.data.closeToLondonList]);
  });
});
