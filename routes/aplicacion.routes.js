const express = require('express');
var router = express.Router();

const appCtrl = require('../controllers/aplicacion');
const Session = require('./Auth');

router.get('/', appCtrl.index);

router.get('/control', Session.isAuthenticaded, appCtrl.control);
router.get('/addNode', Session.isAuthenticaded, appCtrl.addNode);
router.get('/addCUstomer', Session.isAuthenticaded,appCtrl.addCustomer);

router.post('/write', appCtrl.loriot);

router.post('/api/addNode', Session.isAuthenticaded, appCtrl.apiAddNode);
router.post('/api/addCustomer', Session.isAuthenticaded, appCtrl.apiAddCustomer);

module.exports = router;