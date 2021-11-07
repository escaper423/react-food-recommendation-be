const express = require('express');
const router = express.Router();
const bc = require('bcrypt');

function prt(msg){
    return console.log(msg);
}

//Signing up user
router.post('/', async (req, res) => {
    const db = require('../components/db.js');
    try {
        console.log("Getting user info...");
        const userInfo = require('../models/users');
        const user = new userInfo(req.body);
        user.password = await bc.hash(user.password, 10);

        prt("Finding existing user...");
        userInfo.find({ username: user.username }, (err, doc) => {
            if (err) {
                prt(err);
                res.status(500).send("Something is wrong with db.");
            }   
            else if (doc.length !== 0) {
                res.status(409).send("User already exists.");
            }
            else {
                user.save((err, user) => {
                    if (err) {
                        console.error(err);
                        throw err;
                    }
                    else {  
                        prt(user.username + " saved to userinfo.");
                        prt("Successfilly saved.");
                        res.status(200).send(user.username);
                    }
                });
            }
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
    
});

module.exports = router;