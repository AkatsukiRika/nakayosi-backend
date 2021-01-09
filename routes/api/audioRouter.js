var router = require('koa-router')();
var ctrl = require('../../app/controllers/audioController');

router.post('/checkUpdate', ctrl.checkUpdate);

module.exports = router;