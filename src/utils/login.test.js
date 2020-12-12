import { expect } from 'chai';
import { validateUrl } from './login';

describe('validateUrl', () => {
  it('should set address and addressValidity="" for a valid address', () => {
    const validURL = 'http://localhost:8080';
    const data = validateUrl(validURL);
    const expectedData = {
      address: validURL,
      addressValidity: '',
    };
    expect(data).to.deep.equal(expectedData);
  });

  it('should set address and addressValidity correctly event without http', () => {
    const validURL = '127.0.0.1:8080';
    const data = validateUrl(validURL);
    const expectedData = {
      address: validURL,
      addressValidity: '',
    };
    expect(data).to.deep.equal(expectedData);
  });

  it('should set address and addressValidity="Please check the address" for a valid address', () => {
    const validURL = 'http:localhost:8080';
    const data = validateUrl(validURL);
    const expectedData = {
      address: validURL,
      addressValidity: 'Please check the address',
    };
    expect(data).to.deep.equal(expectedData);
  });
});