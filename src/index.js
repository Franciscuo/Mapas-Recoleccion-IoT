const express = require('express');
const morgan = require('morgan');
const path = require('path');

const compression = require('compression');
const exphbs = require('express-handlebars');


const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash'); //añade al req un parametro flash


const multer = require('multer');
const moment = require('moment');



////// Initializations
const app = express();
app.use(compression());
moment.locale('es');
app.use(morgan('dev'));
require('./database');
require('./config/passport') //Se trae el archivo con la autenticacion de usuarios (este trae modelo base de datos de usuario)




///// Settings 
app.set('AppName', 'Unal');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({ // Se genera un nuevo motor de plantillas
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./helpers')
}));
app.set('view engine', '.hbs'); // Se selecciona motor de plantillas








///// MiddleWares
app.use(multer({ dest: path.join(__dirname, 'public/upload/temp') }).single('image')); //imagenes servidor

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ----------El servidor antes de responder verifica cookies {
app.use(session({ // Manejo del servidor de las cookies
    secret: '3gsb2os82bwsk', // string para serializar/deserializar las cookies
    resave: true,
    saveUninitialized: true,
}));

app.use(flash()); //Antes de passport que lo usa y despues de session ya que las usa

app.use(passport.initialize()); //Arranca passport configura cookies
app.use(passport.session()); //Ejecuta proceso de lectura/escritura de cookie } --//





//Global variables (Middleware propio)
app.use((req, res, next) => {
    res.locals.fixed = false; //variable global para footer
    app.locals.error_msg = req.flash('error_msg');
    app.locals.success_msg = req.flash('success_msg');
    res.locals.user = req.user || null;
    next();
});




//// Routes
app.use(require('./routes/index'));


//// Static
app.use(express.static(path.join(__dirname, 'public')));

//// 404 handle
app.get('*', (req, res) => {
    res.send('Error 404 File not found');
});

//// Server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});