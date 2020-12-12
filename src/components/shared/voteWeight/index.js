import React from 'react';
import FeelAmount from '../feelAmount';
import { tokenMap } from '../../../constants/tokens';
/**
 * This component acts as an adapter for diversions in consecutive versions of API
 * @param {Object} data The delegate information
 */
const VoteWeight = ({ data }) => (
  <strong>
    <FeelAmount
      val={data.voteWeight}
      token={tokenMap.GCC.key}
      showInt
    />
  </strong>
);

export default VoteWeight;
