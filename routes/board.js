const express = require('express');
const router = express.Router();
const boardData = require('../models/boarditem');
const tag = "- Board - ";

//get items by category
//category and sort priority arrays have to be changed if needed
router.get("/", async (req, res) => {
    const type = req.query.category;
    const searchWord = req.query.query;
    const searchOption = req.query.filter;
    const sort = req.query.sort;
    const page = parseInt(req.query.page);
    const itemLimit = parseInt(req.query.limit);

    let filter = {}
    
    console.log(tag+page);
    if (type != 'all')
        filter.category = type;

    if (searchOption && searchWord) {
        if (searchOption === 'writer')
            filter = {...filter, "writer": {$regex: ".*"+searchWord+".*"}};
        else if (searchOption === 'title')
            filter = {...filter, "title": {$regex: ".*"+searchWord+".*"}};
    }
    
    console.log(filter);
    let boardItems;
    let itemCount = await boardData.countDocuments(filter, err => {
        if (err){
            return res.status(500).send("Cannot count items");
        }   
    });
    console.log(tag + "query category: " + type + "\npage: " + page + "\nsort: " + sort + "\n");
    switch (sort) {
        case "recent":
            boardItems = await boardData.find(filter, null, { skip: (page - 1) * itemLimit, limit: itemLimit }).sort({ _id: -1 });
            break;
        case "views":
            boardItems = await boardData.find(filter, null, { skip: (page - 1) * itemLimit, limit: itemLimit }).sort({ views: -1 });
            break;
        case "commends":
            boardItems = await boardData.find(filter, null, { skip: (page - 1) * itemLimit, limit: itemLimit }).sort({ commends: -1 });
            break;
    }

    if (boardItems) {
        return res.status(200).send({
            count: itemCount,
            boardItems: boardItems
        });
    }
    else {
        return res.status(500).send();
    }
});

//get an item
router.get(["/:category/:_id"], async (req, res) => {
    const itemCategory = req.params.category;
    const itemID = req.params._id;

    console.log(tag+"Getting item with id "+itemID+ " and category "+itemCategory);
    const boardItem = await boardData.find({_id: itemID, category: itemCategory});
    if (boardItem){
        //console.log(tag+"Found Board Item"+boardItem);
        return res.status(200).send(boardItem);
    }
    else{
        console.log(tag+"Cannot Bound")
        return res.status(404).send("The item cannot be found.");
    }
});

//write new item
router.post("/", async (req, res) => {
    console.log(tag+"Posting board item...");
    const boardInfo = new boardData(req.body);
    boardInfo.save((err) => {
        if (err) {
            return res.status(500).send("Failed");
        }
        else {
            return res.status(200).send("Success");
        }
    });
    console.log(tag+"done");
});

//update board item
router.put(["/:category/:_id"], async (req, res) => {
    console.log(tag + "Updating...");
    const action = req.query.query;

    let item = await boardData.findOne({ category: req.params.category, _id: req.params._id });
    if (item) {
        if (action === 'voteup') {
            console.log(tag+"action: "+action)
            item.commends += 1;
        }
        if (action === 'votedown') {
            console.log(tag+"action: "+action)
            item.commends -= 1;
        }
        if (action === 'view') {
            console.log(tag+"action: "+action)
            item.views += 1;
        }
        if (action === 'modify'){
            console.log(tag+"action: "+action)
            item.category = req.body.category;
            item.password = req.body.password;
            item.title = req.body.title;
            item.content = req.body.content;
        }

        item.save((err) => {
            if(err){
                return res.status(500).send("Failed to update.");
            }
            else{
                console.log(tag+"Done");
                return res.status(200).send("Done.");
            }
        });
    }
    else {
        return res.status(500).send("Failed. something wrong");
    }
});

router.delete("/:_id", async (req,res) => {
    const id = req.params._id;
    const pw = req.query.password;
    console.log(tag+"deleting with id: "+id);

    //get a post by id
    const boardItem = await boardData.find({_id: id});
    if (boardItem){
        if (pw === boardItem[0].password){
            boardData.deleteOne({_id: id}, (err, doc)=>{
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
            res.status(403).send("Incorrect password.");
        }
    }
    else{
        res.status(404).send("The item does not exist.");
    }
    
})

module.exports = router;