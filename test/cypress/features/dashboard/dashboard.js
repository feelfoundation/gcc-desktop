/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import accounts from '../../../constants/accounts';

Given(/^I have a bookmark saved$/, function () {
  window.localStorage.setItem('bookmarks', `{"GCC":[{"title":"Alice","address":"${accounts.genesis.address}","balance":101}],"BTC":[]}`);
});
