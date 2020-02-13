// Se usa mongoose como esquema de validacion antes de guardar archivos en la base de datos
const mongoose = require('mongoose');
const { Schema } = mongoose; //se va a crear un objeto timo esquema


const MemberSchema = new Schema({ //se define las propiedades del nuevo esquema
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    email: { type: String },
    cvlac: { type: String },
    filename: { type: String },
    undergrate: { type: String },
    graduate: { type: String }
});


module.exports = mongoose.model('Members', MemberSchema) //El metodo model guarda documentos con el esquema 
    //.....................................................definido en la collecion users