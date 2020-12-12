import debounce from 'lodash.debounce';
import { mountWithRouter } from '../../../utils/testHelpers';
import RegisterDelegate from './registerDelegate';

jest.mock('lodash.debounce');

describe('RegisterDelegate', () => {
  const props = {
    account: {
      info: {
        GCC: {
          address: '123456789L',
          balance: 11000,
        },
      },
    },
    history: {
      push: jest.fn(),
      goBack: jest.fn(),
    },
    prevState: {},
    delegate: {},
    feelAPIClient: {
      delegates: {
        get: jest.fn(),
      },
    },
    delegateRegistered: jest.fn(),
    nextStep: jest.fn(),
    t: key => key,
  };

  beforeEach(() => {
    props.feelAPIClient.delegates.get.mockClear();
    debounce.mockReturnValue((name, error) => !error && props.feelAPIClient.delegates.get(name));
  });

  it('renders properly SelectName component', () => {
    const wrapper = mountWithRouter(RegisterDelegate, props);
    expect(wrapper).toContainMatchingElement('.select-name-container');
    expect(wrapper).toContainMatchingElements(2, '.select-name-text-description');
    expect(wrapper).toContainMatchingElement('.select-name-input');
    expect(wrapper).toContainMatchingElement('.feedback');
    expect(wrapper).toContainMatchingElement('.confirm-btn');
  });
});
