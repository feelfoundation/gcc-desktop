/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import BlocksOverview from './blocksOverview';
import feelService from '../../../../../utils/api/gcc/feelService';
import withData from '../../../../../utils/withData';

export default compose(
  withRouter,
  withData({
    blocks: {
      apiUtil: feelService.getLastBlocks,
      transformResponse: response => response.data,
      defaultUrlSearchParams: { limit: '10' },
      defaultData: [],
      autoload: true,
    },
  }),
)(BlocksOverview);
