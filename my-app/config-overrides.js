// const { override, fixBabelImports } = require('customize-cra');
//      module.exports = override(
//        fixBabelImports('import', {
//          libraryName: 'antd',
//          libraryDirectory: 'es',
//          style: 'css',
//        }),
//      );


// const {injectBabelPlugin} = require('react-app-rewired');
// module.exports = function override(config, env) {
//   config = injectBabelPlugin(['import', {libraryName: 'antd', style: 'css'}], config);
//   return config;
// };

const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: { '@primary-color': '#1DA57A' },
    },
  }),
  
);