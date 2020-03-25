const express = require('express');
const user = require('../components/users/network')
const main = require('../components/main/network')
const appCtrl = require('../components/application/');
const routes = (server)=>{
    server.use('/app',appCtrl)
    server.use('/user',user)//redirigue routas al controlador message/network
    server.use('/',main)//rutas normales
} 

module.exports = routes