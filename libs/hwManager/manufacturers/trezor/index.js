/* istanbul ignore file */
import {
  IPC_MESSAGES,
  PIN,
} from '../../constants';
import { TREZOR } from './constants';
import {
  getHardenedPath,
  toTrezorGrammar,
} from './utils';

/**
 * addDevice - function - Add a new device to the devices list.
 * @param {object} device - Device object comming from the trezor library
 * @param {function} add - Function that use for main file to include the device in the main list.
 */
const addDevice = (device, { add }) => {
  add({
    deviceId: device.features.device_id,
    label: device.features.label,
    model: device.features.model === '1'
      ? TREZOR.models.Trezor_Model_One
      : TREZOR.models.Trezor_Model_T,
    path: device.originalDescriptor.path,
    manufactor: TREZOR.name,
    openApp: true,
  });
};

/**
 * removeDevice - funcion - Remove a device from the main list and the device array.
 * @param {object} device - Device object comming from the trezor library
 * @param {function} remove - Function for remove a device from the main list.
 */
const removeDevice = (device, { remove }) => {
  remove(device.originalDescriptor.path);
};

const onPinCallback = (device, { pinCallback }) => {
  device.on(PIN, (type, callback) => pinCallback(type, callback));
};

/**
 * listener - function - Always listen for new messages for connect or disconnect devices.
 * @param {object} transport - Library use for handle the trezor devices.
 * @param {object} actions - Contains 2 functions: add and remove.
 * @param {function} actions.add - Function for add a new device to the main list.
 * @param {function} actions.remove - Function for remove a device from the main list.
 */
const listener = (transport, actions) => {
  transport.on(IPC_MESSAGES.CONNECT, (device) => {
    addDevice(device, actions);
    onPinCallback(device, actions);
  });
  transport.on(IPC_MESSAGES.DISCONNECT, (device) => { removeDevice(device, actions); });
  transport.on(IPC_MESSAGES.ERROR, (error) => { throw new Error(error); });
  process.on(IPC_MESSAGES.EXIT, () => { transport.onbeforeunload(); });
};

const getPublicKey = async (transporter, { device, data }) => {
  const trezorDevice = transporter.asArray().find(d => d.features.device_id === device.deviceId);
  if (!trezorDevice) Promise.reject(new Error('DEVICE_IS_NOT_CONNECTED'));

  return new Promise((resolve, reject) => {
    trezorDevice.waitForSessionAndRun(async (session) => {
      try {
        const { message } = await session.typedCall(
          'FeelGetPublicKey',
          'FeelPublicKey',
          {
            address_n: getHardenedPath(data.index),
            show_display: data.showOnDevice,
          },
        );
        return resolve(message.public_key);
      } catch (err) {
        return reject();
      }
    });
  });
};

const getAddress = async (transporter, { device, data }) => {
  const trezorDevice = transporter.asArray().find(d => d.features.device_id === device.deviceId);
  if (!trezorDevice) Promise.reject(new Error('DEVICE_IS_NOT_CONNECTED'));

  return new Promise((resolve, reject) => {
    trezorDevice.waitForSessionAndRun(async (session) => {
      try {
        const { message } = await session.typedCall(
          'FeelGetAddress',
          'FeelAddress',
          {
            address_n: getHardenedPath(data.index),
            show_display: data.showOnDevice,
          },
        );
        return resolve(message.public_key);
      } catch (err) {
        return reject();
      }
    });
  });
};

const signTransaction = (transporter, { device, data }) => {
  const trezorDevice = transporter.asArray().find(d => d.features.device_id === device.deviceId);
  if (!trezorDevice) Promise.reject(new Error('DEVICE_IS_NOT_CONNECTED'));

  return new Promise((resolve, reject) => {
    trezorDevice.waitForSessionAndRun(async (session) => {
      try {
        const { message } = await session.typedCall(
          'FeelSignTx',
          'FeelSignedTx',
          {
            address_n: getHardenedPath(data.index),
            transaction: toTrezorGrammar(data.tx),
          },
        );
        return resolve(message.signature);
      } catch (err) {
        return reject();
      }
    });
  });
};

const checkIfInsideFeelApp = async ({ device }) => device;

export default {
  checkIfInsideFeelApp,
  getAddress,
  getPublicKey,
  listener,
  signTransaction,
};
