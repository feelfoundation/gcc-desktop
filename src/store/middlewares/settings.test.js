import settingsMiddleware from './settings';
import actionTypes from '../../constants/actions';
import * as service from '../../actions/service';

jest.mock('../../actions/service');
jest.mock('../../actions/settings');
jest.mock('../../actions/transactions');

describe('Middleware: Settings', () => {
  const next = jest.fn();
  const store = {
    dispatch: jest.fn(),
    getState: () => ({
      settings: {
        token: { },
      },
    }),
  };

  it('should pass the action', () => {
    const action = { type: 'ANY_ACTION' };
    settingsMiddleware(store)(next)(action);
    expect(next).toBeCalledWith(action);
  });

  it('should not dispatch pricesRetrieved', () => {
    const action = {
      type: actionTypes.settingsUpdated,
      data: {
        test: true,
      },
    };

    settingsMiddleware(store)(next)(action);
    expect(service.pricesRetrieved).not.toBeCalled();
  });

  it('should dispatch pricesRetrieved', () => {
    const action = {
      type: actionTypes.settingsUpdated,
      data: {
        token: {
          active: 'GCC',
        },
      },
    };

    settingsMiddleware(store)(next)(action);
    expect(service.pricesRetrieved).toBeCalled();
  });
});
