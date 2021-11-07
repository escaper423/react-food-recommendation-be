const express = require('express');
const router = express.Router();

const replyData = require('../models/reply');
const tag = "- Reply - ";

router.get("/:cid", async (req, res) => {
    const id = req.params.cid;
    console.log(tag + "Getting replies from comment id "+id);
    const cmt = await replyData.find({ cid: id });
    const cnt = await replyData.countDocuments({cid: id});
    if (!cmt) {
        res.status(404).send();
    }
    else {
        //console.log(cmt);
        res.status(200).send({
            replies: cmt,
            count: cnt
        });
    }
});

//write new one
router.post("/", (req, res) => {
    console.log(tag + "Creating comment...");
    let newReply = new replyData(req.body);
    console.log(tag + "Data: " + newReply)
    newReply.save((err) => {
        if (err) {
            console.log(err);
            res.status(500).send(tag + "Can`t post reply");
        }
        else {
            res.status(200).send(tag + "Created a reply.");
        }
    })
    console.log(tag + "Done");
});

//delete reply
router.delete("/:rid", async (req, res) => {
    console.log(tag+"Deleting reply")
    const targetID = req.params.rid;
    const pw = req.query.password;
    const replyItem = await replyData.find({ rid: targetID });

    if (replyItem) {
        if (replyItem[0].password === pw) {
            replyData.deleteOne({ rid: targetID }, (err, doc) => {
                if(err){
                    //delete failed
                    console.log(tag+"Failed to delete."+err);
                    res.status(500).send(err)
                }
                else{
                    //delete success
                    console.log(tag+"Delete Success");
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