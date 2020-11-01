const router = require('express').Router();

const {dummyContoller} = require('../controller/auth-controller');


router.get('/dum', dummyContoller);


module.exports = router;