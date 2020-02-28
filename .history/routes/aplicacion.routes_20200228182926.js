const express = require('express');
var router = express.Router();

const appCtrl = require('../controllers/aplicacion');
const Session = require('./Auth');

router.get('/', Session.isAuthenticaded, appCtrl.index);
router.post('/api/ruta/wirte', appCtrl.loriot);

module.exports = router;