import { gccNetworkSet } from './gcc';
import actionTypes from '../../constants/actions';

export const networkSet = data => dispatch =>
  dispatch(gccNetworkSet(data));

/**
 * Returns required action object to update offline/online status of network
 *
 * @param {Object} data - Active network data
 * @returns {Object} Action object
 */
export const networkStatusUpdated = data => ({
  data,
  type: actionTypes.networkStatusUpdated,
});
