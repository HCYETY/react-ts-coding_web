// // 连接MySQL数据库
// const mysql = require('mysql')
// const connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '1127',
//   database : 'mysql'
// });
// connection.connect(function(err) {
//   if (err) {
//     return console.error('error: ' + err.message);
//   }
//   console.log('@连接到MySQL数据库。');

//   let sql = `SELECT * FROM mysql`;
//   connection.query(sql, function(err, results, fields) {
//     if (err) {
//       console.log("#", err.message);
//     }
//     console.log("!", results)
//     console.log("$", fields)
//   });
// });



const Koa = require('koa');
const Router = require('./routers/index');
// const Router = require('routers/index');
const app = new Koa(); // 创建 koa应用
// const router = new Router(); // 创建路由，支持传递参数

app.use(Router.routes()); // 启动路由

app.listen(3000, () => {
  console.log('&网站服务器启动成功，请访问 http://localhost:3000')
})
// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });