import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';

import routes from '../../../../constants/routes';
import Network from './networkName';
import styles from './topBar.css';
import Icon from '../../../toolbox/icon';
import DialogLink from '../../../toolbox/dialog/link';
import { settingsUpdated } from '../../../../actions/settings';
// import { PrimaryButton } from '../../../toolbox/buttons';
import { isEmpty } from '../../../../utils/helpers';
import { selectSearchParamValue } from '../../../../utils/searchParams';
import AccountVisual from '../../../toolbox/accountVisual';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import regex from '../../../../utils/regex';
import { tokenMap } from '../../../../constants/tokens';
import Flag from '../../../screens/monitor/network/flag';
import i18n from '../../../../i18n'; // initialized i18next instance

/**
 * Extracts only one search param out of the url that is relevant
 * to the screen shown
 * @param {string} path the url path
 */
const extractRelevantSearchParam = (path) => {
  const relevantRoute = Object.values(routes).find(route => route.path === path);
  if (relevantRoute) {
    return relevantRoute.searchParam;
  }
  return undefined;
};

/**
 * Gets the searched value depending upon the screen the user is on
 * and the url search
 * @param {object} history the history object
 */
const getSearchedText = (history) => {
  const screenName = history.location.pathname;
  const relevantSearchParam = extractRelevantSearchParam(screenName);
  const relevantSearchParamValue = selectSearchParamValue(
    history.location.search, relevantSearchParam,
  );
  return { relevantSearchParam, relevantSearchParamValue };
};

/**
 * Toggles boolean values on store.settings
 *
 * @param {String} setting The key to update in store.settings
 * @param {Array} icons [activeIconName, normalIconName]
 */
const Toggle = ({
  setting, icons,
}) => {
  const dispatch = useDispatch();
  const value = useSelector(state => state.settings[setting]);

  const toggle = () => {
    dispatch(settingsUpdated({ [setting]: !value }));
  };

  return (
    <Icon
      name={value ? icons[0] : icons[1]}
      className={styles.toggle}
      onClick={toggle}
    />
  );
};

const TokenSelector = ({ token, history, t }) => {
  const dispatch = useDispatch();
  const activeToken = useSelector(state => state.settings.token.active);

  const activateToken = () => {
    if (activeToken !== token) {
      dispatch(settingsUpdated({ token: { active: token } }));
      const { location, push } = history;
      if (location.pathname !== routes.wallet.path) {
        push(routes.wallet.path);
      }
    }
  };

  return (
    <Tooltip
      className={styles.tooltipWrapper}
      size="maxContent"
      position="bottom"
      content={(
        <Icon
          name={`${token.toLowerCase()}Icon`}
          className={`${styles.toggle} token-selector-${token} ${activeToken === token ? '' : styles.disabled}`}
          onClick={activateToken}
        />
      )}
    >
      <p>{t(`${token === tokenMap.GCC.key ? 'Feel' : 'Bitcoin'} wallet`)}</p>
    </Tooltip>
  );
};

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.searchInput = null;

    this.onCountdownComplete = this.onCountdownComplete.bind(this);
    this.setChildRef = this.setChildRef.bind(this);
    this.lang = window.localStorage.getItem('lang');
  }

  /* istanbul ignore next */
  onCountdownComplete() {
    this.props.logOut();
    this.props.history.replace(routes.login.path);
  }

  setChildRef(node) {
    this.childRef = node;
  }

  langChange(event) {
    this.lang = event.target.value;
    i18n.changeLanguage(this.lang);
  }

  // eslint-disable-next-line complexity
  render() {
    const {
      t,
      account,
      history,
      network,
      token,
      settings: { discreetMode, sideBarExpanded },
      // resetTimer,
    } = this.props;
    // const isSearchActive = (this.childRef && this.childRef.state.shownDropdown) || false;
    const isUserLogout = isEmpty(account) || account.afterLogout;
    const { relevantSearchParam, relevantSearchParamValue } = getSearchedText(history);

    return (
      <div className={`${styles.wrapper} top-bar`}>
        <div className={styles.group}>
          <Icon
            name="feelLogo"
            className={`${styles.logo} topbar-logo`}
          />
          <Tooltip
            className={`${styles.tooltipWrapper} ${styles.topbarToggle}`}
            size="maxContent"
            position="bottom"
            content={(
              <Toggle
                setting="sideBarExpanded"
                icons={['toggleSidebarActive', 'toggleSidebar']}
              />
            )}
          >
            <p>{t(`${sideBarExpanded ? 'Collapse' : 'Expand'} sidebar`)}</p>
          </Tooltip>
          <Tooltip
            className={styles.tooltipWrapper}
            size="maxContent"
            position="bottom"
            content={(
              <DialogLink component="bookmarks" className={`${styles.toggle} ${styles.toggleBookmark} bookmark-list-toggle`}>
                <Icon name="bookmark" className={styles.bookmarksIcon} />
              </DialogLink>
            )}
          >
            <p>{t('Bookmarks')}</p>
          </Tooltip>
          <Tooltip
            className={styles.tooltipWrapper}
            size="maxContent"
            position="bottom"
            content={(
              <DialogLink component="search" className={`${styles.toggle} ${styles.toggleSearch} search-toggle`}>
                <span className={relevantSearchParam ? `${styles.searchContainer} ${styles.searchContainerParam}` : styles.searchContainer}>
                  <Icon name={relevantSearchParam ? 'search' : 'searchInput'} className="search-icon" />
                  {
                    relevantSearchParam === routes.account.searchParam && relevantSearchParamValue
                      && (
                      <AccountVisual
                        className={styles.accountVisual}
                        size={18}
                        address={relevantSearchParamValue}
                      />
                      )
                  }
                  {relevantSearchParamValue
                    && (
                      <>
                        <div className="hideOnLargeViewPort">
                          <span className={styles.searchedValue}>
                            {relevantSearchParamValue.replace(regex.searchbar, '$1...')}
                          </span>
                        </div>
                        <div className="showOnLargeViewPort">
                          <span className={styles.searchedValue}>
                            {relevantSearchParamValue}
                          </span>
                        </div>
                      </>
                    )}
                </span>
              </DialogLink>
            )}
          >
            <p>{t('Search')}</p>
          </Tooltip>
        </div>
        <div className={styles.group}>
          { !isUserLogout ? <TokenSelector token="GCC" history={history} t={t} /> : null }
          { !isUserLogout && token.list.BTC ? <TokenSelector token="BTC" history={history} t={t} /> : null }
          {
            !isUserLogout ? (
              <Tooltip
                className={styles.tooltipWrapper}
                size="maxContent"
                position="bottom"
                content={(
                  <Toggle
                    setting="discreetMode"
                    icons={['discreetModeActive', 'discreetMode']}
                  />
                )}
              >
                <p>{t(`${discreetMode ? 'Disable' : 'Enable'} discreet mode`)}</p>
              </Tooltip>
            ) : null
          }
          <Network
            token={token.active}
            network={network}
            t={t}
          />
          <div className={styles.toplang}>
            <select
              className={styles.toplangselect}
              value={this.lang}
              onChange={(e) => { this.langChange(e); }}
            >
              <option value="en">EN</option>
              <option value="cn">中文</option>
            </select>
            <div className={styles.toplangflag}>
              <span onClick={() => i18n.changeLanguage('cn')}><Flag code="CN" /></span>
              <span onClick={() => i18n.changeLanguage('en')}><Flag code="US" /></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TopBar;
