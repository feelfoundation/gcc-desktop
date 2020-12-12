import { getBlocks } from './blocks';
import accounts from '../../../test/constants/accounts';

const mockBlockData = [];

jest.mock('./gcc/network', () => ({
  getAPIClient() {
    return {
      blocks: {
        get() {
          return {
            data: mockBlockData,
          };
        },
      },
    };
  },
}));

const mockNetwork = {
  networks: {
    GCC: {
      nodeUrl: '',
      code: 0,
      apiVersion: '2', // @todo Remove?
      nethash: '',
    },
  },
  name: '',
  serviceUrl: '',
};

describe('Blocks Api', () => {
  it('should return getBlocks', async () => {
    const options = {
      publicKey: accounts.delegate.publicKey,
      limit: 1,
    };
    const response = { data: mockBlockData };

    const returnedBlocks = await getBlocks(mockNetwork, options);

    return expect(returnedBlocks).toEqual(response);
  });
});
