var router = require('koa-router')();
var introController = require('../../app/controllers/introController');

router.get('/getIntro', introController.getIntro);

module.exports = router;