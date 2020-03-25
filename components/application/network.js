const express = require('express');
const passport = require('passport')
const Session = require('../../network/auth');
const router = express.Router();// Igual a la función Roputer para separar por cabeceras metodos de petición
const controller = require('./controller');
const response = require('../../network/response')//Trae network dos carpetas arriba

router.get('/', Session.isAuthenticated, (req, res) => {
    res.render('application/control.hbs');
})

router.post('/addNode',Session.isAuthenticated,(req,res)=>{
    const { eui, model, customer_id } = req.body; //Destructuring 
    controller.addUser(eui, model, customer_id)
        .then((info)=>{
            response.success(req, res, info, 201)
        })
        .catch((e)=>{
            response.error(req, res, 'Información Invalida',300,e)
        })  
})

router.get('/getNode', Session.isAuthenticated, (req, res) => {
    const filter = req.query.EUI || null;
    controller.getUser(filter)
        .then((nodeList)=>{
            res.render('application/addNode',{nodeList})
        })
        .catch((e)=>{
            res.render('error.hbs')
        })
})


module.exports = router;