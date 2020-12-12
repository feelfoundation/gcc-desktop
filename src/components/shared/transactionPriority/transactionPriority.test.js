import React from 'react';
import { mount } from 'enzyme';
import { tokenMap } from '../../../constants/tokens';
import TransactionPriority from '.';
import transactionTypes from '../../../constants/transactionTypes';

const baseFees = {
  Low: 0.1,
  Medium: 0.2,
  High: 0.3,
};

describe('TransactionPriority', () => {
  let wrapper;
  const fee = 0.123;

  const props = {
    t: str => str,
    token: tokenMap.BTC.key,
    priorityOptions: [{ title: 'Low', value: baseFees.Low },
      { title: 'Medium', value: baseFees.Medium },
      { title: 'High', value: baseFees.High },
      { title: 'Custom', value: baseFees.Low }],
    selectedPriority: 0,
    setSelectedPriority: jest.fn(),
    fee,
    setCustomFee: jest.fn(),
    txType: transactionTypes().transfer.key,
  };
  beforeEach(() => {
    props.setSelectedPriority.mockRestore();
    props.setCustomFee.mockRestore();
    wrapper = mount(<TransactionPriority {...props} />);
  });

  it('renders properly', () => {
    expect(wrapper).toContainMatchingElement('.transaction-priority');
    expect(wrapper).toContainMatchingElement('.priority-selector');
    expect(wrapper).toContainMatchingElement('.fee-container');
  });

  it('renders low, medium and high processing speed options', () => {
    expect(wrapper).toContainMatchingElement('.option-Low');
    expect(wrapper).toContainMatchingElement('.option-Medium');
    expect(wrapper).toContainMatchingElement('.option-High');
  });

  it('renders custom fee option only when props.token is gcc', () => {
    expect(wrapper).not.toContainMatchingElement('.option-Custom');
    wrapper.setProps({ ...props, token: tokenMap.GCC.key });
    expect(wrapper).toContainMatchingElement('.option-Custom');
  });

  it('renders custom fee option with input when props.token is gcc', () => {
    expect(wrapper).not.toContainMatchingElement('.custom-fee-input');
    wrapper.setProps({ ...props, token: tokenMap.GCC.key, selectedPriority: 3 });
    wrapper.find('.option-Custom').simulate('click');
    expect(props.setSelectedPriority).toHaveBeenCalledTimes(1);
    expect(wrapper).toContainMatchingElement('.custom-fee-input');
  });

  it('when typed in custom fee input, the custom fee cb is called', () => {
    wrapper.setProps({ ...props, token: tokenMap.GCC.key, selectedPriority: 3 });
    wrapper.find('.custom-fee-input').at(1).simulate('change', { target: { value: '0.20' } });
    expect(props.setCustomFee).toHaveBeenCalledTimes(1);
  });

  it('hides the edit icon and shows the input when clicked in the "fee-value" element', () => {
    wrapper.setProps({ ...props, token: tokenMap.GCC.key, selectedPriority: 3 });
    // simulate blur so that the edit icon is shown
    wrapper.find('.custom-fee-input').at(1).simulate('blur');
    wrapper.find('span.fee-value').simulate('click');
    expect(wrapper).not.toContainMatchingElement('Icon[name="edit"]');
    expect(wrapper).toContainMatchingElement('.custom-fee-input');
  });
});
