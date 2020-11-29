var router = require('koa-router')();
var mainRouter = require('./mainRouter');

router.use('/main', mainRouter.routes(), mainRouter.allowedMethods());

module.exports = router;