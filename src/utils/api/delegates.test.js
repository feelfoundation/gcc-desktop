import { to } from 'await-to-js';
import Feel from '@feelhq/feel-client';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  castVotes,
  getDelegateByName,
  getDelegateWithCache,
  getDelegateInfo,
  getDelegates,
  getVotes,
  registerDelegate,
} from './delegates';
import { loginType } from '../../constants/hwConstants';
import accounts from '../../../test/constants/accounts';
import delegates from '../../../test/constants/delegates';
import * as hwManager from '../hwManager';

describe('Utils: Delegate', () => {
  let feelAPIClientMockDelegates;
  let feelAPIClientMockVotes;
  let feelAPIClientMockTransations;
  let feelTransactionsCastVotesStub;
  let feelTransactionsRegisterDelegateStub;
  let signVoteTransaction;
  const timeOffset = 0;

  const feelAPIClient = {
    delegates: {
      get: () => { },
    },
    votes: {
      get: () => { },
    },
    transactions: {
      broadcast: () => {},
      get: () => Promise.resolve({ data: [] }),
    },
    blocks: {
      get: () => Promise.resolve({ data: [] }),
    },
    network: {
      name: 'Testnet',
    },
  };

  beforeEach(() => {
    feelTransactionsCastVotesStub = sinon.stub(Feel.transaction, 'castVotes');
    feelTransactionsRegisterDelegateStub = sinon.stub(Feel.transaction, 'registerDelegate');
    feelAPIClientMockDelegates = sinon.mock(feelAPIClient.delegates);
    feelAPIClientMockVotes = sinon.mock(feelAPIClient.votes);
    feelAPIClientMockTransations = sinon.stub(feelAPIClient.transactions, 'broadcast').resolves({ id: '1234' });
    sinon.stub(feelAPIClient.transactions, 'get');
    signVoteTransaction = sinon.stub(hwManager, 'signVoteTransaction').resolves([{ id: '1234' }]);
  });

  afterEach(() => {
    feelAPIClientMockDelegates.verify();
    feelAPIClientMockDelegates.restore();

    feelAPIClientMockVotes.verify();
    feelAPIClientMockVotes.restore();

    feelAPIClientMockTransations.restore();

    feelTransactionsCastVotesStub.restore();
    feelTransactionsRegisterDelegateStub.restore();

    feelAPIClient.transactions.get.restore();
    signVoteTransaction.restore();
    localStorage.clear();
  });

  describe('getDelegates', () => {
    it.skip('should return getDelegates(feelAPIClient, options) if options = {}', () => {
      const options = {};
      const response = { data: [] };
      feelAPIClientMockDelegates.expects('get').withArgs(options).resolves(response);

      const returnedPromise = getDelegates(feelAPIClient, options);
      expect(returnedPromise).to.eventually.equal(response);
    });

    it.skip('should return getDelegates(feelAPIClient, options) if options.q is set', () => {
      const options = { q: 'genesis_1' };
      const response = { data: [] };
      feelAPIClientMockDelegates.expects('get').withArgs(options).resolves(response);

      const returnedPromise = getDelegates(feelAPIClient, options);
      return expect(returnedPromise).to.eventually.equal(response);
    });
  });

  describe('getDelegateByInfo', () => {
    it.skip('should resolve delegate object with lastBlock and txDelegateRegister', () => {
      const delegate = delegates[0];
      const { address } = delegate.account;
      feelAPIClientMockDelegates.expects('get').withArgs({ address })
        .resolves({ data: [delegate] });

      const txDelegateRegister = { id: '091241204970', timestamp: '14023472398' };
      feelAPIClient.transactions.get.resolves({ data: [txDelegateRegister] });

      return expect(getDelegateInfo(feelAPIClient, { address })).to.eventually.deep.equal({
        ...delegate,
        lastBlock: '-',
        txDelegateRegister,
      });
    });

    it.skip('should reject if delegate not found', () => {
      const { address } = accounts.genesis;
      feelAPIClientMockDelegates.expects('get').withArgs({ address })
        .resolves({ data: [] });

      return expect(getDelegateInfo(feelAPIClient, { address })).to.eventually.be.rejectedWith(
        `"${address}" is not a delegate`,
      );
    });
  });

  describe('getDelegateWithCache', () => {
    const network = { name: 'Mainnet' };
    it.skip('should resolve based on given publicKey', async () => {
      const { publicKey } = delegates[0].account;
      feelAPIClientMockDelegates.expects('get').withArgs({
        publicKey,
      }).resolves({ data: [delegates[0]] });

      const resolved = await getDelegateWithCache(feelAPIClient, { publicKey, network });
      expect(resolved).to.equal(delegates[0]);
    });

    it.skip('should resolve from cache if called twice', async () => {
      const { publicKey } = delegates[0].account;
      feelAPIClientMockDelegates.expects('get').withArgs({
        publicKey,
      }).resolves({ data: [delegates[0]] });

      await getDelegateWithCache(feelAPIClient, { publicKey, network });
      const resolved = await getDelegateWithCache(feelAPIClient, { publicKey, network });
      expect(resolved).to.deep.equal(delegates[0]);
    });

    it.skip('should reject if delegate not found', async () => {
      const { publicKey } = delegates[0].account;
      feelAPIClientMockDelegates.expects('get').withArgs({
        publicKey,
      }).resolves({ data: [] });

      const [error] = await to(getDelegateWithCache(feelAPIClient, { publicKey, network }));
      expect(error.message).to.equal(`No delegate with publicKey ${publicKey} found.`);
    });

    it.skip('should reject if delegate request failed', async () => {
      const error = 'Any network error';
      const { publicKey } = delegates[0].account;
      feelAPIClientMockDelegates.expects('get').withArgs({
        publicKey,
      }).rejects(error);

      expect(await to(
        getDelegateWithCache(feelAPIClient, { publicKey, network }),
      )).to.deep.equal([error, undefined]);
    });
  });

  describe('getDelegateByName', () => {
    it.skip('should resolve delegate genesis_3 if name = genesis_3', () => {
      const name = delegates[0].username;
      feelAPIClientMockDelegates.expects('get').withArgs({
        search: name, limit: 101,
      }).resolves({ data: delegates });

      const returnedPromise = getDelegateByName(feelAPIClient, name);
      expect(returnedPromise).to.eventually.equal(delegates[0]);
    });

    it.skip('should reject if given name does not exist', () => {
      const name = `${delegates[0].username}_not_exist`;
      feelAPIClientMockDelegates.expects('get').withArgs({
        search: name, limit: 101,
      }).resolves({ data: [] });

      const returnedPromise = getDelegateByName(feelAPIClient, name);
      expect(returnedPromise).to.be.rejectedWith();
    });
  });

  describe('getVotes', () => {
    it.skip('should get votes for an address with no parameters', () => {
      const address = '123L';
      const offset = 0;
      const limit = 101;
      feelAPIClientMockVotes.expects('get').withArgs({ address, offset, limit }).once();
      getVotes(feelAPIClient, { address });
    });
  });

  describe('registerDelegate', () => {
    it.skip('should broadcast a registerDelegate transaction without second passphrase', () => {
      const transaction = { id: '1234' };
      const username = 'username';
      const passphrase = 'passphrase';
      const secondPassphrase = undefined;

      feelTransactionsRegisterDelegateStub.withArgs({
        username,
        passphrase,
        timeOffset,
      }).returns(transaction);

      registerDelegate(feelAPIClient, username, passphrase, secondPassphrase, timeOffset);
      expect(feelAPIClient.transactions.broadcast).to.have.been.calledWith(transaction);
    });

    it.skip('should broadcast a registerDelegate transaction with second passphrase', () => {
      const transaction = { id: '1234' };
      const username = 'username';
      const passphrase = 'passphrase';
      const secondPassphrase = 'secondPassphrase';

      feelTransactionsRegisterDelegateStub.withArgs({
        username,
        passphrase,
        secondPassphrase,
        timeOffset,
      }).returns(transaction);

      registerDelegate(feelAPIClient, username, passphrase, secondPassphrase, timeOffset);
      expect(feelAPIClient.transactions.broadcast).to.have.been.calledWith(transaction);
    });
  });

  describe('castVotes', () => {
    it.skip('should call castVotes and broadcast transaction regular login', async () => {
      const votes = [
        accounts.genesis.publicKey,
        accounts.delegate.publicKey,
      ];
      const unvotes = [
        accounts.empty_account.publicKey,
        accounts.delegate_candidate.publicKey,
      ];
      const transaction = { id: '1234' };
      const secondPassphrase = null;
      feelTransactionsCastVotesStub.withArgs({
        votes,
        unvotes,
        passphrase: accounts.genesis.passphrase,
        secondPassphrase,
        timeOffset,
      }).returns(transaction);

      await castVotes({
        feelAPIClient,
        account: {
          ...accounts.genesis,
          loginType: loginType.normal,
        },
        votedList: votes,
        unvotedList: unvotes,
        secondPassphrase,
        timeOffset,
      });
      expect(feelAPIClient.transactions.broadcast).to.have.been.calledWith(transaction);
    });

    it.skip('should call castVotes and broadcast transaction with hardware wallet', async () => {
      const votes = [
        accounts.genesis.publicKey,
        accounts.delegate.publicKey,
      ];
      const unvotes = [
        accounts.empty_account.publicKey,
        accounts.delegate_candidate.publicKey,
      ];
      const transaction = { id: '1234' };
      const secondPassphrase = null;
      feelTransactionsCastVotesStub.withArgs({
        votes,
        unvotes,
        passphrase: accounts.genesis.passphrase,
        secondPassphrase,
        timeOffset,
      }).returns(transaction);

      await castVotes({
        feelAPIClient,
        account: {
          ...accounts.genesis,
          loginType: loginType.ledger,
        },
        votedList: votes,
        unvotedList: unvotes,
        secondPassphrase,
        timeOffset,
      });
      expect(feelAPIClient.transactions.broadcast).to.have.been.calledWith(transaction);
    });
  });
});
