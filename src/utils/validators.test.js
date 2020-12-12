import { validateAddress, validateGCCPublicKey, validateAmountFormat } from './validators';
import networks from '../constants/networks';
import accounts from '../../test/constants/accounts';
import i18n from '../i18n';

describe('Validate Address', () => {
  it('Should return -1 if empty adress', () => {
    expect(validateAddress('GCC', '', networks.testnet.code)).toBe(-1);
    expect(validateAddress('BTC', '')).toBe(-1);
  });

  it('Should validate GCC address', () => {
    expect(validateAddress('GCC', accounts.genesis.address)).toBe(0);
    expect(validateAddress('GCC', '12345')).toBe(1);
  });

  it('Should validate BTC address', () => {
    expect(validateAddress('BTC', accounts.genesis.address)).toBe(1);
  });
});

describe('Validate Public Key', () => {
  const invalidPublicKey = '35c6b25520fc868b56c83fed6e1nduioasuz9qw84a57f';

  it('Should return 0 if public key is valid', () => {
    expect(validateGCCPublicKey(accounts.genesis.publicKey)).toBe(0);
  });

  it('Should return 1 if public key is invalid', () => {
    expect(validateGCCPublicKey(invalidPublicKey)).toBe(1);
  });
});

describe('Validate Amount Format', () => {
  const errors = {
    INVALID: i18n.t('Provide a correct amount of {{token}}', { token: 'GCC' }),
    FLOATING_POINT: i18n.t('Maximum floating point is 8.'),
  };
  it('Should return errors.INVALID if format is invalid', () => {
    [0.0, '0,0', '0.1.2', '0,', '1..', '1a,1', '2.d2'].forEach((value) => {
      expect(validateAmountFormat({ value })).toEqual({
        error: true,
        message: errors.INVALID,
      });
    });
  });

  it('Should return errors.FLOATING_POINT if has more than 8 digits after floating point', () => {
    expect(validateAmountFormat({ value: '0.123456789' })).toEqual({
      error: true,
      message: errors.FLOATING_POINT,
    });
  });

  it('Should return { error: false, message: "" } if valid amount is inputed', () => {
    expect(validateAmountFormat({ value: '123.43213' })).toEqual({
      error: false,
      message: '',
    });
  });
});
