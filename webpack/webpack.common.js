const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default;

const postCssLoaderConfig = {
  loader: 'postcss-loader',
  options: {
    plugins: [
      require('autoprefixer')({
        overrideBrowserslist: [
          'Chrome > 31',
          'ff > 31',
          'ie >= 10'
        ]
      })
    ]
  }
};

const commonConfig = {
  entry: [
    'babel-polyfill',
    './src/index.tsx'
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      filename: 'index.html'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[hash].css",
    }),
    new WebpackDeepScopeAnalysisPlugin()
  ],
  module: {
    rules: [{
        test: /\.(jsx?|tsx?)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          plugins: [
            ["import", {
              libraryName: "antd",
              style: "css"
            }]
          ]
        }
      }, {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', postCssLoaderConfig]
      }, {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', postCssLoaderConfig, 'less-loader']
      }, {
        test: /.*\.(gif|png|svg|jpe?g)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 5120,
            name: 'static/imgs/[name].[hash:8].[ext]',
            publicPath: '../../'
          }
        }]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vender: {
          chunks: 'all',
          name: 'vender',
          test: (module) => {
            return /[\\/]node_modules[\\/](lodash|moment|react|react-dom|react-router|react-router-dom|axios|antd)/.test(module.context);
          },
          priority: 10,
        },
      }
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFiles: ['index.tsx', 'index.ts', 'index'],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'img': path.resolve(__dirname, '../img'),
      'pages': path.resolve(__dirname, '../src/pages'),
      'api': path.resolve(__dirname, '../src/api'),
    },
  },
};

module.exports = commonConfig;