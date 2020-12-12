import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DateTimeFromTimestamp } from '../../toolbox/timestamp';
import { tokenMap } from '../../../constants/tokens';
import transactionTypes from '../../../constants/transactionTypes';
import AccountVisualWithAddress from '../accountVisualWithAddress';
import Icon from '../../toolbox/icon';
import FeelAmount from '../feelAmount';
import Tooltip from '../../toolbox/tooltip/tooltip';
import DialogLink from '../../toolbox/dialog/link';
import styles from './transactionsTable.css';

const roundSize = 101;

const TransactionRow = ({ data, className, t }) => (
  <DialogLink
    className={`${grid.row} ${className}`}
    component="transactionDetails"
    data={{ transactionId: data.id, token: 'GCC' }}
  >
    <span className={grid['col-xs-3']}>
      <AccountVisualWithAddress
        address={data.senderId}
        transactionSubject="senderId"
        transactionType={data.type}
        showBookmarkedAddress
      />
    </span>
    <span className={grid['col-xs-3']}>
      <AccountVisualWithAddress
        address={data.recipientId}
        transactionSubject="recipientId"
        transactionType={data.type}
        showBookmarkedAddress
      />
    </span>
    <span className={grid['col-xs-2']}>
      <DateTimeFromTimestamp time={data.timestamp * 1000} token={tokenMap.GCC.key} />
    </span>
    <span className={`${grid['col-xs-3']} ${grid['col-md-2']} ${styles.amount}`}>
      <FeelAmount val={data.amount} token={tokenMap.GCC.key} />
      <span className={`${styles.fee} hideOnLargeViewPort`}><FeelAmount val={data.fee} token={tokenMap.GCC.key} /></span>
    </span>
    <span className={`${grid['col-md-1']} ${styles.transactionFeeCell}`}>
      <Tooltip
        title={t('Transaction')}
        position="bottom"
        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
        content={<FeelAmount val={data.fee} token={tokenMap.GCC.key} />}
        size="s"
      >
        <p>{`${data.type} - ${transactionTypes.getByCode(data.numberOfTransactions).title}`}</p>
      </Tooltip>
    </span>
    <span className={grid['col-xs-1']}>
      <Tooltip
        title={data.confirmations > roundSize ? t('Confirmed') : t('Pending')}
        position="left"
        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
        content={<Icon name={data.confirmations > roundSize ? 'approved' : 'pending'} />}
        size="s"
      >
        <p>{`${data.confirmations}/${roundSize} ${t('Confirmations')}`}</p>
      </Tooltip>
    </span>
  </DialogLink>
);

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  (prevProps.data.id === nextProps.data.id
  && prevProps.data.confirmations === nextProps.data.confirmations);

export default React.memo(TransactionRow, areEqual);
