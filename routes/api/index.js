var router = require('koa-router')();
var introRouter = require('./introRouter');

router.use('/intro', introRouter.routes(), introRouter.allowedMethods());

module.exports = router;