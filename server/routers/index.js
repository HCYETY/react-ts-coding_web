const Router = require('koa-router')
const user = require('routers/userRoute')

const router = new Router()
router.use(user.routes())

module.exports = router