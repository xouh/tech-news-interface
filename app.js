const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')

const index = require('./routes/index')
const users = require('./routes/users')
const labels = require('./routes/api/label')
const usersapi = require('./routes/api/user')
const article = require('./routes/api/article')

const mongoose = require('mongoose')
const dbConfig = require('./dbs/config')

// connect db
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
})


// error handler
onerror(app)

// 允许跨域
app.use(
  cors({
    credentials: true,
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
  })
)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(labels.routes(), labels.allowedMethods())
app.use(usersapi.routes(), usersapi.allowedMethods())
app.use(article.routes(), article.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
