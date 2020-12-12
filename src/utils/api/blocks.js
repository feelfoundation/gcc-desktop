import { getAPIClient } from './gcc/network';

export const getBlocks = (network, options) =>
  getAPIClient(network).blocks.get(options);

export default {
  getBlocks,
};
