/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = merge(baseConfig, {
  entry: {
    main: ['babel-polyfill', `${resolve(__dirname, '../app/src')}/main.js`],
  },
  output: {
    path: resolve(__dirname, '../app/build'),
    filename: 'main.js',
  },
  target: 'electron-main',
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /node_modules[/\\](iconv-lite)[/\\].+/,
        resolve: {
          aliasFields: ['main'],
        },
      },
    ],
  },
});
