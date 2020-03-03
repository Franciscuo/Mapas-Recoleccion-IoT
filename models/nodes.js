//Creación de base de datos de usuarios
const { Schema, model } = require('mongoose');

const nodeSchema = new Schema({
    eui: {type: String, required: true},
    model: {type: String, required: true},
    customer_id: {type:String, required: true}
});

module.exports = model('Node', nodeSchema);