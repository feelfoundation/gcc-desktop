import { expect } from 'chai';
import { spy } from 'sinon';
import { fromRawGCC } from './gcc';
import Notification, { Notify } from './notification';

describe('Notification', () => {
  let notify;
  const callbacks = {};

  beforeEach(() => {
    window.ipc = { on: (key, callback) => { callbacks[key] = callback; } };
    window.Notification = Notify;
    notify = Notification.init();
  });

  describe('about(data)', () => {
    const amount = 100000000;
    const mockNotification = spy();

    it('should call this._deposit', () => {
      const spyFn = spy(notify, '_deposit');
      notify.isFocused = false;
      notify.about('deposit', amount);
      expect(spyFn).to.have.been.calledWith(amount);
    });

    it('should call window.Notification', () => {
      window.Notification = mockNotification;
      const msg = `You've received ${fromRawGCC(amount)} GCC.`;

      notify.isFocused = false;
      notify.about('deposit', amount);
      expect(mockNotification).to.have.been.calledWith('GCC received', { body: msg });
      mockNotification.resetHistory();
    });

    it('should not call window.Notification if app is focused', () => {
      notify.isFocused = false;
      callbacks.focus();
      notify.about('deposit', amount);
      expect(mockNotification).to.have.been.not.calledWith();
      mockNotification.resetHistory();
    });

    it('should do nothing if an unhandled notification is supplied', () => {
      callbacks.blur();
      notify.about('unhandled_notification');
      expect(mockNotification).to.have.been.not.calledWith();
      mockNotification.resetHistory();
    });
  });
});
