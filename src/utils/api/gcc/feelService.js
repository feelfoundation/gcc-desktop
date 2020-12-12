// eslint-disable-next-line import/no-extraneous-dependencies
import { cryptography, transactions } from '@feelhq/feel-client';
import io from 'socket.io-client';
import * as popsicle from 'popsicle';
import { DEFAULT_LIMIT } from '../../../constants/monitor';
import { getNetworkNameBasedOnNethash } from '../../getNetwork';
import { getTimestampFromFirstBlock } from '../../datetime';
import i18n from '../../../i18n';
import voting from '../../../constants/voting';
import { adaptTransactions } from './adapters';
import transactionTypes from '../../../constants/transactionTypes';

const formatDate = (value, options) => getTimestampFromFirstBlock(value, 'DD.MM.YY', options);

const feelServiceGet = ({
  path, transformResponse = x => x, searchParams = {}, network,
}) => new Promise((resolve, reject) => {
  if (network.serviceUrl === 'unavailable') {
    reject(new Error('Feel Service is not available for this network.'));
  } else {
    popsicle.get(`${network.serviceUrl}${path}?${new URLSearchParams(searchParams)}`)
      .use(popsicle.plugins.parse('json'))
      .then((response) => {
        if (response.statusType() === 2) {
          resolve(transformResponse(response.body));
        } else {
          reject(new Error(response.body.message || response.body.error));
        }
      }).catch((error) => {
        if (error.code === 'EUNAVAILABLE') {
          const networkName = getNetworkNameBasedOnNethash(network);
          error = new Error(i18n.t('Unable to connect to {{networkName}}', { networkName }));
        }
        reject(error);
      });
  }
});

const feelServiceSocketGet = (request, network) => new Promise((resolve, reject) => {
  const socket = io(`${network.serviceUrl}/rpc`, { transports: ['websocket'] });
  socket.emit('request', request, (response) => {
    if (Array.isArray(response)) {
      resolve(response);
    } else if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
});

const feelServiceApi = {
  getPriceTicker: network =>
    feelServiceGet({
      path: '/api/market/prices',
      transformResponse: response => response.data,
      network,
    }),

  getNewsFeed: (network, searchParams) => feelServiceGet({
    path: '/api/market/newsfeed',
    searchParams,
    transformResponse: response => response.data,
    network,
  }),

  getLastBlocks: async (
    network, { dateFrom, dateTo, ...searchParams },
  ) => feelServiceGet({
    path: '/api/blocks',
    searchParams: {
      limit: DEFAULT_LIMIT,
      ...searchParams,
      ...(dateFrom && { fromTimestamp: formatDate(dateFrom) }),
      ...(dateTo && { toTimestamp: formatDate(dateTo, { inclusive: true }) }),
    },
    network,
  }),

  getBlockDetails: async (network, { id }) => feelServiceGet({
    path: '/api/blocks',
    searchParams: {
      blockId: id,
    },
    network,
  }),

  getTransactions: async (network, {
    dateFrom, dateTo, amountFrom, amountTo, ...searchParams
  }) => feelServiceGet({
    path: '/api/transactions',
    transformResponse: response => ({
      data: adaptTransactions(response).data,
      meta: response.meta,
    }),
    searchParams: {
      limit: DEFAULT_LIMIT,
      ...(dateFrom && { from: formatDate(dateFrom) }),
      ...(dateTo && { to: formatDate(dateTo, { inclusive: true }) }),
      ...(amountFrom && { min: transactions.utils.convertGCCToFellows(amountFrom) }),
      ...(amountTo && { max: transactions.utils.convertGCCToFellows(amountTo) }),
      ...searchParams,
    },
    network,
  }),

  getBlockTransactions: async (network, { id, ...searchParams }) => feelServiceGet({
    path: '/api/blocks',
    searchParams: {
      blockId: id,
      limit: DEFAULT_LIMIT,
      sort: 'totalAmount:asc',
      ...searchParams,
    },
    network,
  }),

  getStandbyDelegates: async (network, {
    offset = 0, tab, ...searchParams
  }) => feelServiceGet({
    path: '/api/delegates',
    transformResponse: response => ({
      data: response.data.filter(
        delegate => delegate.rank > voting.numberOfActiveDelegates,
      ),
      meta: response.meta,
    }),
    searchParams: {
      offset: offset + (Object.keys(searchParams).length ? 0 : voting.numberOfActiveDelegates),
      limit: DEFAULT_LIMIT,
      ...searchParams,
    },
    network,
  }),

  getActiveDelegates: async (network, { search = '', tab, ...searchParams }) => feelServiceGet({
    path: '/api/delegates',
    transformResponse: response => ({
      data: response.data.filter(
        delegate => delegate.username.includes(search),
        // delegate => delegate.username.includes(search),
        // delegate => delegate.forgingTime.status.includes(search),
      ),
      meta: response.meta,
    }),
    searchParams: {
      limit: voting.numberOfActiveDelegates,
      ...searchParams,
    },
    network,
  }),

  /**
   * Returns feel-service URL based on network name and nethash
   *
   * In particular it resolves mainnet/testnet nethash to coresponding feel-service instance
   *
   * @param {Object} network  - structured as network store: src/store/reducers/network.js
   * @param {String} network.name
   * @param {String} network.networks.GCC.nethash - if name is "Custom node"
   * @return {String} feel-service URL
   */
  getFeelServiceUrl: network => network.serviceUrl,

  getActiveAndStandByDelegates: async network => feelServiceGet({
    path: '/api/delegates',
    searchParams: { offset: 101, limit: 100 },
    network,
  }),

  getRegisteredDelegates: async network => feelServiceGet({
    path: '/api/transactions',
    searchParams: {
      limit: 100,
      // type: transactionTypes().registerDelegate.outgoingCode,
      type: 2,
      sort: 'timestamp:asc',
    },
    network,
  }),

  getNextForgers: async (network, searchParams) => feelServiceGet({
    path: '/api/delegates/forgers',
    searchParams: { limit: DEFAULT_LIMIT, ...searchParams },
    transformResponse: response => response.data,
    network,
  }),

  getTopAccounts: async (network, searchParams) => feelServiceGet({
    path: '/api/accounts',
    searchParams: {
      limit: DEFAULT_LIMIT,
      sort: 'balance:desc',
      ...searchParams,
    },
    network,
  }),

  getNetworkStatus: async network => feelServiceGet({
    path: '/api/node/status',
    network,
  }),

  getNetworkStatistics: network => feelServiceGet({
    path: '/api/peers',
    network,
  }),

  listenToBlockchainEvents: ({ event, callback, network = { serviceUrl: '' } }) => {
    const socket = io(
      `${network.serviceUrl}/blockchain`,
      { transports: ['websocket'] },
    );
    socket.on(event, callback);

    return function cleanUp() {
      socket.close();
    };
  },

  getTxStats: (network, searchParams) => {
    const config = {
      week: { path: 'day', limit: 7 },
      month: { path: 'month', limit: 6 },
      year: { path: 'month', limit: 12 },
    };
    return feelServiceGet({
      path: `/api/transactions?${config[searchParams.period].path}`,
      searchParams: { limit: config[searchParams.period].limit },
      network,
    });
  },

  getConnectedPeers: (network, searchParams) =>
    feelServiceGet({
      path: '/api/peers',
      searchParams,
      network,
    }),

  getLatestVotes: async (network, params = {}) => {
    const voteTransactionsRequest = {
      method: 'get.transactions',
      params: {
        limit: DEFAULT_LIMIT,
        type: transactionTypes().vote.outgoingCode,
        ...params,
      },
    };
    const voteTransactions = await feelServiceSocketGet(voteTransactionsRequest, network);

    const addresses = [
      ...voteTransactions.data.map(({ senderId }) => senderId),
      ...voteTransactions.data.reduce((accumulator, { asset: { votes } }) => ([
        ...accumulator,
        ...votes.map(v => cryptography.getAddressFromPublicKey(v.substr(1))),
      ]), []),
    ];
    const accountsRequest = [...new Set(addresses)].map(address => ({
      method: 'get.accounts',
      params: { address },
    }));

    const accounts = await feelServiceSocketGet(accountsRequest, network);

    const accountsMap = accounts.reduce((accumulator, { result: { data } }) => ({
      ...accumulator,
      [data[0].address]: data[0],
    }), {});

    const data = voteTransactions.data.map(({ asset, ...tx }) => ({
      ...tx,
      balance: accountsMap[tx.senderId] && accountsMap[tx.senderId].balance,
      votes: asset.votes.map(vote => ({
        status: vote.substr(0, 1),
        ...accountsMap[cryptography.getAddressFromPublicKey(vote.substr(1))],
      })),
    }));

    return { data, meta: voteTransactions.meta };
  },

  getVoteNames: async (network, params) => {
    const request = params.publicKeys.map(publickey => ({
      method: 'get.accounts',
      params: { publickey },
    }));
    const results = await feelServiceSocketGet(request, network);

    return results
      .map(result => result.result.data[0])
      .reduce((acc, item) => {
        acc[item.publicKey] = { ...item.delegate, account: { address: item.address } };
        return acc;
      }, {});
  },
};

export default feelServiceApi;
