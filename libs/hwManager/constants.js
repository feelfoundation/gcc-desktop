
export const ADD_DEVICE = 'add';
export const REMOVE_DEVICE = 'remove';
export const RESPONSE = 'result';
export const REQUEST = 'request';
export const PIN = 'pin';
export const IPC_MESSAGES = {
  CHECK_LEDGER: 'checkLedger',
  CONNECT: 'connect',
  DEVICE_LIST_CHANGED: 'hwDeviceListChanged',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  EXIT: 'exit',
  GET_ADDRESS: 'GET_ADDRESS',
  GET_CONNECTED_DEVICES_LIST: 'getConnectedDevicesList',
  GET_PUBLICK_KEY: 'GET_PUBLICKEY',
  HW_COMMAND: 'hwCommand',
  HW_CONNECTED: 'hwConnected',
  HW_DISCONNECTED: 'hwDisconnected',
  MISSING_PIN: 'pin_not_provided_from_ui',
  SIGN_TRANSACTION: 'SIGN_TX',
  VALIDATE_PIN: 'validateTrezorPin',
};
export const FUNCTION_TYPES = {
  [IPC_MESSAGES.GET_PUBLICK_KEY]: 'getPublicKey',
  [IPC_MESSAGES.GET_ADDRESS]: 'getAddress',
  [IPC_MESSAGES.SIGN_TRANSACTION]: 'signTransaction',
};
