const { expect } = require('chai');
const removeDulicates = require('../../utils/remove-duplicates.js');

describe('Remove duplicate entries from array', () => {
  [{}, null, undefined, 123, '123', true, false].forEach((list) => {
    it(`should throw a ReferenceError when not a valid array parameter: ${list}`, () => {
      expect(() => removeDulicates(list))
        .to.throw(ReferenceError, 'The list parameter is not a valid Array');
    });
  });
  it('should return empty list when it is provided an empty list', () => {
    const list = [];

    expect(removeDulicates(list)).to.be.an('array').that.has.length(0);
  });
  it('should remove 1 duplicate entry form the list', () => {
    const list = [
      {
        id: 1,
        name: 'random person',
      },
      {
        id: 2,
        name: 'radom person 2',
      },
      {
        id: 1,
        name: 'random person',
      },
    ];

    expect(removeDulicates(list)).to.be.an('array').that.has.length(2);
  });
  it('should not remove any entries form the list as there is no duplicates', () => {
    const list = [
      {
        id: 1,
        name: 'random person',
      },
      {
        id: 2,
        name: 'radom person 2',
      },
      {
        id: 3,
        name: 'random person 3',
      },
    ];

    expect(removeDulicates(list)).to.be.an('array').that.has.length(3);
  });
});
