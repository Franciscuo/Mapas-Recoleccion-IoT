const User = require('../models/user');

const userCtrl = {};

userCtrl.login = (req, res) => {
    res.render('users/login.hbs')
}

userCtrl.signup = (req, res) => {
    res.render('users/signup.hbs')
}

userCtrl.forgot = (req, res) => {
    res.send('Olvide contarseña');
}

userCtrl.apiSignup = async(req, res) => {
    const { username, name, lastName, email, password } = req.body; //Destructuring 
    try {
        const newUser = new User({
            username: username,
            name: name,
            lastName: lastName,
            email: email,
            password: ''
        })
        newUser.password = await newUser.encriptarPassword(password);
        await newUser.save() //guarda el modelo y el modelo llama al ORM Y este a la base de datos
            .then(data => {
                res.json({ saved: true });
            })
            .catch(e => {
                res.json({ saved: false });
            })
    } catch (e) {
        res.json({ saved: false });
    }
}



module.exports = userCtrl;