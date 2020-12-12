import blocks from '../../../../../test/constants/blocks';
import transactions from '../../../../../test/constants/transactions';
import BlockDetails from './blockDetails';
import { mountWithRouter } from '../../../../utils/testHelpers';

describe('BlockDetails page', () => {
  let wrapper;
  const props = {
    t: key => key,
    blockDetails: {
      isLoading: false,
      data: blocks[0],
      loadData: jest.fn(),
      error: false,
    },
    blockTransactions: {
      isLoading: false,
      data: [],
      loadData: jest.fn(),
    },
    isMediumViewPort: false,
    match: {
      url: `/monitor/blocks/${blocks[0].id}`,
    },
  };

  const resizeWindow = (x, y) => {
    window.innerWidth = x;
    window.innerHeight = y;
    window.dispatchEvent(new Event('resize'));
  };

  beforeEach(() => {
    wrapper = mountWithRouter(BlockDetails, props);
  });

  it('renders a page properly without errors', () => {
    expect(wrapper.find('h1').at(0)).toHaveText('Block details');
    expect(wrapper.find('label').at(0)).toHaveText('Block ID');
    expect(wrapper.find('span.copy-title').at(0)).toHaveText(blocks[0].id);
    expect(wrapper.find('label').at(1)).toHaveText('Height');
    expect(wrapper.find('label').at(2)).toHaveText('Version');
    expect(wrapper.find('label').at(3)).toHaveText('Confirmations');
    expect(wrapper.find('label').at(4)).toHaveText('Reward');
    expect(wrapper.find('label').at(5)).toHaveText('Total fee');
    expect(wrapper.find('label').at(6)).toHaveText('Total forged');
    expect(wrapper.find('label').at(7)).toHaveText('Total amount');
    expect(wrapper.find('label').at(8)).toHaveText('Date');
    expect(wrapper.find('label').at(9)).toHaveText('Generated by');
    resizeWindow(1000, 500);

    const newProps = { ...props, isMediumViewPort: true };
    wrapper = mountWithRouter(BlockDetails, newProps);

    expect(wrapper.find('label').at(2)).not.toHaveText('Version');
  });

  it('renders a page with error', () => {
    const newProps = {
      ...props,
      blockDetails: {
        ...props.blockDetails,
        error: true,
      },
    };
    wrapper = mountWithRouter(BlockDetails, newProps);
    expect(wrapper.find('h1').at(0)).toHaveText('Block details');
    expect(wrapper).toContainMatchingElement('Feedback');
    expect(wrapper.find('span').at(0)).toHaveText('Failed to load block details.');
  });

  it('renders a page with transaction list', () => {
    wrapper = mountWithRouter(BlockDetails, props);
    expect(wrapper.find('TransactionRow')).toHaveLength(0);

    const newProps = {
      ...props,
      blockTransactions: {
        ...props.blockTransactions,
        isLoading: false,
        data: transactions,
      },
    };
    wrapper = mountWithRouter(BlockDetails, newProps);
    expect(wrapper.find('TransactionRow')).toHaveLength(transactions.length);
  });

  it('shows a message when empty transactions response', () => {
    const newProps = {
      ...props,
      blockTransactions: {
        ...props.blockTransactions,
        error: 'failed',
      },
    };
    wrapper = mountWithRouter(BlockDetails, newProps);
    expect(wrapper.find('Empty')).toHaveLength(1);
  });
});