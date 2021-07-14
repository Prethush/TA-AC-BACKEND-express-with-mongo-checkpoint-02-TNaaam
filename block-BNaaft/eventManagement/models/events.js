let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let eventSchema = new Schema({
    title: {type: String, required: true},
    summary: {type: String, required: true},
    host: String,
    startDate: Date,
    endDate: Date,
    categories: [String],
    location: String,
    likes: {type: Number, default: 0},
    remarks: [{type: Schema.Types.ObjectId, ref: 'Remark'}]

}, {timestamps: true});

module.exports = mongoose.model('Event', eventSchema);