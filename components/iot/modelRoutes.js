const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const routeSchema = new Schema({
    status: { type: String, required: true }, // new,resolved, collect
    time: { type: Number, default: 0 },
    distance: { type: Number, default: 0 },
    date: { type: Date, required: true }, //date of update status
    nodes: [{
        type: Schema.ObjectId,
        ref: 'Node'
    }],
    zone: [{
        type: Schema.ObjectId,
        ref: 'Zone',
    }]

});

const model = mongoose.model('Routes', routeSchema)

module.exports = model