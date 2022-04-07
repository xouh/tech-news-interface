// user 操作相关接口
const router = require('koa-router')()

router.prefix('/imooc')

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
