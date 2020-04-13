const express = require('express');
const router = express.Router();// Igual a la función Roputer para separar por cabeceras metodos de petición
const controller = require('./controller');
const response = require('../../network/response')//Trae network dos carpetas arriba

//--- Guarda Datos de Nodos
router.post('/',(req, res) => {
    if(req.body.data !=undefined){
        const {EUI,data} = req.body;//Obtiene EUI y datos
        controller.addNodeToRoute(EUI,data)
            .then((info) => {
                response.success(req, res, info, 200)//response to LORIOT
            })
            .catch((e) => {
                response.error(req, res, 'Ok', 200, e)//response to LORIOT
            })
    }
})
// --- Actualiza los parametros del algoritmo--
router.patch('/routes', (req, res) => {
    const {zone} = req.body;
    controller.updateRoutes(zone)
        .then((info) => {
            response.success(req, res, info, 200)
        })
        .catch((e) => {
            response.error(req, res, 'Información Invalida', 300, e)
        })
})
// --- New Ruta para Admin
router.post('/routes', (req, res) => {
    const {zone} = req.body;
    controller.newRoute(zone)
        .then((info) => {
            response.success(req, res, info, 200)
        })
        .catch((e) => {
            response.error(req, res, 'Información Invalida', 300, e)
        })
})
//---- Retorna una ruta a usuario
router.get('/routes', (req, res) => {
    controller.getRoutes(req.query)
        .then((info) => {
            response.success(req, res, info, 200)
        })
        .catch((e) => {
            if(e.error){
                if(e.error==="no route"){
                    console.log(e.unassigned);
                    console.log(e.details);
                }
            }
            response.error(req, res, 'Información Invalida', 300, e)
        })
})


module.exports = router;