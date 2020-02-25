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




module.exports = userCtrl;