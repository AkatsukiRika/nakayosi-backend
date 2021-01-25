var router = require('koa-router')();
var ctrl = require('../../app/controllers/audioController');

router.post('/checkUpdate', ctrl.checkUpdate);
router.get('/getServerAudioNameList', ctrl.getServerAudioNameList);
router.get('/getAudioStream/:fileName', ctrl.getAudioStream);

module.exports = router;