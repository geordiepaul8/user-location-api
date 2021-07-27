/* eslint-disable no-unused-expressions */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);
chai.use(require('chai-match'));

const proxyquire = require('proxyquire');

const DISTANCE_TO_LONDON = 50; // miles

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

describe(`Get all non-London users within ${DISTANCE_TO_LONDON} miles middleware`, () => {
  it(`should assign req.data.closeToLondonList with valid object struture when distance is within ${DISTANCE_TO_LONDON} miles`, async () => {
    const next = sinon.spy();

    const filterAllUsersWithin50mOfLondon = proxyquire('../../middleware/filter-all-users-within-50m-of-london', {
      './../utils/get-distance-between-coordinates.js': sinon.stub().returns(parseInt(DISTANCE_TO_LONDON, 10) - 1),
    });

    req = Object.assign(req, req.data);

    req.data = {
      londonUsersList: [
        {
          id: 1,
          name: 'london user',
          city: 'London',
          longitude: 1.00,
          latitude: 1.00,
        },
      ],
      allUsersList: [],
      outsideLondonUsersList: [
        {
          id: 2,
          name: 'non london user',
          city: 'Anywhere',
          longitude: 2.00,
          latitude: 2.00,
        },
      ],
    };

    await filterAllUsersWithin50mOfLondon(DISTANCE_TO_LONDON)(req, res, next);

    expect(req).to.include.keys('data');
    expect(req.data).to.include.keys('londonUsersList', 'allUsersList', 'closeToLondonList');
    expect(req.data.closeToLondonList).to.be.an('Array').and.have.length(1);

    // assert the data
    expect(req.data.closeToLondonList[0]).to.be.an('object')
      .and.to.have.keys(['id', 'name', 'city', 'latitude', 'longitude']);

    expect(req.data.closeToLondonList[0].id).to.be.a('Number').to.equal(2);
    expect(req.data.closeToLondonList[0].name).to.be.a('String').to.equal('non london user');
    expect(req.data.closeToLondonList[0].city).to.be.a('String').to.equal('Anywhere');
    expect(req.data.closeToLondonList[0].latitude).to.be.a('Number').to.equal(2.00);
    expect(req.data.closeToLondonList[0].longitude).to.be.a('Number').and.to.equal(2.00);

    expect(next).to.be.calledOnce;
  });
  it(`should not assign req.data.closeToLondonList with valid object struture when distance is equal to ${DISTANCE_TO_LONDON} miles`, async () => {
    const next = sinon.spy();

    const filterAllUsersWithin50mOfLondon = proxyquire('../../middleware/filter-all-users-within-50m-of-london', {
      './../utils/get-distance-between-coordinates.js': sinon.stub().returns(DISTANCE_TO_LONDON),
    });

    req = Object.assign(req, req.data);

    req.data = {
      londonUsersList: [
        {
          id: 1,
          name: 'london user',
          city: 'London',
          longitude: 1.00,
          latitude: 1.00,
        },
      ],
      allUsersList: [],
      outsideLondonUsersList: [
        {
          id: 2,
          name: 'non london user',
          city: 'Anywhere',
          longitude: 2.00,
          latitude: 2.00,
        },
      ],
    };

    await filterAllUsersWithin50mOfLondon(DISTANCE_TO_LONDON)(req, res, next);

    expect(req).to.include.keys('data');
    expect(req.data).to.include.keys('londonUsersList', 'allUsersList', 'closeToLondonList');
    expect(req.data.closeToLondonList).to.be.an('Array').and.have.length(0);
    expect(next).to.be.calledOnce;
  });
  it(`should not assign req.data.closeToLondonList with valid object struture when distance is greater than ${DISTANCE_TO_LONDON} miles`, async () => {
    const next = sinon.spy();

    const filterAllUsersWithin50mOfLondon = proxyquire('../../middleware/filter-all-users-within-50m-of-london', {
      './../utils/get-distance-between-coordinates.js': sinon.stub().returns(parseInt(DISTANCE_TO_LONDON, 10) + 1),
    });

    req = Object.assign(req, req.data);

    req.data = {
      londonUsersList: [
        {
          id: 1,
          name: 'london user',
          city: 'London',
          longitude: 1.00,
          latitude: 1.00,
        },
      ],
      allUsersList: [],
      outsideLondonUsersList: [
        {
          id: 2,
          name: 'non london user',
          city: 'Anywhere',
          longitude: 2.00,
          latitude: 2.00,
        },
      ],
    };

    await filterAllUsersWithin50mOfLondon(DISTANCE_TO_LONDON)(req, res, next);

    expect(req).to.include.keys('data');
    expect(req.data).to.include.keys('londonUsersList', 'allUsersList', 'closeToLondonList');
    expect(req.data.closeToLondonList).to.be.an('Array').and.have.length(0);
    expect(next).to.be.calledOnce;
  });
  it('should call next(error) when req.data does not include londonUsersList', async () => {
    /* eslint-disable-next-line global-require */
    const filterAllUsersWithin50mOfLondon = require('../../middleware/filter-all-users-within-50m-of-london');

    req = Object.assign(req, req.data);

    req.data = {
      allUsersList: [],
    };

    await filterAllUsersWithin50mOfLondon()(req, res, (err) => {
      expect(req).to.include.keys('data');
      expect(req.data).to.include.keys('allUsersList');
      expect(req.data).to.not.include.keys('londonUsersList', 'closeToLondonList');
      expect(err).to.be.an.instanceOf(TypeError);
      expect(err.message).to.match(/No valid data is found within the req.data object/);
    });
  });
  it('should call next(error) when req.data does not include allUsersList', async () => {
    /* eslint-disable-next-line global-require */
    const filterAllUsersWithin50mOfLondon = require('../../middleware/filter-all-users-within-50m-of-london');

    req = Object.assign(req, req.data);

    req.data = {
      londonUsersList: [],
    };

    await filterAllUsersWithin50mOfLondon(DISTANCE_TO_LONDON)(req, res, (err) => {
      expect(req).to.include.keys('data');
      expect(req.data).to.include.keys('londonUsersList');
      expect(req.data).to.not.include.keys('allUsersList', 'closeToLondonList');
      expect(err).to.be.an.instanceOf(TypeError);
      expect(err.message).to.match(/No valid data is found within the req.data object/);
    });
  });
  it('should call next(error) when filterValidPeopleOutsideLondon throws a Referenceerror', async () => {
    const filterAllUsersWithin50mOfLondon = proxyquire('../../middleware/filter-all-users-within-50m-of-london', {
      './../utils/get-distance-between-coordinates.js': sinon.stub().throws(() => new ReferenceError('error')),
    });

    req = Object.assign(req, req.data);

    req.data = {
      londonUsersList: [{
        id: 1,
        name: 'anyone',
      }],
      allUsersList: [],
      outsideLondonUsersList: [{
        id: 2,
        name: 'anyome again',
      }],
    };

    await filterAllUsersWithin50mOfLondon(DISTANCE_TO_LONDON)(req, res, (err) => {
      expect(req).to.include.keys('data');
      expect(req.data).to.include.keys('londonUsersList', 'allUsersList');
      expect(req.data).to.not.include.keys('closeToLondonList');
      expect(err).to.be.an.instanceOf(ReferenceError);
      expect(err.message).to.match(/error/);
    });
  });
  it('should call next(error) with TypeError when no req.data object exists', async () => {
    /* eslint-disable-next-line global-require */
    const filterAllUsersWithin50mOfLondon = require('../../middleware/filter-all-users-within-50m-of-london.js');

    await filterAllUsersWithin50mOfLondon(DISTANCE_TO_LONDON)(req, res, (err) => {
      expect(req).to.not.include.keys('data');
      expect(err).to.be.an.instanceOf(TypeError);
      expect(err.message).to.match(/No valid data is found within the req.data object/);
    });
  });
  [null, undefined, '123', true, false, [], {}].forEach((invalidDistanceToLondonParam) => {
    it(`should throw a ReferenceError for invalid distanceToLondon param: ${invalidDistanceToLondonParam}`, async () => {
      /* eslint-disable-next-line global-require */
      const filterAllUsersWithin50mOfLondon = require('../../middleware/filter-all-users-within-50m-of-london.js');

      req = Object.assign(req, req.data);

      req.data = {
        londonUsersList: [],
        allUsersList: [],
        outsideLondonUsersList: [],
      };

      await filterAllUsersWithin50mOfLondon(invalidDistanceToLondonParam)(req, res, (err) => {
        expect(err).to.be.an.instanceOf(ReferenceError);
        expect(err.message).to.match(/The function parameter \[distanceToLondon\] is invalid/);
      });
    });
  });
});
