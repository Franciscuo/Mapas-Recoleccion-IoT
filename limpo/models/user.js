//Creación de base de datos de usuarios
const { Shema, model } = require('mongoose');


const userSchema = new userSchema({
    name: { type: String },
    password: { type: String }
});

module.exports = model('user', module);