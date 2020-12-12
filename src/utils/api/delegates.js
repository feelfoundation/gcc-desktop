import { to } from 'await-to-js';
import Feel from '@feelhq/feel-client'; // eslint-disable-line
import { getBlocks } from './blocks';
import { getTransactions } from './transactions';
import { loadDelegateCache, updateDelegateCache } from '../delegates';
import { loginType } from '../../constants/hwConstants';
import { splitVotesIntoRounds } from '../voting';
import transactionTypes from '../../constants/transactionTypes';
import { signVoteTransaction } from '../hwManager';
import { getAPIClient } from './gcc/network';

export const getDelegates = (network, options) =>
  getAPIClient(network).delegates.get(options);

export const getDelegateInfo = (feelAPIClient, { address, publicKey }) => (
  new Promise(async (resolve, reject) => {
    try {
      const response = await getDelegates(feelAPIClient, { address });
      const delegate = response.data[0];
      updateDelegateCache(response.data, feelAPIClient.network);
      if (delegate) {
        const txDelegateRegister = (await getTransactions({
          feelAPIClient,
          address,
          limit: 1,
          type: transactionTypes().registerDelegate.apiSpecificCode,
        })).data[0];
        const blocks = await getBlocks(feelAPIClient, {
          generatorPublicKey: publicKey, limit: 1,
        });
        resolve({
          ...delegate,
          lastBlock: (blocks.data[0] && blocks.data[0].timestamp) || '-',
          txDelegateRegister,
        });
      } else {
        reject(new Error(`"${address}" is not a delegate`));
      }
    } catch (e) {
      reject(e);
    }
  })
);

export const getDelegateWithCache = (feelAPIClient, { publicKey }) => (
  new Promise(async (resolve, reject) => {
    loadDelegateCache(feelAPIClient.network, async (data) => {
      const storedDelegate = data[publicKey];
      if (storedDelegate) {
        resolve(storedDelegate);
      } else {
        const [error, response] = await to(getDelegates(feelAPIClient, { publicKey }));
        if (error) {
          reject(error);
        } else if (response.data[0]) {
          updateDelegateCache(response.data, feelAPIClient.network);
          resolve(response.data[0]);
        } else {
          reject(new Error(`No delegate with publicKey ${publicKey} found.`));
        }
      }
    });
  })
);

export const getDelegateByName = (feelAPIClient, name) => new Promise(async (resolve, reject) => {
  // eslint-disable-next-line max-statements
  loadDelegateCache(feelAPIClient.network, async (data) => {
    const storedDelegate = data[name];
    if (storedDelegate) {
      resolve(storedDelegate);
    } else {
      const [error, response] = await to(feelAPIClient.delegates.get({ search: name, limit: 101 }));
      if (error) {
        reject(error);
      } else {
        const delegate = response.data.find(({ username }) => username === name);
        if (delegate) {
          resolve(delegate);
        } else {
          reject(new Error(`No delegate with name ${name} found.`));
        }
        updateDelegateCache(response.data, feelAPIClient.network);
      }
    }
  });
});

const voteWithPassphrase = (
  passphrase,
  votes,
  unvotes,
  secondPassphrase,
  timeOffset,
  networkIdentifier,
) => (
  Promise.all(splitVotesIntoRounds({ votes: [...votes], unvotes: [...unvotes] })
    .map(res => Feel.transaction.castVotes({
      votes: res.votes,
      unvotes: res.unvotes,
      passphrase,
      secondPassphrase,
      timeOffset,
      networkIdentifier,
    })))
);

export const castVotes = async ({
  feelAPIClient,
  account,
  votedList,
  unvotedList,
  secondPassphrase,
  timeOffset,
  networkIdentifier,
}) => {
  const signedTransactions = account.loginType === loginType.normal
    ? await voteWithPassphrase(
      account.passphrase,
      votedList,
      unvotedList,
      secondPassphrase,
      timeOffset,
      networkIdentifier,
    )
    : await signVoteTransaction(account, votedList, unvotedList, timeOffset, networkIdentifier);

  return Promise.all(signedTransactions.map(transaction => (
    new Promise((resolve, reject) => {
      feelAPIClient.transactions.broadcast(transaction)
        .then(() => resolve(transaction))
        .catch(reject);
    })
  )));
};

export const getVotes = (network, { address }) =>
  getAPIClient(network).votes.get({ address, limit: 10, offset: 0 });

export const registerDelegate = (
  feelAPIClient,
  username,
  passphrase,
  secondPassphrase = null,
  timeOffset,
  networkIdentifier,
) => {
  const data = { username, passphrase, timeOffset };
  if (secondPassphrase) {
    data.secondPassphrase = secondPassphrase;
  }
  return new Promise((resolve, reject) => {
    const transaction = Feel.transaction.registerDelegate({ ...data, networkIdentifier });
    feelAPIClient.transactions
      .broadcast(transaction)
      .then(() => {
        resolve(transaction);
      })
      .catch(reject);
  });
};

export const getNextForgers = (feelAPIClient, params) => (
  new Promise((resolve, reject) => {
    feelAPIClient.delegates.getForgers(params)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  })
);
