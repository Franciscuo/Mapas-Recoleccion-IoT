const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const routeSchema = new Schema({
    zone: { type: String, required: true },
    nodes: [{
        type: Schema.ObjectId,
        ref: 'Node'
    }]
});

const model = mongoose.model('Routes', routeSchema)

module.exports = model