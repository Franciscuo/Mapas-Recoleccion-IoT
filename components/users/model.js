const mongoose = require('mongoose')

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

module.exports = model