require('dotenv').config(); //configuracion de variables de entorno
const express = require('express');
const path = require('path'); //paquete para arreglar las rutas estaticas
const logger = require('morgan'); //logger es igual a morgan
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');


//-- Inicializacion
const router = require('./network/routes'); //archivo de rutas
const database = require('./db'); // requiere bases de datos
const app = express();
require('./config/passport') //Se trae el archivo con la autenticacion de usuarios (este trae modelo base de datos de usuario)

var server = require('http').Server(app);


//--- Settings 
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({ // Se genera un nuevo motor de plantillas
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), //carpeta layouts
    partialsDir: path.join(app.get('views'), 'partials'), // carpeta partils
    extname: '.hbs',
    helpers: require('./helpers')
}));
app.set('view engine', '.hbs'); // Se selecciona motor de plantillas


//--- Middlewars
database();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//---- Static Files--------
app.use('/static', express.static(path.join(__dirname, 'public'))); // Envia rutas publicas

//---- Cookie---
app.use(session({ // Manejo del servidor de las cookies
    secret: '3gsb2os82bwsk', // string para serializar/deserializar las cookies
    resave: true,
    saveUninitialized: true,
}));

//-----Passport-----
app.use(passport.initialize()); //Arranca passport configura cookies
app.use(passport.session()); //Ejecuta proceso de lectura/escritura de cookie } --//

//----Global variables (Middleware propio)
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    if (req.user) res.locals.role = req.user.role || null;
    next();
});

//-- Routes ---
router(app); // le pasamos nuestras rutas al archivo network/routes.js

module.exports = { app: app, server: server };