const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const comments = require('./comment');
const replies = require('./reply');
const tag = "- BoardItemModel - "
const boardItemSchema = new mongoose.Schema(
    {
        category: String,
        date: Date,
        writer: String,
        password: String,
        title: String,
        content: Object,
        views: Number,
        commends: Number
    }, {_id: false}
);

boardItemSchema.plugin(AutoIncrement);

boardItemSchema.pre('deleteOne', async function(next){
    try{
        console.log(tag+"Cascading delete with id: "+this._conditions._id);
        await comments.deleteMany({
            "pid": {
                $in: this._conditions._id
            }
        });

        await replies.deleteMany({
            "pid": {
                $in: this._conditions._id
            }
        });
        
        console.log(tag+"Success")
        next();
    }
    catch(err){
        console.log(err);
        next(err);
    }
})
module.exports = mongoose.model('boards', boardItemSchema);