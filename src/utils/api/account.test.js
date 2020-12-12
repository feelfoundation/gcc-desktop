import { getAccount } from './account';
import * as gccAccountApi from './gcc/account';
import networks from '../../constants/networks';

jest.mock('./gcc/account');

describe('Utils: Account API', () => {
  const address = '123L';
  const network = {
    name: networks.mainnet.name,
    networks: {
      GCC: {},
    },
  };

  describe('getAccount', () => {
    it('should resolve getAccount for specific token (BTC, GCC, ...) based on the address format ', async () => {
      const params = {
        address,
        network,
      };
      await getAccount(params);
      expect(gccAccountApi.getAccount).toHaveBeenCalledWith(expect.objectContaining({
        network,
        address,
      }));
    });
  });
});
