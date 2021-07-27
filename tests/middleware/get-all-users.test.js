/* eslint-disable no-unused-expressions */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);
chai.use(require('chai-match'));

const proxyquire = require('proxyquire');
const CustomUIError = require('../../lib/CustomUIError.js');

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

  res = {
    render: sinon.spy(),
  };
});

afterEach(() => {
  sinon.restore();
});

describe('Get all users middleware', () => {
  it('should return a valid req.data.allUsersList object with 2 users as valid JSON data returned from the API', async () => {
    const next = sinon.spy();

    const body = [
      {
        id: 1,
        name: 'name',
        latitude: 1.00,
        longitude: -1.00,
      },
      {
        id: 2,
        name: 'name2',
        latitude: 2.00,
        longitude: -2.00,
      },
    ];

    const getAllUsers = proxyquire('../../middleware/get-all-users', {
      got: sinon.stub().returns({
        body: JSON.stringify(body),
      }),
    });

    await getAllUsers('url', 10)(req, res, next);

    expect(req).to.include.keys('data');
    expect(req.data).to.include.keys('allUsersList');
    expect(req.data.allUsersList).to.be.an('Array').and.have.length(2);

    // assert the data
    expect(req.data.allUsersList[0]).to.be.an('object')
      .and.to.have.keys(['id', 'name', 'latitude', 'longitude']);

    expect(req.data.allUsersList[0].id).to.be.a('Number').to.equal(1);
    expect(req.data.allUsersList[0].name).to.be.a('String').to.equal('name');
    expect(req.data.allUsersList[0].latitude).to.be.a('Number').to.equal(1.00);
    expect(req.data.allUsersList[0].longitude).to.be.a('Number').and.to.equal(-1.00);

    expect(req.data.allUsersList[1].id).to.be.a('Number').to.equal(2);
    expect(req.data.allUsersList[1].name).to.be.a('String').to.equal('name2');
    expect(req.data.allUsersList[1].latitude).to.be.a('Number').to.equal(2.00);
    expect(req.data.allUsersList[1].longitude).to.be.a('Number').and.to.equal(-2.00);

    expect(next).to.be.calledOnce;
  });
  it('should return an empty req.data.allUsersList object with 0 users returned from the API', async () => {
    const next = sinon.spy();

    const body = [];

    const getAllUsers = proxyquire('../../middleware/get-all-users', {
      got: sinon.stub().returns({
        body: JSON.stringify(body),
      }),
    });

    await getAllUsers('url', 10)(req, res, next);

    expect(req).to.include.keys('data');
    expect(req.data).to.include.keys('allUsersList');
    expect(req.data.allUsersList).to.be.an('Array').and.have.length(0);
    expect(next).to.be.calledOnce;
  });
  it('should add to existing req.data object when one is already defined', async () => {
    const next = sinon.spy();

    const body = [
      {
        id: 1,
        name: 'name',
        latitude: 1.00,
        longitude: -1.00,
      },
    ];

    req = Object.assign(req, req.data);

    req.data = {
      anotherKey: [],
    };

    const getAllUsers = proxyquire('../../middleware/get-all-users', {
      got: sinon.stub().returns({
        body: JSON.stringify(body),
      }),
    });

    await getAllUsers('url', 10)(req, res, next);

    expect(req).to.include.keys('data');
    expect(req.data).to.include.keys('anotherKey', 'allUsersList');
    expect(req.data.allUsersList).to.be.an('Array').and.have.length(1);
    expect(next).to.be.calledOnce;
  });
  [null, undefined, {}, [], '10', true, false].forEach((invalidhttpTimeout) => {
    it(`should throw a TypeError when the httpTimeout param is invalid: ${invalidhttpTimeout}`, async () => {
      /* eslint-disable-next-line global-require */
      const getAllUsers = require('../../middleware/get-all-users');

      await getAllUsers('url', invalidhttpTimeout)(req, res, (err) => {
        expect(err).to.be.an.instanceOf(TypeError);
        expect(err.message).to.match(/httpTimeout must be a number/);
      });
    });
  });
  [0, 61].forEach((invalidhttpTimeout) => {
    it(`should throw a RangeError when the httpTimeout range is < 1 or > 60: ${invalidhttpTimeout}`, async () => {
      /* eslint-disable-next-line global-require */
      const getAllUsers = require('../../middleware/get-all-users');

      await getAllUsers('url', invalidhttpTimeout)(req, res, (err) => {
        expect(err).to.be.an.instanceOf(RangeError);
        expect(err.message).to.match(/httpTimeout must be between 1 and 60 seconds/);
      });
    });
  });
  it('should call next(error) with CustomUIError when HTTPError is returned from the API', async () => {
    const e = {
      name: 'HTTPError',
      response: {
        body: {
          status: 404,
          error: 'error',
          message: 'Bad Request',
        },
        statusCode: 404,
      },
    };

    const getAllUsers = proxyquire('../../middleware/get-all-users', {
      got: sinon.stub().rejects(e),
    });

    await getAllUsers('url', 10)(req, res, (err) => {
      expect(req).to.include.keys('data');
      expect(req.data).to.not.include.keys('allUsersList');
      expect(err).to.be.a.instanceOf(CustomUIError);
      expect(err.message).to.match(/There was a problem sending the request/);
      expect(err.statusCode).to.equal(404);
    });
  });
  it('should call next(error) with CustomUIError when RequestError (Timeout) is returned from the API', async () => {
    const next = sinon.spy();

    const e = {
      name: 'RequestError',
      message: 'Unhandled rejection RequestError: Error: read ECONNRESET',
    };

    const getAllUsers = proxyquire('../../middleware/get-all-users', {
      got: sinon.stub().rejects(e),
    });

    await getAllUsers('url', 10)(req, res, next);

    expect(req).to.include.keys('data');
    expect(req.data).to.not.include.keys('allUsersList');
    expect(next).to.be.calledOnceWithExactly(e);
  });
  it('should call next(error) when response from the API can not be parsed into JSON', async () => {
    const body = 'random string';

    const getAllUsers = proxyquire('../../middleware/get-all-users', {
      got: sinon.stub().resolves(body),
    });

    await getAllUsers('url', 10)(req, res, (err) => {
      expect(req).to.include.keys('data');
      expect(req.data).to.not.include.keys('allUsersList');
      expect(err).to.be.an.instanceOf(SyntaxError);
      expect(err.message).to.match(/Unexpected token u in JSON at position 0/);
    });
  });
});
