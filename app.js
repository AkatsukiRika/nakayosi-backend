const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const cors = require('koa2-cors')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const KoaSession = require('koa-session')
const logUtil = require('./utils/logUtil')

const router = require('koa-router')()
const index = require('./routes/index')
const api = require('./routes/api')
const responseFormatter = require('./middlewares/responseFormatter')
const sessionConfig = require('./config/sessionConfig')

// error handler
onerror(app)

// initialize session
const koaSession = KoaSession(sessionConfig.sessionConfig, app)
app.keys = sessionConfig.sessionSignedKey

// middlewares
app.use(koaSession)
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
router.use('/api', api.routes(), api.allowedMethods())
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app