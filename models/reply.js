const mongoose = require('mongoose');
const ReplyIncrement = require('mongoose-sequence')(mongoose);

const replySchema = new mongoose.Schema(
    {
        pid: {type: mongoose.Schema.Types.Number, ref: 'boards'},
        cid: {type: mongoose.Schema.Types.Number, ref: 'comments'},
        target: {type: String, default: null},
        writer: String,
        password: String,
        content: Object,
        date: Date
    },
);
replySchema.plugin(ReplyIncrement, {inc_field: 'rid'});
module.exports = mongoose.model('replies', replySchema);