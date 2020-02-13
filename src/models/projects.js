// Se usa mongoose como esquema de validacion antes de guardar archivos en la base de datos
const mongoose = require('mongoose');
const { Schema } = mongoose; //se va a crear un objeto timo esquema


const ProjectSchema = new Schema({ //se define las propiedades del nuevo esquema
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true }
});

ProjectSchema.virtual('projectId')
    .get(function() {
        console.log('works');
        return this._id;
    });

module.exports = mongoose.model('Projects', ProjectSchema) //El metodo model guarda documentos con el esquema 
    //.....................................................definido en la collecion users