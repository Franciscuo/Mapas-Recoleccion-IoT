// Se usa mongoose como esquema de validacion antes de guardar archivos en la base de datos
const mongoose = require('mongoose');
const { Schema } = mongoose; //se va a crear un objeto timo esquema


const ThreadSchema = new Schema({ //se define las propiedades del nuevo esquema
    title: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    user: { type: String },
    avatar: { type: String },
    commentsNumber: { type: Number, default: 0 },
    comments: [{
        user: { type: String },
        avatar: { type: String },
        text: { type: String },
        father: { type: Number },
        self: { type: Number },
        date: { type: Date, default: Date.now }
    }]
});

ThreadSchema.virtual('threadId')
    .get(function() {
        console.log('works');
        return this._id;
    });

module.exports = mongoose.model('Thread', ThreadSchema) //El metodo model guarda documentos con el esquema 
    //.....................................................definido en la collecion users