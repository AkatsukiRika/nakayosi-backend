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

router.get('question', async (ctx, next) => {
  await ctx.render('question')
})

module.exports = router
