const mongoose = require('mongoose')
const bcrypt = require('bcryptjs'); //Hash de contraseña
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    admin: {type: Boolean, default: false},
    collector: {type: Boolean, default: false},
    date: { type: Date, default: Date.now }
});

const model = mongoose.model('User', userSchema)

userSchema.methods.equalPassword = async (password) => { //Se define un metodo para el esquema que permite comparar contraseña
    return await bcrypt.compare(password, this.password);
}

module.exports = model