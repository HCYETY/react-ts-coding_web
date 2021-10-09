const client = require('scp2');
const server = require('./config.js');
const [ , , host, password] = process.argv;
server.host = host;
server.password = password;

client.scp('dist/', {
  port: server.port,
  host: server.host,
  username: server.username,
  password: server.password,
  path: server.path
}, function(err) {
  if (err) {
    console.log('文件上传失败', err)
  } else {
    console.log('文件上传成功');
  }
})