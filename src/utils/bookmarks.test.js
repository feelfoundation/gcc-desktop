import { expect } from 'chai';
import { stub } from 'sinon';
import {
  getIndexOfBookmark,
} from './bookmarks';

describe('Bookmarks', () => {
  const accounts = {
    GCC: [{
      address: '1234L',
      title: 'some title',
      balance: 0,
    }, {
      address: '5678L',
      title: 'some title',
      balance: 100000,
    }],
    BTC: [],
  };

  beforeEach(() => {
    stub(localStorage, 'getItem');
    stub(localStorage, 'setItem');
  });

  afterEach(() => {
    localStorage.getItem.restore();
    localStorage.setItem.restore();
  });

  describe('getIndexOfBookmark', () => {
    it('gets the index based on the address', () => {
      const data = {
        address: accounts.GCC[0].address,
        token: 'GCC',
      };
      expect(getIndexOfBookmark(accounts, data)).to.equal(0);
    });
  });
});
