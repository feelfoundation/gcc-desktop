import Feel from '@feelhq/feel-client';

import networks from '../../../constants/networks';
import { getAPIClient } from './network';
import { tokenMap } from '../../../constants/tokens';

describe('Utils: network GCC API', () => {
  describe('getAPIClient', () => {
    let APIClientBackup;
    let constructorSpy;

    beforeEach(() => {
      constructorSpy = jest.fn();
      // TODO: find a better way of mocking Feel.APIClient
      APIClientBackup = Feel.APIClient;
      Feel.APIClient = class MockAPIClient {
        constructor(...args) {
          constructorSpy(...args);
        }
      };
      Feel.APIClient.constants = APIClientBackup.constants;
    });

    afterEach(() => {
      Feel.APIClient = APIClientBackup;
    });

    it('should create a new mainnet Feel APIClient instance if network is mainnet', () => {
      const nethash = Feel.APIClient.constants.MAINNET_NETHASH;
      const network = {
        name: networks.mainnet.name,
        networks: {
          [tokenMap.GCC.key]: {
          },
        },
      };
      const apiClient = getAPIClient(network);
      expect(constructorSpy).toHaveBeenCalledWith(networks.mainnet.nodes, { nethash });

      // should return the same object of called twice
      expect(apiClient).toEqual(getAPIClient(network));
    });

    it('should create a new testnet Feel APIClient instance if network is testnet', () => {
      const nethash = Feel.APIClient.constants.TESTNET_NETHASH;
      const network = {
        name: networks.testnet.name,
        networks: {
          [tokenMap.GCC.key]: {
          },
        },
      };
      getAPIClient(network);
      expect(constructorSpy).toHaveBeenCalledWith(networks.testnet.nodes, { nethash });
    });

    it('should create a new customNode Feel APIClient instance if network is customNode', () => {
      const nethash = '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d';
      const nodeUrl = 'http://localhost:4500';
      const network = {
        name: networks.customNode.name,
        networks: {
          [tokenMap.GCC.key]: {
            nethash,
            nodeUrl,
          },
        },
      };
      getAPIClient(network);
      expect(constructorSpy).toHaveBeenCalledWith([nodeUrl], { nethash });
    });
  });
});
