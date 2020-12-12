import Feel from '@feelhq/feel-client'; // eslint-disable-line
import networks from '../../../constants/networks';
import { tokenMap } from '../../../constants/tokens';

const apiClients = {};

// eslint-disable-next-line import/prefer-default-export
export const getAPIClient = (network) => {
  if (network.name && (!apiClients[network.name] || network.name === networks.customNode.name)) {
    const { nethash, nodes } = {
      [networks.testnet.name]: {
        nethash: Feel.APIClient.constants.TESTNET_NETHASH,
        nodes: networks.testnet.nodes,
      },
      [networks.mainnet.name]: {
        nethash: Feel.APIClient.constants.MAINNET_NETHASH,
        nodes: networks.mainnet.nodes,
      },
      [networks.customNode.name]: {
        nethash: network.networks[tokenMap.GCC.key] && network.networks[tokenMap.GCC.key].nethash,
        nodes: [network.networks[tokenMap.GCC.key] && network.networks[tokenMap.GCC.key].nodeUrl],
      },
    }[network.name] || {};
    // @todo if we delete nethash it will work just fine
    apiClients[network.name] = new Feel.APIClient(nodes, { nethash });
  }

  return apiClients[network.name];
};
