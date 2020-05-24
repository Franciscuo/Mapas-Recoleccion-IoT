const { Schema, model } = require('mongoose');

const bcrypt = require('bcryptjs'); //Hash de contraseña

const userSchema = new Schema({
    userName: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    rutes: [{
        type: Schema.ObjectId,
        ref: 'Routes',
    }],
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    role: { type: String, default: "none", required: false },
    nodes: [{
        type: Schema.ObjectId,
        ref: 'Node',
    }]
});

userSchema.methods.equalPassword = async function(password) { //Se define un metodo para el esquema que permite comparar contraseña
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.encryptPassword = async(password) => { //se define un metodo para el esquema que permite encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

module.exports = model('user', userSchema);