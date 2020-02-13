// Se usa mongoose como esquema de validacion antes de guardar archivos en la base de datos
const mongoose = require('mongoose');
const { Schema } = mongoose; //se va a crear un objeto timo esquema


const PublicationSchema = new Schema({ //se define las propiedades del nuevo esquema
    title: { type: String, required: true },
    link: { type: String, required: true },
    date: { type: Date, required: true }
});

PublicationSchema.virtual('publicationId')
    .get(function() {
        console.log('works');
        return this._id;
    });

module.exports = mongoose.model('Publications', PublicationSchema) //El metodo model guarda documentos con el esquema 
    //.....................................................definido en la collecion users