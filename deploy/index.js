import { scp } from 'scp2';
import ora from 'ora';
import pkg from 'chalk'; /** 提示插件 */
const { red, green } = pkg;
import server from './config.js';

const spinner = ora('正在发布到' + (process.env.NODE_ENV === 'prod' ? '生产' : '测试') + '服务器...');
spinner.start();
scp(
  'dist/',
  {
    host: server.host,
    port: server.port,
    username: server.username,
    password: server.password,
    path: server.path
  },
  function (err) {
    spinner.stop();
    if (err) {
      console.log(red('发布失败.\n'));
      throw err;
    } else {
      console.log(green('Success! 成功发布到' + (process.env.NODE_ENV === 'prod' ? '生产' : '测试') + '服务器! \n'));
    }
  }
);