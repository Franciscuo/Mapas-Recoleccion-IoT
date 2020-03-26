//Creación de base de datos de usuarios
const { Schema, model } = require('mongoose');

const customerSchema = new Schema({
    address: {type: String, required: true},
    latitud: {type: String, required: true},
    longitud: {type:String, required: true},
    phone: {type: String, required: true},
    name: {type: String, required: true},
    email: {type:String, required: true}
});

module.exports = model('Customer', customerSchema);