const createError = require('http-errors');
var express = require('express');
const path = require('path'); //paquete para arreglar las rutas estaticas
const cookieParser = require('cookie-parser');
const logger = require('morgan'); //logger es igual a morgan
const exphbs = require('express-handlebars');

//-- Inicializacion
const db = require('./database');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);


//--- Settings 
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({ // Se genera un nuevo motor de plantillas
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), //carpeta layouts
    partialsDir: path.join(app.get('views'), 'partials'), // carpeta partils
    extname: '.hbs'
}));
app.set('view engine', '.hbs'); // Se selecciona motor de plantillas


//--- Middlewars
require('./sockets')(io);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//-- Routes ---
app.use(require('./routes/users.routes'));
app.use(require('./routes/aplicacion.routes'));


//---- Static Files--------

app.use(express.static(path.join(__dirname, 'public'))); // Envia rutas publicas


module.exports = { app: app, server: server };