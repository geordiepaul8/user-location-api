/* eslint-disable no-unused-expressions */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);
chai.use(require('chai-match'));

const filterUsersNotLivingInlondon = require('../../middleware/filter-users-not-living-in-london.js');

describe('Filter users that do not live in London', () => {
  it('should throw a TypeError when the req.data is not present', () => {
    const req = {
      log: {
        info: sinon.spy(),
        error: sinon.spy(),
        debug: sinon.spy(),
      },
    };
    const res = sinon.stub();

    filterUsersNotLivingInlondon()(req, res, (err) => {
      expect(req).to.not.include.keys('data');
      expect(err).to.be.an.instanceOf(TypeError);
      expect(err.message).to.match(/No valid data is found within the req.data object/);
    });
  });

  it('should throw a TypeError when the req.data.londonUsersList is not present', () => {
    const req = {
      log: {
        info: sinon.spy(),
        error: sinon.spy(),
        debug: sinon.spy(),
      },
      data: {
        allUsersList: [],
      },
    };
    const res = sinon.stub();

    filterUsersNotLivingInlondon()(req, res, (err) => {
      expect(req).to.include.keys('data');
      expect(req.data).to.include.keys('allUsersList');
      expect(req).to.not.include.keys('londonUsersList');
      expect(err).to.be.an.instanceOf(TypeError);
      expect(err.message).to.match(/No valid data is found within the req.data object/);
    });
  });

  it('should throw a TypeError when the req.data.allUsersList is not present', () => {
    const req = {
      log: {
        info: sinon.spy(),
        error: sinon.spy(),
        debug: sinon.spy(),
      },
      data: {
        londonUsersList: [],
      },
    };
    const res = sinon.stub();

    filterUsersNotLivingInlondon()(req, res, (err) => {
      expect(req).to.include.keys('data');
      expect(req.data).to.include.keys('londonUsersList');
      expect(req).to.not.include.keys('allUsersList');
      expect(err).to.be.an.instanceOf(TypeError);
      expect(err.message).to.match(/No valid data is found within the req.data object/);
    });
  });

  it('should throw a TypeError when the req.data.allUsersList & req.data.londonUsersList are not present', () => {
    const req = {
      log: {
        info: sinon.spy(),
        error: sinon.spy(),
        debug: sinon.spy(),
      },
      data: {},
    };
    const res = sinon.stub();

    filterUsersNotLivingInlondon()(req, res, (err) => {
      expect(req).to.include.keys('data');
      expect(req).to.not.include.keys('allUsersList', 'londonUsersList');
      expect(err).to.be.an.instanceOf(TypeError);
      expect(err.message).to.match(/No valid data is found within the req.data object/);
    });
  });

  it('should return a valid req.data.outsideLondonUsersList object with 1 user', async () => {
    const next = sinon.spy();
    const res = sinon.stub();

    const req = {
      log: {
        info: sinon.spy(),
        error: sinon.spy(),
        debug: sinon.spy(),
      },
      data: {
        allUsersList: [
          {
            id: 1,
            name: 'london name',
          },
          {
            id: 2,
            name: 'non london name',
          },
        ],
        londonUsersList: [
          {
            id: 1,
            name: 'london name',
          },
        ],
      },
    };

    filterUsersNotLivingInlondon()(req, res, next);

    expect(req).to.include.keys('data');
    expect(req.data).to.include.keys('outsideLondonUsersList', 'allUsersList', 'londonUsersList');
    expect(req.data.outsideLondonUsersList).to.be.an('Array').and.have.length(1);

    // assert the data
    expect(req.data.outsideLondonUsersList[0]).to.be.an('object')
      .and.to.have.keys(['id', 'name']);

    expect(req.data.outsideLondonUsersList[0].id).to.be.a('Number').to.equal(2);
    expect(req.data.outsideLondonUsersList[0].name).to.be.a('String').to.equal('non london name');

    expect(next).to.be.calledOnce;
  });

  it('should return a valid req.data.outsideLondonUsersList object with 2 user when the req.data.londonUsersList is empty = []', async () => {
    const next = sinon.spy();
    const res = sinon.stub();

    const req = {
      log: {
        info: sinon.spy(),
        error: sinon.spy(),
        debug: sinon.spy(),
      },
      data: {
        allUsersList: [
          {
            id: 1,
            name: 'london name',
          },
          {
            id: 2,
            name: 'non london name',
          },
        ],
        londonUsersList: [],
      },
    };

    filterUsersNotLivingInlondon()(req, res, next);

    expect(req).to.include.keys('data');
    expect(req.data).to.include.keys('outsideLondonUsersList', 'allUsersList', 'londonUsersList');
    expect(req.data.outsideLondonUsersList).to.be.an('Array').and.have.length(2);

    expect(next).to.be.calledOnce;
  });

  it('should return a valid req.data.outsideLondonUsersList object with 2 user when there are no matches within the req.data.londonUsersList', async () => {
    const next = sinon.spy();
    const res = sinon.stub();

    const req = {
      log: {
        info: sinon.spy(),
        error: sinon.spy(),
        debug: sinon.spy(),
      },
      data: {
        allUsersList: [
          {
            id: 1,
            name: 'london name',
          },
          {
            id: 2,
            name: 'non london name',
          },
        ],
        londonUsersList: [{
          id: 3,
          name: 'random',
        }],
      },
    };

    filterUsersNotLivingInlondon()(req, res, next);

    expect(req).to.include.keys('data');
    expect(req.data).to.include.keys('outsideLondonUsersList', 'allUsersList', 'londonUsersList');
    expect(req.data.outsideLondonUsersList).to.be.an('Array').and.have.length(2);

    expect(next).to.be.calledOnce;
  });

  it('should return a valid req.data.outsideLondonUsersList as empty =[] when the req.data.allUsersList is empty = []', async () => {
    const next = sinon.spy();
    const res = sinon.stub();

    const req = {
      log: {
        info: sinon.spy(),
        error: sinon.spy(),
        debug: sinon.spy(),
      },
      data: {
        allUsersList: [],
        londonUsersList: [
          {
            id: 1,
            name: 'london name',
          },
        ],
      },
    };

    filterUsersNotLivingInlondon()(req, res, next);

    expect(req).to.include.keys('data');
    expect(req.data).to.include.keys('outsideLondonUsersList', 'allUsersList', 'londonUsersList');
    expect(req.data.outsideLondonUsersList).to.be.an('Array').and.have.length(0);

    expect(next).to.be.calledOnce;
  });

  it('should return a valid req.data.outsideLondonUsersList as empty =[] when both req.data.allUsersList & req.data.londonUsersList are empty = []', async () => {
    const next = sinon.spy();
    const res = sinon.stub();

    const req = {
      log: {
        info: sinon.spy(),
        error: sinon.spy(),
        debug: sinon.spy(),
      },
      data: {
        allUsersList: [],
        londonUsersList: [],
      },
    };

    filterUsersNotLivingInlondon()(req, res, next);

    expect(req).to.include.keys('data');
    expect(req.data).to.include.keys('outsideLondonUsersList', 'allUsersList', 'londonUsersList');
    expect(req.data.outsideLondonUsersList).to.be.an('Array').and.have.length(0);

    expect(next).to.be.calledOnce;
  });
});
