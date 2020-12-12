import Feel from '@feelhq/feel-client';
import { toast } from 'react-toastify';
import { gccNetworkSet } from './gcc';
import networks from '../../constants/networks';
import { tokenMap } from '../../constants/tokens';
import actionTypes from '../../constants/actions';

describe('actions: network.gcc', () => {
  let dispatch;
  let APIClientBackup;
  let getConstantsMock;
  const nethash = '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d';

  beforeEach(() => {
    dispatch = jest.fn();
    APIClientBackup = Feel.APIClient;
    getConstantsMock = jest.fn();

    // TODO: find a better way of mocking Feel.APIClient
    Feel.APIClient = class MockAPIClient {
      constructor() {
        this.node = {
          getConstants: getConstantsMock,
        };
      }
    };
    Feel.APIClient.constants = APIClientBackup.constants;

    jest.resetModules();
  });

  afterEach(() => {
    Feel.APIClient = APIClientBackup;
  });

  describe('networkSet', () => {
    it.skip('should dispatch networkSet action with mainnet name', () => {
      const data = {
        name: networks.mainnet.name,
        network: {
          name: networks.mainnet.name,
          address: 'http://123.feel.surf',
        },
      };
      gccNetworkSet(data)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        data: {
          name: networks.mainnet.name,
          token: tokenMap.GCC.key,
          network: {
            name: networks.mainnet.name,
            address: 'http://123.feel.surf',
          },
        },
        type: actionTypes.networkSet,
      }));
    });

    it.skip('should dispatch networkSet action with customNode name, token, and network', async () => {
      const { name, address } = networks.customNode;
      getConstantsMock.mockResolvedValue({ data: { nethash } });
      const data = {
        name,
        network: {
          name,
          address,
          nethash,
        },
      };
      gccNetworkSet(data)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        data: {
          name,
          token: tokenMap.GCC.key,
          network: {
            nodeUrl: address,
            nethash,
          },
        },
        type: actionTypes.networkSet,
      }));
    });

    // TODO figure out why the expected dispatch is not called
    it.skip('should dispatch error toast if customNode unreachable without error messsage', async () => {
      const { name, nodeUrl } = networks.customNode;
      const error = { };
      jest.spyOn(toast, 'error');
      getConstantsMock.mockRejectedValue(error);
      gccNetworkSet({ name, network: { name, nodeUrl } })(dispatch);
      expect(toast.error).toHaveBeenCalledWith('Unable to connect to the node, no response from the server.');
    });

    it.skip('should dispatch error toast if customNode unreachable with custom error message', async () => {
      const { name, nodeUrl } = networks.customNode;
      const error = { message: 'Custom error message' };
      getConstantsMock.mockRejectedValue(error);
      jest.spyOn(toast, 'error');
      gccNetworkSet({ name, network: { name, nodeUrl } })(dispatch);
      expect(toast.error).toHaveBeenCalledWith('Unable to connect to the node, Error: Custom error message');
    });
  });
});
