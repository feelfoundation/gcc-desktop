/* istanbul ignore file */
import { connect } from 'react-redux';
import NetworkSelector from './networkSelector';
import { networkSet } from '../../../../actions/network';
import { settingsUpdated } from '../../../../actions/settings';
import networks from '../../../../constants/networks';
import { tokenMap } from '../../../../constants/tokens';
import { getAPIClient } from '../../../../utils/api/network';

// eslint-disable-next-line complexity
const mapStateToProps = state => ({
  network: state.network,
  selectedNetwork: (state.network.networks.GCC && state.network.networks.GCC.code)
    || networks.mainnet.code,
  address: ((state.network.networks[state.settings.token.active || tokenMap.GCC.key]
    && state.network.networks[state.settings.token.active || tokenMap.GCC.key].nodeUrl)
    || (state.settings.network && state.settings.network.name === networks.customNode.name
      && state.settings.network.address)) || '',
  feelAPIClient: getAPIClient(tokenMap.GCC.key, state.network),
});

const mapDispatchToProps = {
  networkSet,
  settingsUpdated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NetworkSelector);
