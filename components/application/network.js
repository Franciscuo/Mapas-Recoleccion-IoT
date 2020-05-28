const express = require('express');
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
        const query = req.query || null;
        controller.getNodes(query)
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
        res.render('application/admin/ctlAdmin.hbs',{
            user: req.user,
            name: req.user.name,
        });
    } else if (req.user.role === "client") {
        res.render('application/client/ctlClient.hbs',{
            user: req.user,
            name: req.user.name,
        });
    } else if (req.user.role === "worker") {
        res.render('application/worker/ctlWorker.hbs',{
            user: req.user,
            name: req.user.name,
        });
    } else {//req.user.role === "none"
        res.render('application/none/ctlNone.hbs',{
            user: req.user,
            name: req.user.name,
        });
    }
})

// --- Redireciones Admin
//----- New Node-------------
router.get('/viewNewNode', Session.isAuthenticated, (req, res) => {
    if (req.user.role === "admin") {
        res.render('application/admin/viewAddNode.hbs'); //,{customersDB}
    }else if(req.user.role === "client"){
        res.render('application/client/viewAddNode.hbs'); //,{customersDB}
    }else if(req.user.role === "none"){
        res.render('application/none/viewAddNode.hbs'); //,{customersDB}
    }
})

//------- Vista de Rutas
router.get('/viewRoutes', Session.isAuthenticated, (req, res) => {
    if (req.user.role === "admin") {
        res.render('application/admin/viewRoutes.hbs')
    }else if(req.user.role === "client"){
        res.render('application/client/viewRoutes.hbs')
    }
});

// ----  View Zones -----------------
router.get('/viewZones/:zone', Session.isAuthenticated, (req, res) => {
    const zone = req.params.zone;
    const name = controller.nameZone(zone);
    res.render('application/admin/zone.hbs', { zone, name })
});
// ----- View Config Routes ----
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
    res.render('application/admin/viewWorkers.hbs'); //,{customersDB}
})

    // ---- Registro Trabajadores
    router.get('/newWorker', Session.isAuthenticated, (req, res) => {
        res.render('application/admin/viewAddWorker.hbs'); //,{customersDB}
    })


module.exports = router;