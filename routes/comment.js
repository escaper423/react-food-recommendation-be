const express = require('express');
const router = express.Router();
const commentData = require('../models/comment');
const replyData = require('../models/reply');
const tag = "- Comment - "
//get all comments with a post
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;
    console.log(tag + "Getting comments with board item id "+id);
    const commentPage = parseInt(req.query.page);
    const commentLimit = parseInt(req.query.limit);
    console.log(tag + "Comment Page: "+commentPage);
    console.log(tag + "Comment Limit: "+commentLimit);
    
    const cmt = await commentData.find({pid: id}, null, { skip: (commentPage - 1) * commentLimit, limit: commentLimit});
    const cnt = await commentData.countDocuments({pid: id } ,null, {skip: (commentPage - 1) * commentLimit, limit: commentLimit});
    if (!cmt) {
        res.status(404).send();
    }
    else {
        //console.log(cmt);
        res.status(200).send({
            comments: cmt,
            count: cnt
        });
    }

});

//write new one
router.post("/", (req, res) => {
    console.log(tag + "Creating comment...");
    let newComment = new commentData(req.body);
    console.log(tag + "Data: " + newComment)
    newComment.save((err) => {
        if (err) {
            console.log(err);
            res.status(500).send(tag + "Can`t post comment");
        }
        else {
            res.status(200).send(tag + "Created a comment.");
        }
    })
    console.log(tag + "Done");
});

//delete comment
router.delete("/:cid", async (req, res) => {
    console.log(tag+"Deleting comment")
    const targetID = req.params.cid;
    const pw = req.query.password;
    const commentItem = await commentData.find({ cid: targetID });

    if (commentItem) {
        if (commentItem[0].password === pw) {
            commentData.deleteOne({ cid: targetID }, (err, doc) => {
                if(err){
                    //delete failed
                    console.log(tag+"Failed to delete."+err);
                    res.status(500).send(err)
                }
                else{
                    //delete success
                    console.log(tag+"Delete Success");
                    replyData.deleteMany({cid: targetID})
                    res.status(200).send("Done with board item"+doc);
                }
            })
        }
        else{
            res.status(403).send("Incorrect password");
        }
    }
    else{
        res.status(404).send("The item does not exist");
    }
})

module.exports = router;