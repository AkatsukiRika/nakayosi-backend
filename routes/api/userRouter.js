var router = require('koa-router')();
var userController = require('../../app/controllers/userController');

router.post('/addProUser', userController.addProUser);
router.post('/setProUserPassword', userController.setProUserPassword);
router.get('/getProUserListBg', userController.getProUserListBg);
router.post('/sendResultEmail', userController.sendResultEmail);
router.post('/delProUser', userController.delProUser);
router.post('/userLogin', userController.userLogin);
router.get('/getUserLoginStatus', userController.getUserLoginStatus);
router.post('/proUserLogout', userController.proUserLogout);

module.exports = router;