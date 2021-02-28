var router = require('koa-router')();
var userController = require('../../app/controllers/userController');

router.post('/addProUser', userController.addProUser);
router.post('/setProUserPassword', userController.setProUserPassword);

module.exports = router;