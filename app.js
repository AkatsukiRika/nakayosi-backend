const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const cors = require('koa2-cors')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const logUtil = require('./utils/logUtil')

const index = require('./routes/index')
const users = require('./routes/users')
const api = require('./routes/api')
const responseFormatter = require('./middlewares/responseFormatter')
const router = require('./routes/index')

// error handler
onerror(app)

// middlewares
app.use(cors())
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
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
  var ms
  try {
    await next()
    ms = new Date() - start
    logUtil.logResponse(ctx, ms)
  } catch (error) {
    ms = new Date() - start
    logUtil.logError(ctx, error, ms)
  }
})

// response formatter
app.use(responseFormatter('^/api'));

// routes
router.use('/', index.routes(), index.allowedMethods())
router.use('/users', users.routes(), users.allowedMethods())
router.use('/api', api.routes(), api.allowedMethods())
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app