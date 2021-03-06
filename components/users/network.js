const express = require('express');
const router = express.Router(); // Igual a la función Roputer para separar por cabeceras metodos de petición
const controller = require('./controller');
const response = require('../../network/response') //Trae network dos carpetas arriba
const passport = require('passport');
const Session = require('../../network/auth');
// validación de datos de usuarios
const {
    userIdSchema,
    createUserSchema,
    getUserSchema
  } = require('../../utils/schemas/user');

const validationHandler = require('../../utils/middleware/validationHandler');

//----- Comprueba Paswords----
router.post('/login', passport.authenticate('localSignIn', {
    successReturnToOrRedirect: '/app',
    failureRedirect: '/login',
    passReqToCallback: true,
}));

//actualiza usuario a nodo
router.post('/syncNode', Session.isAuthenticated, (req, res) => {
        const { eui, pass, address, zone, lat, lon} = req.body; //Destructuring
        const user_id = req.user._id;
        controller.syncNode(user_id, eui, pass, address, zone, lat, lon)
            .then((info) => {
                response.success(req, res, info, 200)
            })
            .catch((e) => {
                if(e=='Nodo Ya Registrado'){
                    response.error(req, res, e, 300, e)
                }else{
                    response.error(req, res, 'Información Invalida', 300, e)
                }
            })
    })
    //-------Comprueba User Name
router.post('/username', (req, res) => {
        const user = req.body.user
        controller.isUserName(user)
            .then((info) => {
                response.success(req, res, info, 200)
            })
            .catch((e) => {
                response.error(req, res, 'Error Inesperado', 300, e)
            })
    })
    //--------Comprueba Email
router.post('/email', (req, res) => {
        const email = req.body.email;
        controller.isEmail(email)
            .then((info) => {
                response.success(req, res, info, 200)
            })
            .catch((e) => {
                response.error(req, res, 'Error Inesperado', 300, e)
            })
    })
    //------ Nuevo usuario
router.post('/', validationHandler(createUserSchema), (req, res) => {
        const { userName, name, lastName, email, password, zone, phone } = req.body; //Destructuring
        controller.addUser(userName, name, lastName, email, password, zone, phone)
            .then((info) => {
                response.success(req, res, info, 201)
            })
            .catch((e) => {
                if (e.code === 11000) {
                    response.error(req, res, 'Nombre de Usuario o Correo ya estan registrados', 300, e)
                } else {
                    response.error(req, res, 'Información Invalida', 300, e)
                }
            })
    })
    //-----Obtener los usuarios
router.get('/', validationHandler(getUserSchema, 'query'), (req, res) => {
        //Aplica Query
        const filterUser = req.query || null;
        controller.getUser(filterUser)
            .then((userList) => {
                response.success(req, res, userList, 200);
            })
            .catch((e) => {
                response.error(req, res, 'Error de Registro', 500, e);
            })
    }) //Responde a Peticiones Get

//-----Eliminar los usuarios
router.delete('/:userId', validationHandler({ userId: userIdSchema }, 'params'), (req, res) => {
        controller.deleteUser(req.params.id)
            .then(() => {
                response.success(req, res, `Mensaje ${req.params.id} eliminado`, 200)
            })
            .catch((e) => {
                response.error(req, res, `Error Interno`, 500, e)
            })

    })
    //-----Actualizar los usuarios
router.patch('/',validationHandler(getUserSchema), (req, res) => {
    controller.updateUser(req.body)
        .then((info) => {
            response.success(req, res, info, 201)
        })
        .catch((e) => {
            response.error(req, res, 'Información Invalida', 300, e)
        })
})


module.exports = router;