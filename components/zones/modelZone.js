const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const zoneSchema = new Schema({
    name: { type: String, required: true },
    number: { type: Number, required: true }, // new,resolved, collect
    capacity: { type: Number, required: true },
    start: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    end: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    }
});

const model = mongoose.model('Zones', zoneSchema)

module.exports = model