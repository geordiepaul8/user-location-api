const { expect } = require('chai');

const removePersonalInformation = require('../../utils/remove-personal-information.js');

describe('Remove personal information', () => {
  it('should return [] when the parameter is []', () => {
    expect(removePersonalInformation([])).to.be.an('array').and.have.length(0);
  });
  it('should remove latitude, longitude, ip_address and email from the body', () => {
    const userarray = [
      {
        id: 1,
        first_name: 'first name',
        last_name: 'first name',
        ip_address: '1.2.3',
        latitude: 1.00,
        longitude: -1.00,
        email: 'a@a.com',
      },
    ];

    const sanitisedArray = removePersonalInformation(userarray);

    expect(sanitisedArray).to.be.an('array').and.have.length(1);
    expect(sanitisedArray[0]).to.have.keys('id', 'first_name', 'last_name');
    expect(sanitisedArray[0]).to.not.have.keys('ip_address', 'latitude', 'longitude', 'email');
  });
  it('should remove latitude, longitude, ip_address and email when other keys are malformed', () => {
    const userarray = [
      {
        id: 1,
        first_names: 'first name',
        last_names: 'first name',
        ip_address: '1.2.3',
        latitude: 1.00,
        longitude: -1.00,
        email: 'a@a.com',
      },
    ];

    const sanitisedArray = removePersonalInformation(userarray);

    expect(sanitisedArray).to.be.an('array').and.have.length(1);
    expect(sanitisedArray[0]).to.not.have.keys('ip_address', 'latitude', 'longitude', 'email');
  });
});
