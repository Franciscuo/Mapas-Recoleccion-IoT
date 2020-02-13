const { Router } = require('express');
const router = Router();

const passport = require('passport');

const Threads = require('../models/threads');
const Users = require('../models/user');
const Members = require('../models/members');
const Projects = require('../models/projects');
const Publications = require('../models/Publications');


const moment = require('moment');

const fs = require('fs-extra');
const path = require('path');
const { randomNumber, randomPIN } = require('../helpers/lib');

const message = require('./emailMessage');


// ----------- Email 
const email = require('../email');

const oEmail = new email({
    "host": "smtp.tinkor.co",
    "port": "587",
    "secure": false,
    ignoreTLS: true,
    "auth": {
        "type": "login",
        "user": "francisco@tinkor.co",
        "pass": ""
    }
});









// ----------------- Rutas navegacion basica -----------
router.get('/', (req, res) => {
    res.render('home.hbs');
});

router.get('/integrantes', (req, res) => {
    res.redirect('/integrantes/1');
});

router.get('/integrantes/:page', async(req, res, next) => {
    const perPage = 6;
    const page = req.params.page || 1;
    await Members
        .find()
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, members) => {
            Members.count((err, count) => {
                if (err) return next(err);
                res.render('integrantes.hbs', {
                    members,
                    current: page,
                    pages: Math.ceil(count / perPage),

                });
            });
        });
});

router.get('/investigacion/proyectos', (req, res) => {
    res.redirect('/investigacion/proyectos/1');
});

router.get('/investigacion/proyectos/:page', async(req, res) => {
    const perPage = 6;
    const page = req.params.page || 1;
    await Projects
        .find()
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, projects) => {
            Projects.count((err, count) => {
                if (err) return next(err);
                res.render('proyectos.hbs', {
                    projects,
                    current: page,
                    pages: Math.ceil(count / perPage),

                });
            });
        });
});

router.get('/investigacion/publicaciones', async(req, res) => {
    const publications = await Publications.find();
    res.render('publicaciones.hbs', { publications });
});




router.get('/project/id/:id_project', async(req, res) => {
    const project = await Projects.findOne({ _id: req.params.id_project });
    res.render('project_entry.hbs', { project });

});

router.get('/foro', (req, res) => {
    res.redirect('/foro/1');
});

router.get('/foro/:page', async(req, res) => {
    const perPage = 3;
    const page = req.params.page || 1;
    const mostComments = await Threads.find().limit(3).sort({ commentsNumber: -1 });
    await Threads
        .find()
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, threads) => {
            Threads.count((err, count) => {
                if (err) return next(err);
                res.render('foro.hbs', {
                    threads,
                    mostComments,
                    current: page,
                    pages: Math.ceil(count / perPage),

                });
            });
        });
});

router.get('/foro/id/:thread', async(req, res) => {
    const thread = await Threads.findOne({ _id: req.params.thread });
    const mostComments = await Threads.find().limit(3).sort({ commentsNumber: -1 });
    res.render('entry.hbs', { thread, mostComments });

});

router.get('/contacto', (req, res) => {
    res.render('contact.hbs');
});

router.get('/forgot', isNotAuthenticated, (req, res) => {
    res.render('users/forgot.hbs');
});









// ----------------Rutas cuentas de usuario ------------------------------------------
router.get('/login', isNotAuthenticated, (req, res) => {
    if (req.isAuthenticated()) {
        const redirect = '/user/id/' + req.user.user;
        res.redirect(redirect);
    } else {
        res.render('users/login.hbs');
    }
});

router.get('/signup', isNotAuthenticated, (req, res) => {
    if (req.isAuthenticated()) {
        const redirect = '/user/id/' + req.user.user;
        res.redirect(redirect);
    } else {
        res.render('users/signup.hbs');
    }
});

router.post('/user/signup', passport.authenticate('local-signup', {
    successReturnToOrRedirect: '/foro',
    failureRedirect: '/signup',
    passReqToCallback: true, //Config para pasar los datos recibidos por el formulario
}));

router.post('/user/login', passport.authenticate('local-signin', {
    successReturnToOrRedirect: '/foro',
    failureRedirect: '/login',
    passReqToCallback: true, //Config para pasar los datos recibidos por el formulario
}));

router.get('/user/id/:nickname', async(req, res) => {
    const user = await Users.findOne({ user: req.params.nickname });
    if (req.isAuthenticated()) {
        res.render('users/profile.hbs', { user });
    } else {
        const no_user = true;
        res.render('users/profile.hbs', { user, no_user });
    }
});

router.get('/user/config/:nickname', isAuthenticated, async(req, res) => {
    if (req.user.user == req.params.nickname) {
        res.render('users/config.hbs');
    } else {
        req.flash('error_msg', 'Para realizar esta accion debe ingresar a su cuenta');
        res.redirect('back')
    }

});

router.post('/user/change/description/:nickname', isAuthenticated, async(req, res) => {
    try {
        if (req.user.user == req.params.nickname) {
            const userData = await Users.findOne({ user: req.params.nickname });
            userData.description = req.body.text;
            await userData.save();
            req.flash('success_msg', 'Descripcion actualizada correctamente');
            res.redirect('/user/config/' + req.params.nickname);
        } else {
            req.flash('error_msg', 'Para realizar esta accion debe ingresar a su cuenta');
            res.redirect('/user/config/' + req.params.nickname);
        }
    } catch (e) {
        req.flash('error_msg', '\n' + e);
        res.redirect('/user/config/' + req.params.nickname);
    }
});


router.post('/user/change/email/:nickname', isAuthenticated, async(req, res) => {
    try {
        if (req.user.user == req.params.nickname) {

            if (req.body.newEmail == req.body.confirmEmail) {
                const email = await Users.findOne({ email: req.body.newEmail })
                if (email) {
                    req.flash('error_msg', 'El email ya esta en uso');
                    res.redirect('/user/config/' + req.params.nickname);
                } else {
                    const userData = await Users.findOne({ user: req.params.nickname });
                    userData.email = req.body.newEmail;
                    await userData.save();
                    req.flash('success_msg', 'Email actualizado correctamente');
                }
                res.redirect('/user/config/' + req.params.nickname);
            } else {
                req.flash('error_msg', 'La confirmación del email no coincide');
                res.redirect('/user/config/' + req.params.nickname);
            }
        } else {
            req.flash('error_msg', 'Para realizar esta accion debe ingresar a su cuenta');
            res.redirect('/user/config/' + req.params.nickname);
        }
    } catch (e) {
        req.flash('error_msg', '\n' + e);
        res.redirect('/user/config/' + req.params.nickname);
    }
});

router.post('/user/change/password/:nickname', isAuthenticated, async(req, res) => {
    try {
        if (req.user.user == req.params.nickname) {
            const userData = await Users.findOne({ user: req.params.nickname });
            const pass = await userData.matchPassword(req.body.actualPassword);
            if (!pass) {
                req.flash('error_msg', 'Contraseña actual incorrecta');
                res.redirect('/user/config/' + req.params.nickname);
            } else {

                if (req.body.newPassword == req.body.confirmPassword) {
                    userData.password = await userData.encryptPassword(req.body.newPassword);
                    await userData.save();
                    req.flash('success_msg', 'Contraseña actualizada correctamente');
                    res.redirect('/user/config/' + req.params.nickname);
                } else {
                    req.flash('error_msg', 'Las contraseñas no coinciden');
                    res.redirect('/user/config/' + req.params.nickname);

                }

            }

        } else {
            req.flash('error_msg', 'Para realizar esta accion debe ingresar a su cuenta');
            res.redirect('/user/config/' + req.params.nickname);
        }
    } catch (e) {
        console.log('fase 6');
        req.flash('error_msg', '\n' + e);
        res.redirect('/user/config/' + req.params.nickname);
    }
});

router.get('/logout', (req, res, next) => {
    req.logOut();
    res.redirect('/')
});










// ---- RUTAS OLVIDE CONTRASEÑA ------------------

router.post('/userEmail', async(req, res) => { //verificar email y enviar correo
    const emailUser = await Users.findOne({ email: req.body.email });
    const pin = randomPIN();
    if (emailUser) {
        let email = {
            from: "francisco@tinkor.co",
            to: req.body.email,
            subject: "GETS - Recuperar contraseña",
            html: message.text(pin),
        }
        await oEmail.enviarCorreo(email, async function(error) {
            if (error) {
                res.json({ user: false });
            } else {
                let date = Date.now();
                dateLimit = moment(date).add(12, 'h').toDate();
                date = date.add
                emailUser.pin = pin;
                emailUser.datePin = dateLimit;
                await emailUser.save();
                res.json({ user: true });
            }
        });
    } else {
        res.json({ user: false });
    }
});

router.post('/userPin', async(req, res) => { //verificar codigo de correo
    const emailUser = await Users.findOne({ email: req.body.email });
    if (emailUser) {
        const dateNow = Date.now();
        if (emailUser.pin == req.body.pin && dateNow < emailUser.datePin) {
            res.json({ pin: true });
        } else {
            res.json({ pin: false });
        }
    } else {
        res.json({ pin: false });
    }
});


router.post('/userRestorePassword', async(req, res) => { //actualizar contraseña
    const emailUser = await Users.findOne({ email: req.body.email });
    if (emailUser) {
        const dateNow = Date.now();
        if (emailUser.pin == req.body.pin && dateNow < emailUser.datePin) {
            emailUser.password = await emailUser.encryptPassword(req.body.password);
            await emailUser.save();
            res.json({ update: true });
        } else {
            res.json({ update: false });
        }
    } else {
        res.json({ update: false });
    }

});












// ------------------ Hilos -------------------------------

router.post('/new-thread', async(req, res) => { // nuevo hilo
    console.log(' ------ 1.1 ------');
    if (!req.isAuthenticated()) {
        console.log('Usuario no autenticado');
        console.log(' ------ 1.2 ------');
        res.json({ error: true });
    } else {
        console.log(' ------ 1.3 ------');
        const avatar = await Users.findOne({ user: req.user.user })
        const newThread = new Threads();
        newThread.title = req.body.title;
        newThread.text = req.body.text;
        newThread.user = req.user.user;
        newThread.avatar = avatar.avatar;

        await newThread.save(err => { //guarda el esquema creado
            if (err) {
                console.log('----- Error: ', err);
                req.flash('error_msg', 'Error al guardar hilo', err);
                res.json({ error: true, data: false });
            } else {
                console.log('----- Bien: ');
                req.flash('success_msg', 'Nuevo hilo creado');
                res.json({ error: false, data: newThread.threadId });
            }

        });
    }
});


router.delete('/threadDelete/:id_thread', isAuthenticated, async(req, res) => { //Borrar hilo
    const thread = await Threads.findOne({ _id: req.params.id_thread });
    if (thread) {
        await thread.remove();
        res.json({ error: false });
    } else {
        console.log('El hilo no existe');
        res.json({ error: true });
    }

});

router.put('/threadUpdate/:id_thread', isAuthenticated, async(req, res) => { // Editar hilo
    const thread = await Threads.findOne({ _id: req.params.id_thread });
    if (thread) {
        thread.text = req.body.text;
        thread.title = req.body.title;
        await thread.save(err => { //guarda el esquema creado
            if (err) {
                req.flash('error_msg', 'Error al guardar hilo', err);
                res.json({ error: false });
            } else {
                req.flash('success_msg', 'Hilo actualizado');
                res.json({ error: false });
            }
        });
    } else {
        console.log('El hilo no existe');
        res.json({ error: true });
    }
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Para realizar esta accion debe ingresar a su cuenta');
    res.redirect('back')
}

function isNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/foro');
    } else {
        return next();
    }
}







//---------- Comentarios ---------------

router.post('/new-comment/:father/:id_thread', isAuthenticated, async(req, res) => { //Nuevo comentario
    let thread = await Threads.findOne({ _id: req.params.id_thread });
    let commentsNumber = thread.commentsNumber;
    let self_link = commentsNumber + 1;
    const comment = {
        user: req.user.user,
        avatar: req.user.avatar,
        text: req.body.text,
        father: req.params.father,
        self: commentsNumber + 1
    }
    thread.commentsNumber = thread.commentsNumber + 1;
    thread.comments.push(comment);
    await thread.save();
    res.redirect('/foro/id/' + req.params.id_thread + '#' + self_link);
});

router.delete('/commentDelete/:id_thread/:id_comment', isAuthenticated, async(req, res) => { //Borrar comentario
    const thread = await Threads.findOne({ _id: req.params.id_thread });
    let commentsAux = [];
    if (thread) {
        thread.comments.forEach(function(comment) {
            if (comment._id == req.params.id_comment) {
                console.log('comentario encontrado !');
            } else {
                commentsAux.push(comment);
            }
        });
        thread.comments = commentsAux;
        await thread.save();
        res.json(true);
    } else {
        console.log('El hilo no existe');
        res.json(false);
    }

});

router.put('/commentUpdate/:id_thread/:id_comment', isAuthenticated, async(req, res) => { //Editar comentario
    const thread = await Threads.findOne({ _id: req.params.id_thread });
    let commentsAux = [];
    if (thread) {
        thread.comments.forEach(function(comment) {
            if (comment._id == req.params.id_comment) {
                comment.text = req.body.text;
                commentsAux.push(comment);
            } else {
                commentsAux.push(comment);
            }
        });
        thread.comments = commentsAux;
        await thread.save();
        res.json(true);
    } else {
        console.log('El hilo no existe');
        res.json(false);
    }
});








// --------- INTEGRANTES --------------------
router.post('/new-member', isAuthenticated, (req, res) => { //Nuevo integrantes & investigador
    try {
        const saveImage = async() => {

            const imgUrl = randomNumber();
            const images = await Members.find({ filename: imgUrl });
            if (images.length > 0) {
                saveImage();
            } else {
                const imageTempPath = req.file.path;
                const ext = path.extname(req.file.originalname).toLowerCase();
                const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);

                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                    await fs.rename(imageTempPath, targetPath);
                    const newMember = new Members({
                        name: req.body.name,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        cvlac: req.body.cvlac,
                        filename: imgUrl + ext,
                        undergrate: req.body.undergrate,
                        graduate: req.body.graduate

                    });
                    await newMember.save();
                    res.redirect('/integrantes');
                } else {
                    await fs.unlink(imageTempPath);
                    res.status(500).json({ error: 'Solo imagenes estan permitidas' });
                }

            }

        }

        saveImage();
    } catch (e) {
        console.log('---------- Error ---------');
        console.error(e);
    }

});

router.delete('/memberDelete/:id_member', isAuthenticated, async(req, res) => { // Borrar integrante & investigador
    const member = await Members.findOne({ _id: req.params.id_member });
    if (member) {
        await fs.unlink(path.resolve('./src/public/upload/' + member.filename));
        await member.remove();
        res.json(true);
    } else {
        console.log('El integrante no existe');
        res.json(false);
    }
});





// ------------------- PROYECTOS ---------

router.post('/new-project', isAuthenticated, async(req, res) => {
    const newProject = new Projects({
        title: req.body.title,
        description: req.body.description,
        content: req.body.text,

    });
    await newProject.save(function(err) {
        if (err) {
            res.json({ error: true, data: newProject.projectId })
        } else {
            req.flash('success_msg', 'Proyecto creado');
            res.json({ error: false, data: newProject.projectId })
        }
    });

});

router.delete('/projectDelete/:id_project', isAuthenticated, async(req, res) => {
    if (req.user.admin) {
        const project = await Projects.findOne({ _id: req.params.id_project });
        if (project) {
            await project.remove(function(err) {
                if (err) {
                    res.json({ error: true });
                } else {
                    res.json({ error: false });
                }
            });
        } else {
            res.json({ error: false });
        }
    } else {
        res.json({ error: false });
    }
});

router.put('/proyectUpdate/:id_project', isAuthenticated, async(req, res) => { // Editar proyecto
    const proyect = await Projects.findOne({ _id: req.params.id_project });
    if (proyect && req.user.admin) {
        proyect.content = req.body.content;
        proyect.title = req.body.title;
        proyect.description = req.body.description;
        await proyect.save(err => { //guarda el esquema creado
            if (err) {
                req.flash('error_msg', 'Error al actualizar proyecto', err);
                res.json({ error: false });
            } else {
                req.flash('success_msg', 'Proyecto actualizado');
                res.json({ error: false });
            }
        });
    } else {
        console.log('El proyecto no existe');
        res.json({ error: true });
    }
});


// ------------ PUBLICACIONES --------------

router.post('/new-publication', isAuthenticated, async(req, res) => {
    const newPublication = new Publications({
        title: req.body.title,
        link: req.body.link,
        date: req.body.date,

    });
    await newPublication.save(function(err) {
        if (err) {
            res.json({ error: true })
        } else {
            req.flash('success_msg', 'Publicación creada');
            res.json({ error: false })
        }
    });

});

router.delete('/publicationDelete', isAuthenticated, async(req, res) => {
    if (req.user.admin) {
        const publication = await Publications.findOne({ _id: req.body.id });
        if (publication) {
            await publication.remove(function(err) {
                if (err) {
                    res.json({ error: true });
                } else {
                    res.json({ error: false });
                }
            });

        } else {
            res.json({ error: true })
        }
    } else {
        res.json({ error: true })
    }
});

module.exports = router;