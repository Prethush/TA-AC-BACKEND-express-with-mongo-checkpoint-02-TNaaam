let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let remarkSchema = new Schema({
    title: {type: String, required: true},
    author: String,
    likes: {type: Number, default: 0},
    eventId: {type: Schema.Types.ObjectId, ref: 'Event', required: true}
}, {timestamps: true});

module.exports = mongoose.model('Remark', remarkSchema);