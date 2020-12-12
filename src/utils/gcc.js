import BigNumber from 'bignumber.js';
import numeral from 'numeral';
import 'numeral/locales';

BigNumber.config({ ERRORS: false });

export const fromRawGCC = value => (
  new BigNumber(value || 0).dividedBy(new BigNumber(10).pow(8)).toFixed()
);

export const toRawGCC = (value) => {
  const amount = numeral(value).value();
  return new BigNumber(amount * new BigNumber(10).pow(8)).decimalPlaces(0).toNumber();
};
