import React from 'react';
import { mount } from 'enzyme';
import WalletDetails from './walletDetails';

describe('WalletDetails', () => {
  let wrapper;

  const props = {
    account: {
      info: {
        GCC: {
          balance: '100',
          token: 'GCC',
        },
        BTC: {
          balance: '20',
          token: 'BTC',
        },
      },
    },
    settings: {
      token: {
        active: 'GCC',
        list: {
          GCC: true,
          BTC: true,
        },
      },
    },
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(<WalletDetails {...props} />);
  });

  it('Should render properly', () => {
    expect(wrapper).toContainMatchingElement('.coin-container');
    expect(wrapper).toContainMatchingElements(2, 'section.coin-row');
  });
});
