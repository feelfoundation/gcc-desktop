import i18next from 'i18next';
import settings from '../constants/settings';
import networks from '../constants/networks';

// https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
const pattern = new RegExp(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/gi);

const isValidUrlRegEx = urlStr => pattern.test(urlStr);

const isValidLocalhost = url => url.hostname === 'localhost' && url.port.length > 1;
const isValidRemote = url => /(([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3})/.test(url.hostname);

const isValidIp = url => (isValidLocalhost(url)
|| isValidRemote(url)
|| isValidUrlRegEx(url.toString()));

export const addHttp = (url) => {
  const reg = /^(?:f|ht)tps?:\/\//i;
  return reg.test(url) ? url : `http://${url}`;
};
// eslint-disable-next-line import/prefer-default-export
export const validateUrl = (value) => {
  let url;
  let addressValidity = '';
  const errorMessage = i18next.t('Please check the address');
  try {
    url = new URL(addHttp(value));
    addressValidity = value.indexOf(' ') === -1 && isValidIp(url) ? '' : errorMessage;
  } catch (e) {
    addressValidity = errorMessage;
  }

  return { address: value, addressValidity };
};

// Ignore coverage because this is only development feature
export const getAutoLogInData = /* istanbul ignore next */ () => ({
  [settings.keys.loginKey]: localStorage.getItem(settings.keys.loginKey),
  [settings.keys.feelCoreUrl]: localStorage.getItem(settings.keys.feelCoreUrl),
});

// Ignore coverage because this is only development feature
export const shouldAutoLogIn = /* istanbul ignore next */ autologin =>
  autologin[settings.keys.feelCoreUrl] && autologin[settings.keys.feelCoreUrl] !== ''
    && autologin[settings.keys.loginKey] && autologin[settings.keys.loginKey] !== '';

export const findMatchingLoginNetwork = () => {
  const { feelCoreUrl } = getAutoLogInData();
  return Object.entries(networks).find((network) => {
    const { nodes } = network.slice(-1).shift();
    return Array.isArray(nodes) ? nodes.includes(feelCoreUrl) : false;
  });
};
