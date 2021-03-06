import PropTypes from 'prop-types';
import React from 'react';
import FeelAmount from '../feelAmount';
import DiscreetMode from '../discreetMode';
import styles from './transactionAmount.css';
import transactionTypes from '../../../constants/transactionTypes';

const TransactionAmount = ({
  sender, recipient, type, token, showRounded, showInt, host, amount,
}) => {
  const isIncoming = host === recipient && sender !== recipient;
  return (
    <div className={`${styles.wrapper} transaction-amount`}>
      { type === transactionTypes().transfer.code
        ? (
          <DiscreetMode shouldEvaluateForOtherAccounts>
            <span className={isIncoming ? styles.receive : ''}>
              {isIncoming ? '' : '- '}
              <FeelAmount
                val={amount}
                showRounded={showRounded}
                showInt={showInt}
                token={token}
              />
            </span>
          </DiscreetMode>
        )
        : '-'
      }
    </div>
  );
};

TransactionAmount.propTypes = {
  host: PropTypes.string,
  sender: PropTypes.string.isRequired,
  recipient: PropTypes.string,
  token: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  amount: PropTypes.string,
  showInt: PropTypes.bool,
  showRounded: PropTypes.bool,
};

export default TransactionAmount;
