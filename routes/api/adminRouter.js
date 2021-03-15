var router = require('koa-router')();
var adminController = require('../../app/controllers/adminController');

router.post('/addAdmin', adminController.addAdmin);
router.post('/delAdmin', adminController.delAdmin);
router.post('/adminLogin', adminController.adminLogin);
router.post('/adminLogout', adminController.adminLogout);
router.get('/getUserLoginStatus', adminController.getUserLoginStatus);
router.get('/getAdminListBg', adminController.getAdminListBg);

module.exports = router;