var router = require('koa-router')();
var ctrl = require('../../app/controllers/questionController');

router.post('/addQuestion', ctrl.addQuestion);
router.post('/delQuestion', ctrl.delQuestion);

module.exports = router;