/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import BlockDetails from './blockDetails';
import feelService from '../../../../utils/api/gcc/feelService';
import withData from '../../../../utils/withData';
import { selectSearchParamValue } from '../../../../utils/searchParams';

const mapStateToProps = (state, ownProps) => ({
  id: selectSearchParamValue(ownProps.history.location.search, 'id'),
});
const ComposedBlockDetails = compose(
  withRouter,
  connect(mapStateToProps),
  withData({
    blockDetails: {
      apiUtil: feelService.getBlockDetails,
      getApiParams: (state, ownProps) => ({ id: ownProps.id }),
      transformResponse: response => (response.data && response.data[0]),
    },
    blockTransactions: {
      apiUtil: feelService.getBlockTransactions,
      defaultData: [],
      getApiParams: (state, ownProps) => ({ id: ownProps.id }),
      transformResponse: (response, oldData, urlSearchParams) => (
        urlSearchParams.offset
          ? [...oldData, ...response.data.filter(block =>
            !oldData.find(({ id }) => id === block.id))]
          : response.data
      ),
    },
  }),
  withTranslation(),
)(BlockDetails);

export default ComposedBlockDetails;
