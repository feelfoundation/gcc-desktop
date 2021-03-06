import numeral from 'numeral';
import 'numeral/locales';
import i18n from '../i18n';

export const formatAmountBasedOnLocale = ({
  value,
  format = '0,0.[0000000000000000]',
}) => {
  if (i18n.language === 'cn') {
    numeral.locale('en');
  } else {
    numeral.locale(i18n.language);
  }
  const amount = parseFloat(value);
  return numeral(amount).format(format);
};

export default {
  formatAmountBasedOnLocale,
};
