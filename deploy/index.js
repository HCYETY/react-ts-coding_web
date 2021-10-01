const { scp } = require('scp2');
// const ora = require('ora');
// const pkg = require('chalk'); /** 提示插件 */
// const { red, green } = pkg;
// const server = require('./config.js');

// const spinner = ora('正在发布到' + (process.env.NODE_ENV === 'prod' ? '生产' : '测试') + '服务器...');
// spinner.start();
// scp(
//   'dist/',
//   {
//     host: server.host,
//     port: server.port,
//     username: server.username,
//     password: server.password,
//     path: server.path
//   },
//   function (err) {
//     spinner.stop();
//     if (err) {
//       console.log(red('发布失败.\n'));
//       throw err;
//     } else {
//       console.log(green('Success! 成功发布到' + (process.env.NODE_ENV === 'prod' ? '生产' : '测试') + '服务器! \n'));
//     }
//   }
// );