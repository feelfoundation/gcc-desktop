import React from 'react';
import Table from '../../../../toolbox/table';
import VoteRow from './voteRow';
import header from './tableHeader';

const LatestVotes = ({
  votes, t,
}) => {
  const canLoadMore = votes.meta ? votes.data.length < votes.meta.total : false;

  const handleLoadMore = () => {
    votes.loadData({ offset: votes.data.length });
  };

  return (
    <Table
      data={votes.data}
      isLoading={votes.isLoading}
      row={VoteRow}
      additionalRowProps={{
        t,
      }}
      header={header(t)}
      loadData={handleLoadMore}
      canLoadMore={canLoadMore}
    />
  );
};

export default LatestVotes;
