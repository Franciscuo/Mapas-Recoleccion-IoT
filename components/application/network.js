const express = require('express');
const passport = require('passport')
const Session = require('../../network/auth');
const router = express.Router(); // Igual a la función Roputer para separar por cabeceras metodos de petición
const controller = require('./controller');
const response = require('../../network/response') //Trae network dos carpetas arriba


router.get('/', Session.isAuthenticated, (req, res) => {
    res.render('application/ctlAdmin.hbs');
})

router.post('/api', Session.isAuthenticated, (req, res) => {
        const data = req.body.message;
        if (data === "data") {
            const info = [{
                "type": "LineString",
                "coordinates": [
                    [4.62805, -74.06556],
                    [4.633429, -74.067715]
                ]
            }, {
                "type": "LineString",
                "coordinates": [
                    [4.633429, -74.0677152],
                    [4.630399, -74.067818]
                ]
            }];
            response.success(req, res, info, 201)
        }
    })
    //----- New Node-------------
router.get('/newNode', Session.isAuthenticated, (req, res) => {
        //const customersDB = await Customer.find();
        res.render('application/addNode'); //,{customersDB}
    })
    //----- Add Node --------------------Session.isAuthenticated,
router.post('/node', (req, res) => {
        const { eui, model } = req.body; //Destructuring 
        controller.addNode(eui, model)
            .then((info) => {
                response.success(req, res, info, 201)
            })
            .catch((e) => {
                response.error(req, res, 'Información Invalida', 300, e)
            })
    })
    //----- Obtener Nodos ------------------Session.isAuthenticated,
router.get('/node', (req, res) => {
        const eui = req.query.eui || null;
        controller.getNodes(eui)
            .then((info) => {
                response.success(req, res, info, 200)
            })
            .catch((e) => {
                response.error(req, res, 'Información Invalida', 300, e)
            })
    })
    //----- Obtener Nodos ------------------Session.isAuthenticated,
router.delete('/node/:eui', (req, res) => {
    controller.deleteNode(req.params.eui)
        .then((info) => {
            response.success(req, res, info, 201)
        })
        .catch((e) => {
            response.error(req, res, 'Información Invalida', 300, e)
        })
})
module.exports = router;