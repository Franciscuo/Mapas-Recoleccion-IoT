const express = require('express');
const router = express.Router();// Igual a la función Roputer para separar por cabeceras metodos de petición
const controller = require('./controller');
const response = require('../../network/response')//Trae network dos carpetas arriba


router.post('/',(req, res) => {
    if(req.body.data){
        const { userName, name, lastName, email, password } = req.body; //Destructuring 
        controller.addUser(userName,name, lastName,email,password)
            .then((info)=>{
                response.success(req, res, info, 201)
            })
            .catch((e)=>{
                response.error(req, res, 'Información Invalida',300,e)
            })  
    }else{
        res.send("ok");
    }
})

router.get('/',(req, res)=>{
    //Aplica Query
    const filterUser = req.query.userName || null;
    controller.getUser(filterUser)
        .then((userList)=>{
            response.success(req,res,userList,200);
        })
        .catch((e)=>{
            response.error(req,res,'Error de Registro', 500, e);
        })
})


module.exports = router;