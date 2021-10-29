const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default;
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

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
    filename: 'static/js/[name].js',
    globalObject: 'self'
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
    new WebpackDeepScopeAnalysisPlugin(),
    new MonacoWebpackPlugin(['cpp', 'java', 'python', 'javaccript', 'ruby', 'swift', 'go', 'rust', 'php', 'typescript']),
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
      }, {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 
          'css-loader',
          postCssLoaderConfig,
        ]
      }, {
        test: /\.ttf$/,
        use: ['file-loader']
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
      'img': path.resolve(__dirname, '../img'),
      'src': path.resolve(__dirname, '../src'),
      'api': path.resolve(__dirname, '../src/api'),
      'common': path.resolve(__dirname, '../src/common'),
      'pages': path.resolve(__dirname, '../src/pages'),
      'style': path.resolve(__dirname, '../src/style')
    },
  },
};

module.exports = commonConfig;