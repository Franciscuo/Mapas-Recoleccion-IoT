//Creación de base de datos de usuarios
const { Schema, model } = require('mongoose');

const bcrypt = require('bcryptjs'); //Hash de contraseña


const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    admin: {type: Boolean, default: false},
    collector: {type: Boolean, default: false},
    date: { type: Date, default: Date.now }
});

userSchema.methods.encriptarPassword = async(password) => { //se define un metodo para el esquema que permite encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

userSchema.methods.igualesPassword = async function(password) { //Se define un metodo para el esquema que permite comparar contraseña
    return await bcrypt.compare(password, this.password);
}

module.exports = model('user', userSchema);