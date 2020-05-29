const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const nodeSchema = new Schema({
    eui: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    pass: { type: String, required: true },
    address: { type: String },
    coords: [
        { type: Number, required: true },
    ],
    zone: {
        type: Schema.ObjectId,
        ref: 'Zone',
    },
    owner:{
        type: Schema.ObjectId,
        ref: 'User',
    },
});

const model = mongoose.model('Node', nodeSchema)

module.exports = model