import React from 'react';
import { mount } from 'enzyme';
import UnlockDevice from './unlockDevice';

jest.mock('../../../utils/hwManager', () => ({
  checkIfInsideFeelApp: jest.fn(() => Promise.resolve()),
}));

describe('Unlock Device', () => {
  let wrapper;
  const props = {
    deviceId: 1,
    devices: [
      { deviceId: 1, openApp: false, model: 'Ledger' },
      { deviceId: 2, openApp: true, model: 'Trezor' },
      { deviceId: 3, openApp: true, model: 'Ledger' },
    ],
    t: v => v,
    nextStep: jest.fn(),
    prevStep: jest.fn(),
    goBack: jest.fn(),
  };

  const setup = data => mount(<UnlockDevice {...data} />);

  beforeEach(() => {
    wrapper = setup(props);
  });

  it('Should render asking for opening app on Ledger', async () => {
    expect(props.nextStep).not.toBeCalled();
    // TODO refactor this as should be a better way to test it https://stackoverflow.com/a/43855794
    jest.advanceTimersByTime(1000);
    setImmediate(() => {
      wrapper.find('button').simulate('click');
      expect(props.goBack).toBeCalled();
    });
  });

  it('Should call nextStep if openApp = true, or not Ledger', () => {
    wrapper = setup({ ...props, deviceId: 2 });
    expect(props.nextStep).toBeCalled();
    wrapper = setup({ ...props, deviceId: 3 });
    expect(props.nextStep).toBeCalled();
    wrapper.unmount();
  });

  it('Should call nextStep after openApp is set to true', () => {
    wrapper = setup({ ...props, devices: [{ deviceId: 1, openApp: true, model: 'Ledger' }] });
    wrapper.update();
    expect(props.nextStep).toBeCalled();
  });

  it('Call prevStep if device disconnects', () => {
    wrapper.setProps({ devices: [] });
    wrapper.update();
    expect(props.prevStep).toBeCalled();
  });
});
