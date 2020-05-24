const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const zoneSchema = new Schema({
    name: { type: String, required: true, unique: true },
    number: { type: Number, required: true, unique: true }, // new,resolved, collect
    capacity: { type: Number, required: true },
    start: [
        { type: Number, required: true },
    ],
    end: [
        { type: Number, required: true },
    ]
});

const model = mongoose.model('Zones', zoneSchema)

module.exports = model