const express = require('express');
var router = express.Router();

//---- Inicializar---

/* GET home page. */
router.get('/', function(req, res, next) {//req lo que trae la pagina, res lo que envia
  res.render('index.hbs');
});

module.exports = router;
