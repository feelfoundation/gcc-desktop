import { tokenMap } from '../../constants/tokens';
import gccApiUtils from './gcc';
import btcApiUtils from './btc';

export { default as account } from './account';
export { default as transactions } from './transactions';
export { default as service } from './service';

export default {
  [tokenMap.GCC.key]: gccApiUtils,
  [tokenMap.BTC.key]: btcApiUtils,
};
