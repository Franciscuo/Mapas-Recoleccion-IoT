const express = require('express');
const app = express();
const passport = require('passport'); //passport tiene muchas formas de autenticacion(vienen por separado)
const localStrategy = require('passport-local').Strategy; //strategias = metodos de autenticacion (para este caso metodo loca)

const User = require('../models/user'); //Se trae el modelo de usuario porque para autenticarse (signin y sigup) se necesita la base de datos





//------------- Cookies ---------------
passport.serializeUser((user, done) => { //El servidor recibo el usuario actual y lo serializa
    done(null, user.id); //El servidor guarda el id del usuario actual en la cookie del navegador
});

passport.deserializeUser(async(id, done) => { //El servidos recibe la cookie del navegador y obtiene la informacion previamente serializada
    const user = await User.findById(id); // El servidor busca si la id de la cookie existe y su usuario 
    done(null, user); // Se regresa el usuario a passport
});

//-------------------------------------





//se le da un nombre a nuestro metodo de autenticacion
//Recibe un objeto que indica que datos recibe del cliente, ademas tiene un callback
passport.use('local-signup', new localStrategy({

    usernameField: 'email', //username le dice a traves de que dato se autentica el usuario
    passwordField: 'password',
    passReqToCallback: true, // permite recibir mas cosas que solo el email
}, async(req, email, password, done) => {

    const user = await User.findOne({ email: email });
    const _user = await User.findOne({ user: req.body.user.toLowerCase() });
    if (user) {
        req.flash('error_msg', 'El correo ya esta en uso');
        return done(null, false);
    }
    if (_user) {
        req.flash('error_msg', 'El usuario ya esta en uso');
        return done(null, false);
    }
    if (req.body.confirmPassword !== password) {
        req.flash('error_msg', 'Las contraseñas no coinciden');
        return done(null, false);
    } else {
        const avatarNumber = Math.floor(Math.random() * (9 - 1)) + 1;
        const newUser = new User();
        newUser.email = email;
        newUser.password = await newUser.encryptPassword(password);
        newUser.lastName = req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1);
        newUser.name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1);
        newUser.user = req.body.user.toLowerCase();;
        newUser.avatar = '/img/avatar/' + avatarNumber + '.jpg';

        newUser.description = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1) + ' aún no escribe información en su perfil';

        await newUser.save((err) => { //guarda el esquema creado
            if (err) {
                req.flash('error_msg', 'Error al guardar registro', err);
            }
        });
        req.flash('success_msg', 'Registro realizado');
        return done(null, newUser); //Callback termina el registro, (error = null, usuario)
    }


}));

//passport.use('local-signin', new localStrategy({}, ()=>{})); 
// recibe un objeto y tiene un callback
passport.use('local-signin', new localStrategy({
    usernameField: 'email', //username le dice a traves de que dato se autentica el usuario
    passwordField: 'password',
    passReqToCallback: true, // permite recibir mas cosas que solo el email
}, async(req, email, password, done) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        req.flash('error_msg', 'Usuario no encontrado');
        return done(null, false);
    }
    const pass = await user.matchPassword(password);
    if (!pass) {
        req.flash('error_msg', 'Contraseña incorrecta');
        return done(null, false);
    }
    return done(null, user);

}));