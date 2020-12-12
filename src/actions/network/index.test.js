import { networkSet, networkStatusUpdated } from './index';
import * as gccNetworkActions from './gcc';
import networks from '../../constants/networks';

describe('actions: network', () => {
  let dispatch;

  beforeEach(() => {
    jest.resetModules();
    dispatch = jest.fn();
    jest.spyOn(gccNetworkActions, 'gccNetworkSet');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('networkSet', () => {
    it('should call gcc networkSet action', async () => {
      const { name } = networks.testnet;
      networkSet({ name })(dispatch);
      expect(gccNetworkActions.gccNetworkSet).toHaveBeenCalled();
    });
  });

  describe('networkStatusUpdated', () => {
    it('should create networkStatusUpdated action ', () => {
      const online = false;
      expect(networkStatusUpdated({ online })).toMatchObject({
        data: { online },
      });
    });
  });
});
