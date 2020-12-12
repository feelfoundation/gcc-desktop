import Feel from '@feelhq/feel-client';// eslint-disable-line

export const getTransactionBytes = transaction =>
  Feel.transaction.utils.getTransactionBytes(transaction);

export const getBufferToHex = buffer => Feel.cryptography.bufferToHex(buffer);
