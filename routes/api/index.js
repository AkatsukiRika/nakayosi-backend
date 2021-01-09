var router = require('koa-router')();
var mainRouter = require('./mainRouter');
var audioRouter = require('./audioRouter');

router.use('/main', mainRouter.routes(), mainRouter.allowedMethods());
router.use('/audio', audioRouter.routes(), audioRouter.allowedMethods());

module.exports = router;