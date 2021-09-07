const Router = require('koa-router')
const user = require('./useRoute')

const router = new Router()
router.use(user.routes())

module.exports = router