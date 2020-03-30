const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const nodeSchema = new Schema({
    eui: {type: String, required: true, unique: true},
    model: {type: String, required: true},
    description: {type:String, required: true}
});

const model = mongoose.model('Node', nodeSchema)

module.exports = model