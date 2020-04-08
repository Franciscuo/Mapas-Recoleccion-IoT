const express = require('express');
const passport = require('passport')
const Session = require('../../network/auth');
const router = express.Router();// Igual a la función Roputer para separar por cabeceras metodos de petición
const controller = require('./controller');
const response = require('../../network/response')//Trae network dos carpetas arriba

router.get('/', Session.isAuthenticated, (req, res) => {
    res.render('application/control.hbs');
})
router.post('/api', Session.isAuthenticated, (req, res) => {
    const data = req.body.message;
    if(data==="data"){
        const info = [{
            "type": "LineString",
                "coordinates": [[4.62805, -74.06556], [4.633429, -74.067715]]
            }, {
                "type": "LineString",
                "coordinates": [[4.633429, -74.0677152], [4.630399, -74.067818]]
            }];
        response.success(req, res, info, 201)
    }
})
//----- New Node-------------
router.get('/newNode', Session.isAuthenticated,  (req, res) =>{
    //const customersDB = await Customer.find();
    res.render('application/addNode');//,{customersDB}
})
//----- Add Node --------------------
router.post('/addNode',Session.isAuthenticated,(req,res)=>{
    const { eui, model, customer_id } = req.body; //Destructuring 
    controller.addNode(eui, model, customer_id)
        .then((info)=>{
            response.success(req, res, info, 201)
        })
        .catch((e)=>{
            response.error(req, res, 'Información Invalida',300,e)
        })  
})
//----- Obtener Nodos ------------------
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
//----- Añadir Cliente -----------------
router.get('/newCustomer', Session.isAuthenticated,(req,res)=>{
    res.render('application/addCustomer.hbs')
})
//----- Añadir Cliente --------------------
router.post('/addCustomer',Session.isAuthenticated,(req,res)=>{
    const {address, latitude, longitude, name, email, phone,node} = req.body; //Destructuring 
    controller.addCustomer(address, latitude, longitude, name, email, phone,node)
        .then((info)=>{
            response.success(req, res, info, 201)
        })
        .catch((e)=>{
            response.error(req, res, 'Información Invalida',300,e)
        })  
})
//----- Obtener Cliente ------------------

router.get('/getCustomer', Session.isAuthenticated, (req, res) => {
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