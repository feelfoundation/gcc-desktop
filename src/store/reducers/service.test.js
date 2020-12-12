import service, { INITIAL_STATE } from './service';
import actionTypes from '../../constants/actions';

describe('reducers: service', () => {
  let state;

  beforeEach(() => {
    state = {};
  });

  it('should create the empty state initially', () => {
    const createdState = service();
    expect(createdState).toEqual(INITIAL_STATE);
  });

  it('should return updated state in case of actionTypes.pricesRetrieved', () => {
    const priceTicker = {
      BTC: {},
      GCC: { USD: 1, EUR: 1 },
    };

    const action = {
      type: actionTypes.pricesRetrieved,
      data: {
        priceTicker,
        activeToken: 'GCC',
      },
    };

    expect(service(state, action)).toEqual({
      priceTicker: {
        BTC: {},
        GCC: { EUR: 1, USD: 1 },
      },
    });
  });
});
