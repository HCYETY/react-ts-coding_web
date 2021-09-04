const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const commonConfig = require('./webpack.common.js');

const devConfig = merge(commonConfig, {
  mode: 'development',
  devtool: "cheap-module-eval-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    progress: true,
    historyApiFallback: true
  }
})

module.exports = devConfig;
