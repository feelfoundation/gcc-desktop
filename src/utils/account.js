import Feel from '@feelhq/feel-client'; // eslint-disable-line
import { tokenMap } from '../constants/tokens';

export const extractPublicKey = passphrase =>
  Feel.cryptography.getKeys(passphrase).publicKey;

/**
 * @param {String} data - passphrase or public key
 */
export const extractAddress = (data) => {
  if (!data) {
    return false;
  }
  if (data.indexOf(' ') < 0) {
    return Feel.cryptography.getAddressFromPublicKey(data);
  }
  return Feel.cryptography.getAddressFromPassphrase(data);
};

export const getActiveTokenAccount = state => ({
  ...state.account,
  ...((state.account.info && state.account.info[
    state.settings.token && state.settings.token.active
      ? state.settings.token.active
      : tokenMap.GCC.key
  ]) || {}),
});
