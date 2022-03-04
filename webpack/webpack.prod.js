const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const devConfig = merge(commonConfig, {
  mode: 'production',
  devtool: 'none',
  stats: {
    timings: true,
    builtAt: true
  },
  plugins: [
    new BundleAnalyzerPlugin({ analyzerPort: 8001 })
  ],
})

module.exports = devConfig;