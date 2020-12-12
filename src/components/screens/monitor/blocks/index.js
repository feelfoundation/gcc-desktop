/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import Blocks from './blocks';
import feelService from '../../../../utils/api/gcc/feelService';
import withData from '../../../../utils/withData';

const ComposedBlocks = compose(
  withRouter,
  withData({
    blocks: {
      apiUtil: feelService.getLastBlocks,
      defaultData: [],
      autoload: true,
      transformResponse: (response, oldData, urlSearchParams) => (
        urlSearchParams.offset
          ? [...oldData, ...response.data.filter(block =>
            !oldData.find(({ id }) => id === block.id))]
          : response.data
      ),
    },
  }),
  withTranslation(),
)(Blocks);

export default ComposedBlocks;
