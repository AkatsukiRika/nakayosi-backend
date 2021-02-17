var router = require('koa-router')();
var mainRouter = require('./mainRouter');
var audioRouter = require('./audioRouter');
var questionRouter = require('./questionRouter');

router.use('/main', mainRouter.routes(), mainRouter.allowedMethods());
router.use('/audio', audioRouter.routes(), audioRouter.allowedMethods());
router.use('/question', questionRouter.routes(), questionRouter.allowedMethods());

module.exports = router;