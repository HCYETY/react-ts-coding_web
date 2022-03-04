const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default;
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

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
    // new MonacoWebpackPlugin(['cpp', 'java', 'python', 'javascript', 'ruby', 'swift', 'go', 'rust', 'php', 'typescript']),
    new MonacoWebpackPlugin(['apex', 'azcli', 'bat', 'clojure', 'coffee', 'cpp', 'csharp', 'csp', 'css', 'dockerfile', 'fsharp', 'go', 'handlebars', 'html', 'ini', 'java', 'javascript', 'json', 'less', 'lua', 'markdown', 'msdax', 'mysql', 'objective', 'perl', 'pgsql', 'php', 'postiats', 'powerquery', 'powershell', 'pug', 'python', 'r', 'razor', 'redis', 'redshift', 'ruby', 'rust', 'sb', 'scheme', 'scss', 'shell', 'solidity', 'sql', 'st', 'swift', 'typescript', 'vb', 'xml', 'yaml'])
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
    // minimize: true,
    // minimizer: [
    //   new TerserPlugin({
    //     parallel: 4, // 开启几个进程来处理压缩，默认是 os.cpus().length - 1
    //   }),
    //   new OptimizeCSSAssetsPlugin({
    //     cssProcessor: require("cssnano"), //引⼊cssnano配置压缩选项
    //     cssProcessorOptions: {
    //       discardComments: { removeAll: true }
    //     }
    //   }),
    //   // new OptimizeCSSAssetsPlugin({
    //   //   assetNameRegExp: /\.optimize\.css$/g,
    //   //   cssProcessor: require('cssnano'),
    //   //   cssProcessorPluginOptions: {
    //   //     preset: ['default', { discardComments: { removeAll: true } }],
    //   //   },
    //   //   canPrint: true,
    //   // })
    // ],
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
      'style': path.resolve(__dirname, '../src/style'),
      'useRedux': path.resolve(__dirname, '../src/useRedux')
    },
  },
};

module.exports = commonConfig;