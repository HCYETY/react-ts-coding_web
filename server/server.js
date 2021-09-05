const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa(); // 创建koa应用
const router = new Router(); // 创建路由，支持传递参数

// const login = require('./login')
const login = ctx => {
  const {user,pwd} = req.body
}
app.use(router.get('/', login))

app.listen(3000, () => {
  console.log('数据库连接成功，请访问 http://localhost:3000')
})