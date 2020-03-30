//Creación de base de datos de usuarios
const { Schema, model } = require('mongoose');

const customerSchema = new Schema({
    address: {type: String, required: true},
    latitude: {type: String, required: true},
    longitude: {type:String, required: true},
    phone: {type: String, required: true},
    name: {type: String, required: true},
    email: {type:String, required: true},
    node: {
        type: Schema.ObjectId, 
        ref: 'Node'
    }
});

module.exports = model('Customer', customerSchema);