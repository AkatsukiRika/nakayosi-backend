var router = require('koa-router')();
var userController = require('../../app/controllers/userController');

router.post('/addProUser', userController.addProUser);
router.post('/setProUserPassword', userController.setProUserPassword);
router.get('/getProUserListBg', userController.getProUserListBg);

module.exports = router;