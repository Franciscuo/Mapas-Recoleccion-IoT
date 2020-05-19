const express = require('express');
const passport = require('passport')
const Session = require('../../network/auth');
const router = express.Router(); // Igual a la función Roputer para separar por cabeceras metodos de petición
const controller = require('./controller');
const response = require('../../network/response') //Trae network dos carpetas arriba



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
    //----- Eliminar Nodos ------------------Session.isAuthenticated,
router.delete('/node/:eui', (req, res) => {
    controller.deleteNode(req.params.eui)
        .then((info) => {
            response.success(req, res, info, 201)
        })
        .catch((e) => {
            response.error(req, res, 'Información Invalida', 300, e)
        })
})

// principal
router.get('/', Session.isAuthenticated, (req, res) => {
    if (req.user.role === "admin") {
        res.render('application/admin/ctlAdmin.hbs');
    } else if (req.user.role === "client") {
        res.render('application/client/ctlClient.hbs');
    } else if (req.user.role === "worker") {
        res.render('application/worker/ctlWorker.hbs');
    } else {
        res.render('application/normal/ctlNormal.hbs');
    }
})

// --- Redireciones Admin
//----- New Node-------------
router.get('/viewNewNode', Session.isAuthenticated, (req, res) => {
    //const customersDB = await Customer.find();
    res.render('application/admin/viewAddNode.hbs'); //,{customersDB}
})

// ----  View Zones -----------------
router.get('/viewZones/:zone', Session.isAuthenticated, (req, res) => {
    zone = req.params.zone;
    name = controller.nameZone(zone);
    res.render('application/admin/zone.hbs', { zone, name })
});

//------- Vista de Rotes
router.get('/viewRoutes', Session.isAuthenticated, (req, res) => {
    res.render('application/admin/viewRoutes.hbs')
});

router.get('/configRoutes', Session.isAuthenticated, (req, res) => {
    res.render('application/admin/configRoutes.hbs')
})

// ---- Vista Clients
router.get('/viewClients', Session.isAuthenticated, (req, res) => {
        //const customersDB = await Customer.find();
        res.render('application/admin/viewClients.hbs'); //,{customersDB}
    })
    // ---- Vista Workers
router.get('/viewWorkers', Session.isAuthenticated, (req, res) => {
    //const customersDB = await Customer.find();
    res.render('application/admin/viewWorkers.hbs'); //,{customersDB}
})



//----- Obtener rutas ------------------Session.isAuthenticated,
router.get('/routes', Session.isAuthenticated, (req, res) => {
    res.render('admin/routes.hbs')
});

//----- Añadir rutas ------------------Session.isAuthenticated,
router.post('/routesMap', (req, res) => {
    const zone = 16;
    const nodes = ["5e8e9076a7bee74bf0e1e7e3", "5e8eaac857065825342402f3"];
    controller.addRoute(zone, nodes)
        .then((info) => {
            response.success(req, res, info, 200)
        })
        .catch((e) => {
            response.error(req, res, 'Información Invalida', 300, e)
        })
})



module.exports = router;