/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import Delegates from './delegates';
import feelService from '../../../../utils/api/gcc/feelService';
import withData from '../../../../utils/withData';
import withFilters from '../../../../utils/withFilters';
import withLocalSort from '../../../../utils/withLocalSort';

const defaultUrlSearchParams = { search: '' };
const delegatesKey = 'delegates';
const standByDelegatesKey = 'standByDelegates';

const transformDelegatesResponse = (response, oldData = []) => (
  [...oldData, ...response.data.filter(
    delegate => !oldData.find(({ username }) => username === delegate.username),
  )]
);

const transformVotesResponse = (response, oldData = []) => (
  [...oldData, ...response.data.filter(
    vote => !oldData.find(({ id }) => id === vote.id),
  )]
);

/**
 * This function is to iterate over the list of delegates and GROUP BY
 * timestamp (Month and Year) and count how many users registered as
 * delegate in the month
 */
const transformChartResponse = (response) => {
  const responseFormatted = response.data.reduce((acc, delegate) => {
    const newDelegate = { ...delegate, timestamp: moment((delegate.timestamp * 1000 + new Date(2020, 9, 18, 18, 0, 0, 0).getTime())).startOf('month').toISOString() };
    return {
      ...acc,
      [newDelegate.timestamp]: ((acc[newDelegate.timestamp] || 0) + 1),
    };
  }, {});

  return Object.entries(responseFormatted)
    .map(delegate => ({ x: delegate[0], y: delegate[1] }))
    .sort((dateA, dateB) => (dateB.x > dateA.x ? -1 : 1))
    .slice(-4)
    .map(delegate => ({ ...delegate, x: moment(delegate.x).format('MMM YY') }));
};

const ComposedDelegates = compose(
  withRouter,
  withData(
    {
      [delegatesKey]: {
        apiUtil: feelService.getActiveDelegates,
        defaultData: [],
        autoload: true,
        transformResponse: transformDelegatesResponse,
      },

      [standByDelegatesKey]: {
        apiUtil: feelService.getStandbyDelegates,
        defaultData: [],
        autoload: true,
        transformResponse: transformDelegatesResponse,
      },

      chartActiveAndStandbyData: {
        apiUtil: feelService.getActiveAndStandByDelegates,
        defaultData: [],
        autoload: true,
        transformResponse: response => response.data.length + 101,
      },

      chartRegisteredDelegatesData: {
        apiUtil: feelService.getRegisteredDelegates,
        defaultData: [],
        autoload: true,
        transformResponse: transformChartResponse,
      },

      votes: {
        apiUtil: feelService.getLatestVotes,
        autoload: true,
        defaultData: [],
        transformResponse: transformVotesResponse,
      },

      networkStatus: {
        apiUtil: feelService.getNetworkStatus,
        defaultData: {},
        autoload: true,
        transformResponse: response => response,
      },
    },
  ),
  withFilters(standByDelegatesKey, defaultUrlSearchParams),
  withLocalSort(delegatesKey, 'rank:asc'),
  withTranslation(),
)(Delegates);

export default ComposedDelegates;
