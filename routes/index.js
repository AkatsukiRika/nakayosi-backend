const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index')
})

router.get('login', async (ctx, next) => {
  await ctx.render('login')
})

router.get('application', async (ctx, next) => {
  await ctx.render('application')
})

module.exports = router
