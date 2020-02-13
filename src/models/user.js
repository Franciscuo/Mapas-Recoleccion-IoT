// Se usa mongoose como esquema de validacion antes de guardar archivos en la base de datos
const mongoose = require('mongoose');
const { Schema } = mongoose; //se va a crear un objeto timo esquema

const bcrypt = require('bcryptjs');

const UserSchema = new Schema({ //se define las propiedades del nuevo esquema
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: String,
    user: { type: String },
    avatar: { type: String },
    description: { type: String },
    admin: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    pin: { type: Number, default: 000000 },
    datePin: { type: Date, default: Date.now }
});

UserSchema.methods.encryptPassword = async(password) => { //se define un metodo para el esquema que permite encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchPassword = async function(password) { //Se define un metodo para el esquema que permite comparar contraseña
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.seeRole = function() {
    return this.class;
}
module.exports = mongoose.model('users', UserSchema) //El metodo model guarda documentos con el esquema 
    //.....................................................definido en la collecion users