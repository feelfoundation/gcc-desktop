import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useSelector } from 'react-redux';
import { DateTimeFromTimestamp } from '../../../toolbox/timestamp';
import { tokenMap } from '../../../../constants/tokens';
import FeelAmount from '../../../shared/feelAmount';
import TransactionTypeFigure from '../../../shared/transactionTypeFigure';
import TransactionAddress from '../../../shared/transactionAddress';
import TransactionAmount from '../../../shared/transactionAmount';
import Spinner from '../../../toolbox/spinner';
import TransactionAsset from './txAsset';
import DialogLink from '../../../toolbox/dialog/link';
import styles from './transactions.css';

// eslint-disable-next-line complexity
const TransactionRow = ({
  data, className, t, host,
}) => {
  const {
    bookmarks,
    activeToken,
  } = useSelector(state => ({
    bookmarks: state.bookmarks,
    activeToken: state.settings.token.active,
  }));
  const isGCC = activeToken === tokenMap.GCC.key;
  const isMobile = document.body.clientWidth < 640;
  const isConfirmed = data.confirmations > 0;
  const { senderId, recipientId } = data;
  const addressRecipientId = host === recipientId ? senderId : recipientId;
  return (
    <DialogLink
      className={`${grid.row} ${className} ${isConfirmed ? '' : styles.pending} transactions-row`}
      component="transactionDetails"
      data={{ transactionId: data.id, token: activeToken }}
    >
      <span className={isMobile ? grid['col-xs-9'] : grid[isGCC ? 'col-xs-4' : 'col-xs-5']}>
        <TransactionTypeFigure
          icon={host === recipientId ? 'incoming' : 'outgoing'}
          address={host === recipientId ? senderId : recipientId}
          transactionType={data.type}
        />
        <span>
          <TransactionAddress
            address={addressRecipientId}
            bookmarks={bookmarks}
            t={t}
            token={activeToken}
            transactionType={data.type}
          />
        </span>
      </span>
      {
        !isMobile
          ? (
            <span className={grid[isGCC ? 'col-xs-2' : 'col-xs-3']}>
              {
                isConfirmed
                  ? (
                    <DateTimeFromTimestamp
                      time={data.timestamp * 1000 + 28800000}
                      token={activeToken}
                    />
                  )
                  : <Spinner completed={isConfirmed} label={t('Pending...')} />
              }
            </span>
          )
          : null
      }
      {
        !isMobile
          ? (
            <span className={grid['col-xs-2']}>
              <FeelAmount val={data.fee} token={activeToken} />
            </span>
          )
          : null
      }
      {
        isGCC && !isMobile
          ? (
            <span className={`${grid['col-xs-2']} ${grid['col-md-2']}`}>
              <TransactionAsset t={t} transaction={data} />
            </span>
          )
          : null
      }
      <span className={isMobile ? grid['col-xs-3'] : grid['col-xs-2']}>
        <TransactionAmount
          host={host}
          token={activeToken}
          showRounded
          sender={senderId}
          recipient={recipientId || data.asset.recipientId}
          type={data.type}
          amount={data.amount || data.asset.amount}
        />
      </span>
    </DialogLink>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  (prevProps.data.id === nextProps.data.id
  && prevProps.data.confirmations === nextProps.data.confirmations);

export default React.memo(TransactionRow, areEqual);
