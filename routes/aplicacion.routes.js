const express = require('express');
var router = express.Router();

const appCtrl = require('../controllers/aplicacion');

router.get('/', appCtrl.index);


module.exports = router;