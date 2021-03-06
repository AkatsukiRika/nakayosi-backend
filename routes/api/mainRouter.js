var router = require('koa-router')();
var mainController = require('../../app/controllers/mainController');

router.get('/getInfo', mainController.getInfo);
router.get('/getResultList', mainController.getResultList);
router.get('/getResultListBg', mainController.getResultListBg);
router.get('/getResultById', mainController.getResultById);

module.exports = router;