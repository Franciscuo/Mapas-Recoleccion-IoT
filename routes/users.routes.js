const express = require('express');
var router = express.Router();

const user = require('../controllers/users'); //Trae los controladores de usuarios

router.get('/login', user.login);
router.get('/signup', user.signup);
router.get('/forgot', user.forgot);

router.post('/api/signup', user.apiSignup);
router.post('/api/email', user.email);
router.post('/api/username', user.username);


module.exports = router;