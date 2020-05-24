const express = require('express');
const router = express.Router(); // Igual a la función Roputer para separar por cabeceras metodos de petición
const controller = require('./controller');
const response = require('../../network/response') //Trae network dos carpetas arriba

router.get('/', (req, res) => {
    controller.getZones(req.query)
        .then((info) => {
            response.success(req, res, info, 200);
        })
        .catch((e) => {
            response.error(req, res, 'Error', 400, e);
        })
})

router.patch('/', (req, res) => {
    const { numberZone, start, end, capacity } = req.body;
    controller.updateZone(numberZone, start, end, capacity)
        .then((info) => {
            response.success(req, res, info, 200);
        })
        .catch((e) => {
            response.error(req, res, 'Error', 400, e);
        })
})

router.post('/', (req, res) => {
    const { number, name, start, end, capacity } = req.body;
    controller.addZone(number, name, start, end, capacity)
        .then((info) => {
            response.success(req, res, info, 200);
        })
        .catch((e) => {
            response.error(req, res, 'Error', 400, e);
        })
})


module.exports = router;