var router = require('koa-router')();
var mainRouter = require('./mainRouter');
var audioRouter = require('./audioRouter');
var questionRouter = require('./questionRouter');
var userRouter = require('./userRouter');

router.use('/main', mainRouter.routes(), mainRouter.allowedMethods());
router.use('/audio', audioRouter.routes(), audioRouter.allowedMethods());
router.use('/question', questionRouter.routes(), questionRouter.allowedMethods());
router.use('/user', userRouter.routes(), userRouter.allowedMethods());

module.exports = router;