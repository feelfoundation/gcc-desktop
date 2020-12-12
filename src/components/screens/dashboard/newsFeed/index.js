// istanbul ignore file
import { withTranslation } from 'react-i18next';
import feelServiceApi from '../../../../utils/api/gcc/feelService';
import withData from '../../../../utils/withData';
import NewsFeed from './newsFeed';

export default withData({
  newsFeed: {
    autoload: false,
    apiUtil: feelServiceApi.getNewsFeed,
    defaultData: [],
  },
})(withTranslation()(NewsFeed));
