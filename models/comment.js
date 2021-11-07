const mongoose = require('mongoose');
const CommentIncrement = require('mongoose-sequence')(mongoose);
const reply = require('./reply')
const tag = "- CommentModel - "

const commentSchema = new mongoose.Schema(
    {
        pid: {type: mongoose.Schema.Types.Number, ref: 'boards'},
        writer: String,
        password: String,
        content: Object,
        date: Date
    },
);

commentSchema.pre('deleteOne', async function(next){
    try{
        await reply.deleteMany({
            'cid': {
                $in: this._conditions.cid
            }
        })
        next();
    }
    catch(err){
        next(err);
    }
})
commentSchema.plugin(CommentIncrement, {inc_field: 'cid'})
module.exports = mongoose.model('comments', commentSchema);